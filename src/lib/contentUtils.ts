import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { z } from "astro/zod";
import { localeSchema } from "src/schemas/locale";
import { localizedConfigSchema } from "../loaders/config";
import { defaultLocale } from "./routeUtils";

export type LocalizedConfig = z.infer<typeof localizedConfigSchema>;

export async function getCourses(
  filter?: (entry: CollectionEntry<"courses">) => unknown,
  locale = defaultLocale,
) {
  const courses = await getCollection(
    "courses",
    (course) => course.data.language === locale && (!filter || filter(course)),
  );
  return courses.sort((a, b) => a.data.order - b.data.order);
}

export async function getLocalizedConfig(
  locale: string,
): Promise<LocalizedConfig> {
  const configEntry = await getEntry("config", "index");
  if (!configEntry) {
    throw new Error("No config entry with id index found");
  }

  const currentLocale = localeSchema.catch(defaultLocale).parse(locale);
  const { data } = configEntry;

  return localizedConfigSchema.parse({
    ...data,
    siteTagline: data.siteTagline[currentLocale],
    navigation: {
      primary: data.navigation.primary[currentLocale] ?? [],
      secondary: data.navigation.secondary[currentLocale] ?? [],
      footer: data.navigation.footer[currentLocale] ?? [],
    },
    authorizedInstructor: data.authorizedInstructor[currentLocale],
  });
}
