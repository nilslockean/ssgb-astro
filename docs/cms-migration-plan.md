# CMS Migration Plan Refinement

## Core Contracts

### Link Resolution Contract

All links resolve through one function: `resolveLinkTarget(target, context)`.

No component may call `routeUtils`, `getRelativeLocaleUrl`, `courseUrl`, `tripUrl`, `PageInternalLink` logic, or ad hoc locale path logic directly for editorial links. Components may only render the returned result.

Resolution order is deterministic:

1. If `target` is a CMS reference, call `resolveCmsRecordUrl(target, context.locale)`.
2. If CMS resolution returns `resolved`, use it.
3. If CMS resolution returns `unresolved` and `target.legacyFallback` exists, call `resolveLegacyUrl(target.legacyFallback, context.locale)`.
4. If target is explicitly legacy/static, call `resolveLegacyUrl(target.slug, context.locale)`.
5. If target is external URL, validate as external and return it.
6. If none resolve, return `unresolved`.

Forbidden behavior:

- Components must not implement their own fallback chains.
- Components must not infer URLs from `__typename + slug`.
- Components must not fall back to homepage directly.
- Components must not suppress diagnostics from unresolved editorial links.
- `getRelativeLocaleUrl` may be used only inside the resolver layer, not in rendering components.

All link-producing surfaces use this contract:

- Structured Text record links.
- Navigation items.
- Language switcher alternates.
- Button blocks.
- Course/trip cards.
- CTA components.
- Legacy `Link.astro`.

The resolver returns:

```ts
type LinkResolution =
  | { status: "resolved"; href: string; source: "cms" | "legacy" | "external" }
  | {
      status: "fallback";
      href: string;
      source: "legacy" | "locale_home";
      reason: CmsIssueCode;
      issue: CmsIssue;
    }
  | { status: "unresolved"; reason: CmsIssueCode; issue: CmsIssue };
```

`fallback` is still a diagnostic state. It is not considered healthy.

### Identity Contract

All routable CMS records use stable identity independent of slug.

Supported identity modes:

- `localized_single_record`: one Dato record ID, localized fields/slugs.
- `per_locale_records`: separate Dato records per language, connected by an explicit translation group field.

Configuration:

- Each routable model declares its identity mode in one resolver config map.
- Default for existing Dato models is `localized_single_record`.
- `per_locale_records` is forbidden unless the model has an explicit `translation_group_id` or `translations` reference field.

Alternate resolution:

- In `localized_single_record`, alternates are resolved by the same record ID and requested locale. Missing localized slug/content returns `unresolved: missing_locale` or `missing_slug`.
- In `per_locale_records`, alternates are resolved through the configured translation group. Missing mapped record returns `unresolved: missing_translation_mapping`.
- If identity mode is missing from config, resolver returns `unresolved: unsupported_type`.
- If mapping is incomplete, the language switcher receives the same `fallback` result as any other link and may render locale-home fallback only through the resolver contract.

Slug rules:

- Slug is route data only.
- Slug never identifies cross-locale equivalence.
- Slug conflicts are diagnostics and block promotion to `cms_live`.

### Promotion Contract

Promotion is explicit, atomic, and state-driven.

State is represented in code/config, not inferred from CMS existence:

```ts
type MigrationState = "static_only" | "cms_shadow" | "cms_live";
```

Promotion unit:

- For generic pages: one page family across declared locales, for example `about`, `pricing`, `contact`.
- For homepage: one locale at a time is allowed because route entrypoints are separate.
- For navigation: whole nav surface per locale, not individual menu items.
- For courses/trips: per model type only if route templates already exist.

Mechanical promotion:

1. Add CMS record IDs to a migration registry with state `cms_shadow`.
2. Shadow mode builds diagnostics while live rendering remains legacy/static.
3. When criteria pass, change only that registry entry from `cms_shadow` to `cms_live`.
4. The live route checks registry state and chooses CMS or static rendering.
5. Cleanup/deletion of static implementation happens only in a later phase.

Minimum promotion criteria:

