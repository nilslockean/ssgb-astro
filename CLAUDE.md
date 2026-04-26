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

Content lives in `src/content/` and is defined by `src/content.config.ts`. Three MDX-based collections (courses, trips, pages) use glob loaders; three JSON collections (galleries, norms, team) use file loaders. Courses and trips each reference a `slugId` enum — this enum is the stable identifier used in routing and must stay in sync with `src/site.config.ts`.

### Routing and navigation

Navigation, slugs, paths, pricing, and contact details are centralised in `src/site.config.ts`. The `Paths` record maps slug IDs to canonical URLs. Dynamic routes (`kurser/[id].astro`, `resor/[id].astro`) use `getStaticPaths()` to pre-render at build time; the catch-all `[page].astro` handles content-collection pages.

### CSS

No utility framework — plain CSS in `src/styles/global.css` with PostCSS (`autoprefixer` + `postcss-custom-media`). Responsive breakpoints use `@custom-media` variables. Fonts are loaded via Fontsource (Barlow Condensed + Host Grotesk) and exposed as CSS custom properties.

### TypeScript paths

```
@components/* → src/components/*
@lib/*        → src/lib/*
@config       → src/site.config.ts
@assets/*     → src/assets/*
@types/*      → src/types/*
```

### Integrations

- **Netlify adapter** — SSR + pre-rendering target
- **Sanity CMS** — scaffolded but commented out in `astro.config.mjs` (env vars: `SANITY_TOKEN`, `SANITY_DATASET`)
- **Fienta** — booking API in `src/lib/fientaUtils.ts`; `FIENTA_INCLUDE_DRAFTS` env var controls draft event visibility
- **PostHog** — analytics; controlled by `ENABLE_POSTHOG` and `POSTHOG_PROJECT_API_KEY` env vars

### Environment variables

Declare new env vars in the `env.schema` block in `astro.config.mjs` (Astro's typed env system). `dotenv` loads `.env` at config time before Astro initialises, needed for Sanity/other secrets accessed at config level.

### Testing

Unit tests use Vitest + `AstroContainer` for component rendering. E2E tests use Playwright (Chromium + WebKit) and run against the live dev server (`localhost:4321`). Accessibility assertions use `@axe-core/playwright`.

## Conventions

- **No Tailwind** — use plain CSS only
- **Keep dependencies minimal** — justify every new package
- Images in `src/assets/` are processed by Astro's image optimisation; always use the `<Image>` or `<Picture>` component, not raw `<img>` tags
- The sitemap automatically excludes `/partials/` routes — keep partials under that path
- CI runs lint → unit tests → E2E on PRs to `main`
