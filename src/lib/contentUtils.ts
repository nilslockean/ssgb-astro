import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { z } from "astro/zod";
import { localeSchema } from "src/schemas/locale";
import { localizedConfigSchema } from "../loaders/config";
import { localizedHomePageSchema } from "../loaders/homePage";
import {
  composePath,
  courseUrl,
  defaultLocale,
  LOCALE_CODES,
  type Locale,
} from "./routeUtils";

export type LocalizedConfig = z.infer<typeof localizedConfigSchema>;

export async function getCourses(
  filter?: (entry: CollectionEntry<"courses">, index: number) => unknown,
  locale = defaultLocale,
): Promise<CollectionEntry<"courses">[]> {
  const courses = await getCollection(
    "courses",
    (course) => course.data.language === locale,
  );
  return courses
    .filter((course, index) => (filter ? filter(course, index) : true))
    .sort((a, b) => a.data.order - b.data.order);
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
export type PageType =
  | { type: "home"; locale: Locale }
  | { type: "course"; locale: Locale; slug: string }
  | { type: "page"; locale: Locale; slug: string }
  | { type: "trip"; locale: Locale; slug: string };

const COURSE_SEGMENTS = ["kurser", "courses"] as const;
const TRIP_SEGMENTS = ["resor", "trips", "rejse"] as const;
export async function getLocalizedUrls(
  url: URL,
): Promise<Record<Locale, string>> {
  const { getCollection } = await import("astro:content");
  const page = detectPageType(url);

  const fallback: Record<Locale, string> = {
    sv: "/",
    da: "/da/",
    en: "/en/",
  };

  if (page.type === "home") return { ...fallback };

  const collectionName =
    page.type === "course"
      ? "courses"
      : page.type === "trip"
        ? "trips"
        : "pages";
  const entries = await getCollection(collectionName);

  const currentEntry = entries.find(
    (e: { data: { slug: string; language: string } }) =>
      e.data.slug === page.slug && e.data.language === page.locale,
  );
  if (!currentEntry) return { ...fallback };

  const datoId = currentEntry.id.replace(/^(sv|da|en)-/, "");

  const result: Record<Locale, string> = { ...fallback };
  result[page.locale] = url.pathname;

  for (const locale of LOCALE_CODES) {
    if (locale === page.locale) continue;

    const targetEntry = entries.find(
      (e: { id: string }) => e.id === `${locale}-${datoId}`,
    );
    if (!targetEntry) continue;

    if (page.type === "course") {
      result[locale] = courseUrl(targetEntry.data.slug, locale);
    } else if (page.type === "page" || page.type === "trip") {
      result[locale] = composePath(targetEntry.data.slug, locale);
    }
  }

  return result;
}
export function detectPageType(url: URL): PageType {
  const path = url.pathname.replace(/\/$/, "") || "/";
  const segments = path.split("/").filter(Boolean);

  if (path === "/") return { type: "home", locale: defaultLocale };

  let locale = defaultLocale;
  let startIdx = 0;
  if (segments[0] === "en") {
    locale = "en";
    startIdx = 1;
  } else if (segments[0] === "da") {
    locale = "da";
    startIdx = 1;
  }

  if (segments.length <= startIdx) return { type: "home", locale };

  const next = segments[startIdx];

  if (
    (COURSE_SEGMENTS as readonly string[]).includes(next) &&
    segments.length > startIdx + 1
  ) {
    return { type: "course", locale, slug: segments[startIdx + 1] };
  }

  if (
    (TRIP_SEGMENTS as readonly string[]).includes(next) &&
    segments.length > startIdx + 1
  ) {
    return { type: "trip", locale, slug: segments[startIdx + 1] };
  }

  return { type: "page", locale, slug: next };
}
