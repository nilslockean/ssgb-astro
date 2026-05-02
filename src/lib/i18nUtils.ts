import { getRelativeLocaleUrl } from "astro:i18n";
import { resolveSlug, type Locale, type Slug } from "@lib/routeUtils";

export function localePath(slug: Slug, locale: Locale): string {
  const resolved = resolveSlug(slug, locale);
  return getRelativeLocaleUrl(resolved.locale, resolved.path);
}
