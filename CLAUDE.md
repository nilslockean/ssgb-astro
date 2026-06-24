# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:4321)
npm run build        # Production build
npm run preview      # Preview production build locally
npm run lint         # ESLint on src/**/*.{js,astro}
npm run format       # Prettier formatting
npm run test         # All tests (unit + E2E)
npm run test:unit    # Vitest unit tests only
npm run test:e2e     # Playwright E2E tests only
npm run watch        # Vitest watch mode
```

## Architecture

### Content model

All content is fetched from DatoCMS at build time via custom loaders in `src/loaders/`. Collections are defined in `src/content.config.ts`. Each loader queries DatoCMS over GraphQL using `@datocms/cda-client` and stores entries via Astro's Content Layer API.

| Collection     | Loader              | Source       |
| :------------- | :------------------ | :----------- |
| `courses`      | `datoCoursesLoader` | DatoCMS      |
| `pages`        | `datoPagesLoader`   | DatoCMS      |
| `config`       | `configLoader`      | DatoCMS      |
| `trips`        | `datoTripsLoader`   | DatoCMS      |
| `team`         | `datoTeamLoader`    | DatoCMS      |
| `forms`        | `datoFormsLoader`   | DatoCMS      |
| `homePage`     | `homePageLoader`    | DatoCMS      |

Loaders for DatoCMS collections use a `${locale}-${slug}` entry ID strategy to prevent cross-locale slug collisions. The `slug` is always stored in `data` for use in routing.

GraphQL queries live in `src/lib/datoQueries.ts`. DatoCMS schema types are in `datoschema.ts` (root).

### Routing and navigation

Paths are centralised in `src/lib/routeUtils.ts`. Use `courseUrl(slug, locale)` and `tripUrl(slug, locale)` to build locale-aware URLs. Dynamic routes use `getStaticPaths()` with `params` derived from `post.data.slug`.

Navigation is fetched from DatoCMS `SiteConfig` via `getLocalizedConfig(locale)` in `src/lib/contentUtils.ts`, which returns three named nav trees: `primary` (sidebar + mobile), `secondary` (sidebar bottom), `footer` (desktop footer).

### Structured text

DatoCMS structured text fields are rendered with `<StructuredText>` from `@datocms/astro`. Block components live in `src/features/dato/`. Use `CdaStructuredTextValue` from `@datocms/astro/StructuredText` for type annotations in `.ts` files.

### CSS

No utility framework — plain CSS in `src/styles/global.css` with PostCSS (`autoprefixer` + `postcss-custom-media`). Responsive breakpoints use `@custom-media` variables. Fonts are loaded via Fontsource (Barlow Condensed + Host Grotesk) and exposed as CSS custom properties.

### TypeScript paths

```
@components/* → src/components/*
@lib/*        → src/lib/*
@assets/*     → src/assets/*
@types/*      → src/types/*
```

### Integrations

- **Netlify adapter** — SSR + pre-rendering target
- **DatoCMS** — all CMS content; client in `src/lib/datocms.ts`; queries in `src/lib/datoQueries.ts`
- **PostHog** — analytics; controlled by `ENABLE_POSTHOG` and `POSTHOG_PROJECT_API_KEY` env vars

### Environment variables

Declare new env vars in the `env.schema` block in `astro.config.mjs` (Astro's typed env system). `dotenv` loads `.env` at config time before Astro initialises.

| Variable                  | Required | Description                                      |
| :------------------------ | :------- | :----------------------------------------------- |
| `DATOCMS_CDA_TOKEN`       | ✅       | DatoCMS Content Delivery API token                |
| `ENABLE_POSTHOG`          |          | Toggle analytics (default: `false`)               |
| `POSTHOG_PROJECT_API_KEY` |          | PostHog project API key                           |

### Testing

**Always write tests first (TDD).** Unit tests use Vitest + `AstroContainer` for component rendering. E2E tests use Playwright (Chromium + WebKit) against the live dev server (`localhost:4321`). Accessibility assertions use `@axe-core/playwright`.

Always run `npm run test:unit` after making changes and verify output before reporting work complete.

## Conventions

- **No Tailwind** — use plain CSS only
- **Keep dependencies minimal** — justify every new package
- **TDD** — write failing tests before implementing
- Images from DatoCMS are served via `www.datocms-assets.com` and processed by Astro's image pipeline; always use `<Image>` or `<Picture>`, not raw `<img>` tags
- The sitemap automatically excludes `/partials/` routes — keep partials under that path
- CI runs lint → unit tests → E2E on PRs to `main`