- CMS record exists and is published for required locale(s).
- Resolved CMS URL exactly matches current production URL, or redirect is committed in same deploy.
- Required fields for rendering are present.
- All primary internal links resolve or have approved explicit legacy fallback.
- No `error` diagnostics for the promotion unit in CI/staging.
- SEO title/description are present or have configured fallback.
- Rollback static implementation still exists.

Rollback symmetry rule:

- The registry state and route rendering path must revert together.
- If promotion added redirects, rollback must either keep redirects valid or revert them in the same deploy.
- If navigation authority changed from `url` to `internal_link`, rollback must also restore authority to `url`.
- CMS content may remain in place after rollback, but must return to `cms_shadow`.

## Revised Phases

### Phase 1: Resolver Contract Added Beside Legacy Routing

Behavior change:

- Add `resolveLinkTarget`, `resolveCmsRecordUrl`, `resolveLegacyUrl`, and resolver config.
- Existing components keep behavior until migrated, but any touched link-rendering component must use `resolveLinkTarget`.
- `routeUtils` remains available only through `resolveLegacyUrl`.

Promotion impact:

- No content promotion allowed in this phase.
- This phase only establishes deterministic resolution.

### Phase 2: Existing CMS Link Surfaces Move To Contract

Behavior change:

- `PageInternalLink.astro`, button blocks, CMS page Structured Text links, course/trip Structured Text links use `resolveLinkTarget`.
- Component-specific URL branches are removed from those surfaces.
- Production unresolved links render according to Production Rules.

Promotion impact:

- CMS pages already live remain live, but link rendering is now contract-based.
- Rollback reverts these components to previous link behavior.

### Phase 3: Language Alternates Use Contract

Behavior change:

- `Layout` accepts current content identity.
- Language picker calls `getLocaleAlternates`, which internally calls `resolveLinkTarget`.
- Locale-home fallback is represented as a resolver fallback result, not language-switcher custom logic.

Promotion impact:

- No static page is promoted by this phase.
- Existing static pages continue root-locale behavior unless registered with identity.

### Phase 4: Navigation Shadow References

Behavior change:

- Dato nav supports both `url` and `internal_link`.
- Authoritative field is still `url`.
- `internal_link` is resolved only for diagnostics and conflict detection.
- Conflict rule: if both exist and resolve differently, `url` wins and diagnostic `nav_conflict` is emitted.

Deprecation rule:

- `url` is required during Phase 4.
- `internal_link` is optional.
- `url` cannot be removed.

### Phase 5: Navigation Reference Promotion

Behavior change:

- Authority flips per locale from `url` to `internal_link` only when the whole nav surface passes promotion criteria.
- Conflict rule after promotion: `internal_link` wins; `url` is ignored except as rollback fallback and diagnostic comparison.
- Unresolved `internal_link` falls back to `url` in production and emits `nav_reference_fallback`.

Deprecation rule:

- After one clean production deploy with zero `nav_reference_fallback`, creating new nav items with only `url` becomes forbidden in CI/staging diagnostics.
- After two clean production deploys, `url` is removed from rendering queries.
- After a final content audit, `url` field may be removed from Dato schema.

### Phase 6: Static Page Family Promotion

Behavior change:

- Each page family enters `cms_shadow` by registry entry.
- Route file chooses render path from registry state.
- CMS page links, blocks, and alternates use the resolver contract.

Promotion impact:

- Promotion is per page family.
- Rollback is changing registry entry back to `cms_shadow` or `static_only`.
- Static Astro implementation remains until a later cleanup phase.

### Phase 7: Homepage Singleton Promotion

Behavior change:

- Homepage singleton is registered independently from generic pages.
- `/`, `/en/`, and `/da/` route entrypoints remain.
- Each locale can move from static to shadow to live separately.
- Homepage CTAs and record references use `resolveLinkTarget`.

Promotion impact:

- Rollback flips the locale registry state back to static.
- Static homepage code remains until cleanup.

### Phase 8: Legacy Registry Deprecation

Behavior change:

- Remove legacy entries only when no live resolver result uses `source: "legacy"` for that entry.
- CI blocks deletion if diagnostics show fallback dependency.
- `routeUtils` may remain only for truly static routes not yet migrated.

