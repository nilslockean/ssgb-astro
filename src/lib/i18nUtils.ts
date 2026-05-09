import { getRelativeLocaleUrl } from "astro:i18n";
import { resolveSlug, type Locale, type Slug } from "@lib/routeUtils";
import { localeSchema } from "../schemas/locale";

export function localePath(slug: Slug, locale: Locale): string {
  const resolved = resolveSlug(slug, locale);
  return getRelativeLocaleUrl(resolved.locale, resolved.path);
}

export const LOCALES = {
  sv: "Svenska",
  en: "English",
  da: "Dansk",
} as const satisfies Record<Locale, string>;

export const languages = Object.keys(LOCALES).map((locale) =>
  localeSchema.parse(locale),
);
