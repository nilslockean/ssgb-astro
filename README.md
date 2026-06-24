# Sydsveriges Guidebyrå

Website for [Sydsveriges Guidebyrå](https://ssgb.se), built with [Astro](https://astro.build) and [DatoCMS](https://datocms.com).

---

## 🚀 Project Structure

```text
/
├── public/                  # Static assets served as-is (favicons, etc.)
├── src/
│   ├── components/          # Reusable Astro components
│   ├── features/            # Domain features (dato blocks, forms, navigation, etc.)
│   ├── layouts/             # Page layout wrappers
│   ├── lib/                 # Utilities: DatoCMS client, queries, routing
│   ├── loaders/             # Astro Content Layer loaders (DatoCMS)
│   ├── pages/               # File-based routes (.astro)
│   ├── schemas/             # Zod schemas (dato, locale)
│   ├── styles/              # Global CSS
│   └── templates/           # Shared page templates (Course, Trip, HomePage)
├── migrations/              # DatoCMS migration scripts
├── content.config.ts        # Astro Content Layer collection definitions
├── datoschema.ts            # DatoCMS model type definitions (generated)
├── astro.config.mjs         # Astro configuration
└── package.json
```

---

## 🧞 Commands

| Command             | Action                                           |
| :------------------ | :----------------------------------------------- |
| `npm install`       | Install dependencies                             |
| `npm run dev`       | Start local dev server at `localhost:4321`       |
| `npm run build`     | Build the production site to `./dist/`           |
| `npm run preview`   | Preview the production build locally             |
| `npm run format`    | Format all files with Prettier                   |
| `npm run lint`      | Lint `src/` with ESLint                          |
| `npm run test`      | Run all tests (unit + E2E)                       |
| `npm run test:unit` | Run unit tests with Vitest                       |
| `npm run test:e2e`  | Run end-to-end tests with Playwright             |
| `npm run watch`     | Run Vitest in watch mode                         |

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in the required values before running locally.

| Variable                  | Required | Description                                      |
| :------------------------ | :------- | :----------------------------------------------- |
| `DATOCMS_CDA_TOKEN`       | ✅       | DatoCMS Content Delivery API token               |
| `ENABLE_POSTHOG`          |          | Toggle analytics (default: `false`)              |
| `POSTHOG_PROJECT_API_KEY` |          | PostHog project API key                          |

---

## 📦 Dependencies

Dependencies are kept intentionally minimal.

### Production

#### Framework & deployment

| Package            | Purpose                                                                                           |
| :----------------- | :------------------------------------------------------------------------------------------------ |
| `astro`            | Core framework. File-based routing, component islands, static HTML output with minimal client JS. |
| `@astrojs/netlify` | Adapter for SSR + static pre-rendering on Netlify.                                                |
| `@astrojs/sitemap` | Generates `sitemap.xml` at build time.                                                            |

#### CMS (DatoCMS)

| Package                  | Purpose                                                                              |
| :----------------------- | :----------------------------------------------------------------------------------- |
| `@datocms/cda-client`    | GraphQL client for querying DatoCMS Content Delivery API at build time.              |
| `@datocms/astro`         | Official DatoCMS Astro integration. Provides `<StructuredText>` and related helpers. |

#### Analytics

PostHog is loaded via a CDN snippet — no JavaScript package required.

### Development

#### Testing

| Package                | Purpose                                                                           |
| :--------------------- | :-------------------------------------------------------------------------------- |
| `vitest`               | Unit test runner (Vite-native).                                                   |
| `@playwright/test`     | End-to-end browser testing against real browsers.                                 |
| `@axe-core/playwright` | Accessibility auditing integrated into Playwright tests.                          |

#### Linting & formatting

| Package                     | Purpose                                              |
| :-------------------------- | :--------------------------------------------------- |
| `eslint`                    | JavaScript/TypeScript linter.                        |
| `@eslint/js`                | ESLint recommended rule set.                         |
| `eslint-plugin-astro`       | ESLint rules for `.astro` files.                     |
| `@typescript-eslint/parser` | TypeScript parsing for ESLint.                       |
| `prettier`                  | Code formatter.                                      |
| `prettier-plugin-astro`     | Prettier support for `.astro` files.                 |

#### CSS (PostCSS)

| Package                | Purpose                                                                          |
| :--------------------- | :------------------------------------------------------------------------------- |
| `autoprefixer`         | Adds vendor prefixes automatically.                                              |
| `postcss-custom-media` | Enables `@custom-media` breakpoint variables (not yet natively supported).       |

#### CLI & migrations

| Package   | Purpose                                                                                       |
| :-------- | :-------------------------------------------------------------------------------------------- |
| `datocms` | DatoCMS CLI for schema migrations, content imports, and project management.                   |

#### TypeScript & build tooling

| Package               | Purpose                                                                                         |
| :-------------------- | :---------------------------------------------------------------------------------------------- |
| `dotenv`              | Loads `.env` into `process.env` at config time, before Astro's runtime env is available.        |
| `@types/node`         | TypeScript type definitions for Node.js built-ins.                                              |
| `vite-tsconfig-paths` | Makes TypeScript path aliases (e.g. `@components/`) work inside Vite/Astro.                     |