Promotion impact:

- No new content promotion in this phase.
- This phase only removes unused legacy paths after evidence.

## Production Rules

Allowed to render in production:

- `resolved` links from CMS, legacy, or external targets.
- `fallback` links when the fallback is explicit and deterministic.
- Locale-home fallback only for language switcher alternates, and only when returned by resolver.
- Optional CMS modules with missing optional references may be omitted.

Never rendered in production:

- Developer placeholder text.
- Broken `<a href="">`, `#`, or guessed hrefs.
- Links inferred from unsupported CMS types.
- Links to unpublished or slugless CMS records.
- CMS block types without a registered renderer.
- Homepage fallback for ordinary internal links.

Logged only in production:

- Every `fallback` result.
- Every omitted optional module caused by CMS incompleteness.
- Every nav conflict, even if resolved deterministically.
- Missing translations for language switcher.

Dropped silently:

- Nothing. Optional omission still emits diagnostics.

Fallback navigation triggers:

- Navigation item unresolved after promotion: render `url` fallback if present and valid.
- Navigation item unresolved with no valid fallback: omit item and emit `error`.
- Language alternate unresolved: render locale-home fallback and emit `warn`.
- Structured Text internal link unresolved: render its text without an anchor and emit `warn`.
- Button/CTA unresolved: omit button and emit `warn`; if it is the only primary CTA on a live CMS page, emit `error`.

## Diagnostics + CI Rules

Severity levels:

- `error`: blocks promotion and fails CI/staging for promoted units.
- `warn`: allowed in production, counted as unhealthy until resolved.
- `info`: expected migration state.

Environment thresholds:

- Local: show all diagnostics; do not fail by default.
- CI: fail on `error`; fail on new warnings in already-promoted units.
- Staging: fail build on `error`; render visible diagnostics for `warn`.
- Production: never render diagnostics UI; emit structured logs/report.

Error diagnostics:

- Live CMS route missing required record.
- Live CMS route missing required slug.
- Unsupported block in live CMS page.
- Primary navigation unresolved with no valid fallback.
- Slug conflict for promoted route.
- Identity mode missing for promoted CMS model.
- Duplicate resolved URL among promoted CMS records.

Warn diagnostics:

- Missing translation.
- Language switcher locale-home fallback.
- Structured Text unresolved internal link.
- Navigation reference fallback to `url`.
- CMS shadow URL mismatch.
- Optional module omitted.

Aggregation rules:

- Diagnostics are grouped by promotion unit, locale, model type, record ID, and field path.
- A promotion unit is healthy only when it has zero `error` and zero unapproved `warn`.
- Warnings can be explicitly approved only with a code-level allowlist entry containing issue code, record ID, locale, reason, and expiry/removal phase.
- A phase cannot promote if its unit has unapproved warnings.

Migration health score:

- `green`: zero errors, zero unapproved warnings for promoted units.
- `yellow`: zero errors, warnings only in shadow or explicitly approved units.
- `red`: any error in CI/staging or any production fallback in primary navigation.
- Only `green` units can promote from `cms_shadow` to `cms_live`.

## No Divergence Guarantee

All rendering surfaces receive links as `LinkResolution` results from `resolveLinkTarget`.

Consistency enforcement:

- Add lint/test coverage that forbids direct imports of `routeUtils`, `getRelativeLocaleUrl`, `courseUrl`, `tripUrl`, and `localePath` outside the resolver layer and legacy compatibility tests.
- Snapshot/unit-test each link surface with the same resolver fixtures: Structured Text, nav, language switcher, button blocks, cards, and CTA links.
- Require every new CMS model that can be linked to be added to resolver config before it can appear in link fields.
- CMS queries may fetch references, but only resolver code may convert references into hrefs.
- Components may decide presentation for `resolved`, `fallback`, and `unresolved`, but may not decide where links point.
- Language switching has no separate path logic; alternates are just locale-specific calls into the same resolver.
- Promotion registry is the only mechanism deciding whether static or CMS rendering owns a route.
