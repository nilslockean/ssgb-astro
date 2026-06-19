import type { Loader } from "astro/loaders";
import type { CdaStructuredTextValue } from "@datocms/astro/StructuredText";
import { z } from "astro/zod";
import { executeQuery } from "@lib/datocms";
import { PAGES_QUERY } from "@lib/datoQueries";
import { localeSchema } from "src/schemas/locale";
import { LOCALE_CODES } from "@lib/routeUtils";

export const pageSchema = z.object({
  language: localeSchema.default("sv"),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  body: z.custom<CdaStructuredTextValue>().optional(),
  displayContactForm: z.boolean(),
});

const datoPageSchema = z.object({
  id: z.string(),
  title: z.string(),
  excerpt: z.string(),
  slug: z.string().nullable(),
  structuredText: z.custom<CdaStructuredTextValue>().nullable(),
  displayContactForm: z.boolean().nullable(),
});

export function datoPagesLoader(): Loader {
  return {
    name: "dato-pages-loader",
    load: async ({ store, parseData, logger }) => {
      store.clear();

      for (const locale of LOCALE_CODES) {
        const { allPages } = await executeQuery(
          PAGES_QUERY,
          z.object({ allPages: z.array(datoPageSchema) }),
          { locale },
        );

        logger.info(`Loaded ${allPages.length} ${locale} pages from DatoCMS`);

        for (const page of allPages) {
          if (!page.slug) {
            // logger.warn(`Page ${page.id} (${locale}) has no slug — skipping`);
            continue;
          }

          const data = await parseData({
            id: `${locale}-${page.slug}`,
            data: {
              language: locale,
              title: page.title,
              slug: page.slug,
              excerpt: page.excerpt,
              body: page.structuredText ?? undefined,
              displayContactForm: page.displayContactForm ?? false,
            },
          });

          store.set({ id: `${locale}-${page.slug}`, data });
        }
      }
    },
  };
}
