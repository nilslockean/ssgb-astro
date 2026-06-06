import type { LiveLoader } from "astro/loaders";
import { z } from "astro/zod";
import { sanityClient } from "@lib/sanity";
import { PAGES_QUERY, PAGE_BY_SLUG_QUERY } from "@lib/queries";
import { localeSchema } from "src/schemas/locale";

export const pageSchema = z.object({
  language: localeSchema.default("sv"),
  title: z.string(),
  excerpt: z.string(),
  body: z.array(z.any()).optional(),
});

type PageFilter = { id: string; language: string };

export function sanityPagesLoader(): LiveLoader<Record<string, unknown>, PageFilter> {
  return {
    name: "sanity-pages-loader",

    loadCollection: async () => {
      const pages = await sanityClient.fetch(PAGES_QUERY);
      return {
        entries: pages.map((page: { slug: string; language: string; title: string; excerpt: string; body: unknown[] }) => ({
          id: page.slug,
          data: {
            language: page.language ?? "sv",
            title: page.title,
            excerpt: page.excerpt,
            body: page.body ?? [],
          },
        })),
      };
    },

    loadEntry: async ({ filter: { id: slug, language } }) => {
      const page = await sanityClient.fetch(PAGE_BY_SLUG_QUERY, { slug, language });
      if (!page) return undefined;
      return {
        id: page.slug,
        data: {
          language: page.language ?? "sv",
          title: page.title,
          excerpt: page.excerpt,
          body: page.body ?? [],
        },
      };
    },
  };
}
