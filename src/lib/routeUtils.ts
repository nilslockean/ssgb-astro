export type Locale = "sv" | "da" | "en";
export const defaultLocale: Locale = "sv";

export interface NavLink {
  label: string;
  path: string;
  locale: Locale;
  newTab: boolean;
}

export interface NavItem {
  link: NavLink;
  subMenu?: {
    nav: { link: NavLink }[];
  };
}

export type Navigation = NavItem[];

export const LOCALE_CODES = [
  "sv",
  "da",
  "en",
] as const satisfies readonly Locale[];

const COURSE_SEGMENTS = ["kurser", "courses"] as const;
const TRIP_SEGMENTS = ["resor", "trips", "rejse"] as const;

export type PageType =
  | { type: "home"; locale: Locale }
  | { type: "course"; locale: Locale; slug: string }
  | { type: "page"; locale: Locale; slug: string }
  | { type: "trip"; locale: Locale; slug: string };

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

const COURSES_BASE: Record<Locale, string> = {
  sv: "kurser",
  en: "courses",
  da: "kurser",
};
const TRIPS_BASE: Record<Locale, string> = {
  sv: "resor",
  en: "trips",
  da: "rejse",
};

export function composePath(slug: string, locale = defaultLocale, parent = "") {
  const localePrefixMap: Record<Locale, string> = {
    sv: "/",
    da: "/da/",
    en: "/en/",
  };
  let path = localePrefixMap[locale];

  if (!slug || slug === "/") return path;

  if (parent) {
    const parts = parent.split("/").filter((p) => p.trim());
    path += parts.join("/");
    path += "/";
  }

  const slugParts = slug.split("/").filter((p) => p.trim());
  if (slugParts.length > 1) {
    throw new Error("Slugs can't be nested. Use parent parameter instead.");
  }

  path += slugParts[0];
  path += "/";

  return path;
}

export function courseUrl(
  slug: string,
  locale: Locale = defaultLocale,
): string {
  const parent = COURSES_BASE[locale];
  return composePath(slug, locale, parent);
}

export function tripUrl(slug: string, locale: Locale = defaultLocale): string {
  const parent = TRIPS_BASE[locale];
  return composePath(slug, locale, parent);
}

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
