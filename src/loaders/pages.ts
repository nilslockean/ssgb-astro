import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import { sanityClient } from "@lib/sanity";
import { PAGES_QUERY } from "@lib/queries";
import { localeSchema } from "src/schemas/locale";

export const pageSchema = z.object({
  language: localeSchema.default("sv"),
  title: z.string(),
  excerpt: z.string(),
  body: z.array(z.any()).optional(),
});

export function sanityPagesLoader(): Loader {
  return {
    name: "sanity-pages-loader",
    load: async ({ store, parseData, logger }) => {
      store.clear();

      const pages = await sanityClient.fetch(PAGES_QUERY);
      logger.info(`Loaded ${pages.length} pages from Sanity`);

      for (const page of pages) {
        const id = page.slug as string | undefined;
        if (!id) {
          logger.warn(`Page "${page.title}" has no slug — skipping`);
          continue;
        }

        const data = await parseData({
          id,
          data: {
            language: page.language ?? "sv",
            title: page.title,
            excerpt: page.excerpt,
            body: page.body ?? [],
          },
        });

        store.set({ id, data });
      }
    },
  };
}
