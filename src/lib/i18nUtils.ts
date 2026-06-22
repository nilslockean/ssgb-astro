import { type Locale } from "@lib/routeUtils";
import { localeSchema } from "../schemas/locale";

export const LOCALES = {
  sv: "Svenska",
  en: "English",
  da: "Dansk",
} as const satisfies Record<Locale, string>;

export const languages = Object.keys(LOCALES).map((locale) =>
  localeSchema.parse(locale),
);
