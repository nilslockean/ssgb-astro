# Malmö Klätterklubb / Astro

An experimental new website for [Malmö Klätterklubb](https://malmoklatterklubb.se), built with [Astro](https://astro.build) and [Sanity](https://sanity.io). **We like the idea of moving away from WordPress, and this is how we might do it.**

Content is managed through a companion Sanity Studio project: **mkk-sanity** _(coming soon)_. 

---

## 🤝 Contributing

This is an open source project! All volunteers of Malmö Klätterklubb are welcome and encouraged to contribute. If you spot a bug, want to improve something, or have a new idea — open a pull request.

The repository is maintained by **IT-gruppen** (The IT Group).

### Core contributors

- [@nilslockean](https://github.com/nilslockean)
- [@contributor2](https://github.com/contributor2) <!-- TODO: update username -->
- [@contributor3](https://github.com/contributor3) <!-- TODO: update username -->

### Guidelines

- **Keep dependencies to a minimum.** Every dependency is a maintenance burden and a potential security surface. Before reaching for a library, consider whether it can be done with standard web APIs or native Astro/CSS features. **Do not add Tailwind or any other utility-first CSS framework** — styling is done with plain CSS and PostCSS.
- **Motivate every dependency in your PR.** When a PR introduces a new dependency, the PR description must include an explanation of what the package does and why it is necessary. Group packages together where it makes sense (e.g. a set of ESLint plugins can share one motivation).
- Follow the existing code style — `prettier` and `eslint` are configured and will catch most issues.

---

## 🚀 Project Structure

```text
/
├── public/             # Static assets served as-is (favicons, fonts, etc.)
├── src/
│   ├── components/     # Reusable Astro (and framework) components
│   ├── layouts/        # Page layout wrappers
│   ├── pages/          # One file = one route; supports .astro and .mdx
│   └── styles/         # Global CSS files
├── astro.config.mjs    # Astro configuration (integrations, adapter, env schema)
├── postcss.config.cjs  # PostCSS configuration
└── package.json
```

Astro looks for `.astro` or `.mdx` files in `src/pages/`. Each file is exposed as a route based on its file name. Pages under `src/pages/partials/` are excluded from the sitemap.

Static assets go in `public/`. Images served from Sanity's CDN (`cdn.sanity.io`) are handled by Astro's image optimization pipeline.

---

## 🧞 Commands

All commands are run from the root of the project:

| Command                   | Action                                            |
| :------------------------ | :------------------------------------------------ |
| `npm install`             | Install dependencies                              |
| `npm run dev`             | Start local dev server at `localhost:4321`        |
| `npm run build`           | Build the production site to `./dist/`            |
| `npm run preview`         | Preview the production build locally              |
| `npm run format`          | Format all files with Prettier                    |
| `npm run lint`            | Lint `src/` with ESLint                           |
| `npm run test`            | Run all tests (unit + e2e)                        |
| `npm run test:unit`       | Run unit tests with Vitest                        |
| `npm run test:e2e`        | Run end-to-end tests with Playwright              |
| `npm run watch`           | Run Vitest in watch mode                          |
| `npm run astro ...`       | Run Astro CLI commands (`astro add`, `astro check`, etc.) |

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in the required values before running the project locally.

| Variable                  | Required | Description                                      |
| :------------------------ | :------- | :----------------------------------------------- |
| `SANITY_TOKEN`            | ✅       | Sanity API token for fetching content             |
| `SANITY_DATASET`          |          | Sanity dataset name (defaults to `production`)    |
| `POSTHOG_PROJECT_API_KEY` |          | PostHog project API key for analytics             |
| `ENABLE_POSTHOG`          |          | Toggle analytics on/off (defaults to `true`)      |
| `WEGLOT_API_KEY`          |          | Weglot API key for translation (if enabled)       |
| `ENABLE_WEGLOT`           |          | Toggle Weglot translation on/off (defaults to `false`) |

---

## 📦 Dependencies

Dependencies are kept intentionally minimal. Below is a full accounting of every package and the reason it exists.

### Production

#### Framework & deployment
| Package | Purpose |
| :------ | :------ |
| `astro` | The core framework. Provides file-based routing, component islands, and builds to optimized static HTML with minimal client-side JS. |
| `@astrojs/netlify` | Adapter that enables Astro's SSR features (server-side rendering, API routes) when deployed to Netlify. |
| `@astrojs/mdx` | Allows `.mdx` files as pages or components — Markdown with the ability to embed Astro components. |
| `@astrojs/sitemap` | Automatically generates a `sitemap.xml` at build time, based on all pages in the project. |

#### CMS (Sanity)
| Package | Purpose |
| :------ | :------ |
| `@sanity/astro` | Official Astro integration for Sanity. Configures the Sanity client and (optionally) embeds Sanity Studio. |
| `@sanity/client` | Low-level Sanity client for querying content via GROQ from within Astro pages and components. |
| `astro-portabletext` | Renders Sanity's Portable Text (structured rich text) as HTML inside Astro components. |

#### Analytics
| Package | Purpose |
| :------ | :------ |
| `posthog-js` | Product analytics. Self-hostable and privacy-friendly. Used to understand how visitors navigate the site without selling their data. |

---

### Development

#### Testing
| Package | Purpose |
| :------ | :------ |
| `vitest` | Fast unit test runner (Vite-native). Used for testing utility functions and pure logic. |
| `@playwright/test` | End-to-end browser testing framework. Runs tests against a real browser to verify pages render and behave correctly. |
| `@axe-core/playwright` | Accessibility auditing integrated into Playwright tests. Automatically flags WCAG violations. |

#### Linting
| Package | Purpose |
| :------ | :------ |
| `eslint` | JavaScript/TypeScript linter. Catches bugs and enforces code quality rules. |
| `@eslint/js` | ESLint's own recommended rule set. |
| `eslint-plugin-astro` | ESLint rules specific to `.astro` files. |
| `@typescript-eslint/parser` | Allows ESLint to parse TypeScript syntax inside `.astro` and `.ts` files. |

#### Formatting
| Package | Purpose |
| :------ | :------ |
| `prettier` | Opinionated code formatter. Keeps style consistent across contributors. |
| `prettier-plugin-astro` | Extends Prettier with support for `.astro` file formatting. |

#### CSS (PostCSS)
| Package | Purpose |
| :------ | :------ |
| `autoprefixer` | PostCSS plugin that automatically adds vendor prefixes to CSS rules for cross-browser compatibility. |
| `postcss-custom-media` | PostCSS plugin that enables [CSS Custom Media Queries](https://drafts.csswg.org/mediaqueries-5/#custom-mq) (e.g. `@custom-media --sm (min-width: 640px)`), which are not yet universally supported natively. This, together with standard CSS custom properties, is how responsive design is handled in this project — no utility-framework required. |

#### TypeScript & build tooling
| Package | Purpose |
| :------ | :------ |
| `dotenv` | Loads `.env` variables into `process.env` at config time. Required because `astro.config.mjs` reads environment variables before Astro's own runtime environment is available. |
| `@types/node` | TypeScript type definitions for Node.js built-ins. |
| `vite-tsconfig-paths` | Lets TypeScript path aliases defined in `tsconfig.json` (e.g. `@/components/...`) work inside Vite/Astro. |
