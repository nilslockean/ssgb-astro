import { defineCollection, getEntry } from "astro:content";
import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import { defaultLocale, type Locale } from "@lib/routeUtils";
import { localeSchema } from "src/schemas/locale";

export function defineSingleton<
  T extends z.ZodTypeAny,
  L extends z.ZodTypeAny,
>(opts: {
  name: string;
  loader: Loader;
  schema: T;
  localizedSchema: L;
  localize: (data: z.infer<T>, locale: Locale) => z.input<L>;
}) {
  const collection = defineCollection({
    loader: opts.loader,
    schema: opts.schema,
  });

  return {
    collection,
    getLocalized: async (locale?: string): Promise<z.infer<L>> => {
      const currentLocale = localeSchema.catch(defaultLocale).parse(locale);
      const entry = await getEntry(opts.name, "index");
      if (!entry) {
        throw new Error(`No singleton entry found for "${opts.name}"`);
      }
      return opts.localizedSchema.parse(
        opts.localize(entry.data, currentLocale),
      );
    },
  };
}
