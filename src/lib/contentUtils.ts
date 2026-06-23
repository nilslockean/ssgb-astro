import { getCollection, type CollectionEntry } from "astro:content";
import { z } from "astro/zod";
import { defaultLocale, type Locale } from "./routeUtils";
import { defineSingleton } from "./singleton";
import {
  configLoader,
  configSchema,
  localizedConfigSchema,
} from "../loaders/config";
import {
  homePageLoader,
  homePageSchema,
  localizedHomePageSchema,
} from "../loaders/homePage";

export type LocalizedConfig = z.infer<typeof localizedConfigSchema>;

const configSingleton = defineSingleton({
  name: "config",
  loader: configLoader(),
  schema: configSchema,
  localizedSchema: localizedConfigSchema,
  localize: (data, locale) => ({
    ...data,
    siteTagline: data.siteTagline[locale],
    navigation: {
      primary: data.navigation.primary[locale] ?? [],
      secondary: data.navigation.secondary[locale] ?? [],
      footer: data.navigation.footer[locale] ?? [],
    },
    authorizedInstructor: data.authorizedInstructor[locale],
  }),
});

const homePageSingleton = defineSingleton({
  name: "homePage",
  loader: homePageLoader(),
  schema: homePageSchema,
  localizedSchema: localizedHomePageSchema,
  localize: (data, locale: Locale) => ({
    eyebrow: data.eyebrow[locale],
    tagline: data.tagline[locale],
    title: data.title[locale],
    heroDescription: data.heroDescription[locale],
    heroButtons: data.heroButtons[locale],
    structuredText: data.structuredText[locale],
    heroVideo: data.heroVideo,
  }),
});

export const configCollection = configSingleton.collection;
export const homePageCollection = homePageSingleton.collection;

export const getLocalizedConfig = (locale: string) =>
  configSingleton.getLocalized(locale);

export const getLocalizedHomePage = (locale: string) =>
  homePageSingleton.getLocalized(locale);

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
