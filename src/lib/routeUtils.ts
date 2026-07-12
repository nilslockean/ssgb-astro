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
