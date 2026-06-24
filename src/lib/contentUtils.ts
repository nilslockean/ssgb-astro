import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { z } from "astro/zod";
import { localeSchema } from "src/schemas/locale";
import { localizedConfigSchema } from "../loaders/config";
import { localizedHomePageSchema } from "../loaders/homePage";
import { defaultLocale } from "./routeUtils";

export type LocalizedConfig = z.infer<typeof localizedConfigSchema>;

export async function getCourses(
  filter?: (entry: CollectionEntry<"courses">) => unknown,
  locale = defaultLocale,
): Promise<CollectionEntry<"courses">[]> {
  const courses = await getCollection(
    "courses",
    (course) => course.data.language === locale && (!filter || filter(course)),
  );
  return courses.sort((a, b) => a.data.order - b.data.order);
}

export async function getLocalizedConfig(
  locale: string,
): Promise<LocalizedConfig> {
  const entry = await getEntry("config", "index");
  if (!entry) {
    throw new Error(`No singleton entry found for config`);
  }
  const currentLocale = localeSchema.catch(defaultLocale).parse(locale);
  const { data } = entry;

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

export async function getLocalizedHomePage(locale: string) {
  const entry = await getEntry("homePage", "index");
  if (!entry) {
    throw new Error(`No singleton entry found for homePage`);
  }
  const currentLocale = localeSchema.catch(defaultLocale).parse(locale);
  const { data } = entry;

  return localizedHomePageSchema.parse({
    eyebrow: data.eyebrow[currentLocale],
    tagline: data.tagline[currentLocale],
    title: data.title[currentLocale],
    heroDescription: data.heroDescription[currentLocale],
    heroButtons: data.heroButtons[currentLocale],
    structuredText: data.structuredText[currentLocale],
    heroVideo: data.heroVideo,
    seo: data.seo[currentLocale],
  });
}
