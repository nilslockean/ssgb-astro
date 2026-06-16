import type { Loader } from "astro/loaders";
import type { CdaStructuredTextValue } from "@datocms/astro/StructuredText";
import { z } from "astro/zod";
import { executeQuery } from "@lib/datocms";
import { PAGES_QUERY } from "@lib/datoQueries";
import { localeSchema } from "src/schemas/locale";
import type { Locale } from "@lib/routeUtils";

const LOCALES: Locale[] = ["sv", "en", "da"];

export const pageSchema = z.object({
  language: localeSchema.default("sv"),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  body: z.custom<CdaStructuredTextValue>().optional(),
});

type DatoPage = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  structuredText: CdaStructuredTextValue | null;
};

export function datoPagesLoader(): Loader {
  return {
    name: "dato-pages-loader",
    load: async ({ store, parseData, logger }) => {
      store.clear();

      for (const locale of LOCALES) {
        const { allPages } = await executeQuery<{ allPages: DatoPage[] }>(
          PAGES_QUERY,
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
            },
          });

          store.set({ id: `${locale}-${page.slug}`, data });
        }
      }
    },
  };
}
