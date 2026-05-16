import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import { NavArea, type Locale } from "@lib/routeUtils";
import { localeSchema } from "../schemas/locale";
import { sanityClient } from "@lib/sanity";
import { CONFIG_QUERY } from "@lib/queries";

const navLinkSchema = z.object({
  label: z.string(),
  path: z.string(),
  locale: localeSchema,
  className: z.string().optional(),
});

const navSchema = z.array(
  z.object({
    link: navLinkSchema,
    subMenu: z
      .object({
        nav: z.array(
          z.object({
            link: navLinkSchema,
          }),
        ),
        more: navLinkSchema.optional(),
      })
      .optional(),
  }),
);

const configSchema = z.object({
  siteTitle: z.literal("Sydsveriges Guidebyrå"),
  siteUrl: z.url(),
  siteTagline: z.record(localeSchema, z.string()),
  contact: z.object({
    email: z.email(),
    phone: z.e164(),
  }),
  defaultPrices: z.object({
    single: z.number(),
    double: z.number(),
    many: z.number(),
    openBooking: z.number(),
  }),
  navigation: z.record(z.enum(NavArea), z.record(localeSchema, navSchema)),
});

export type SiteConfig = z.infer<typeof configSchema>;

const LOCALES: Locale[] = ["sv", "da", "en"];

function withLocale(navItems: unknown[], locale: Locale): unknown[] {
  if (!Array.isArray(navItems)) return [];
  return navItems.map((item: any) => ({
    link: { ...item.link, locale },
    subMenu: item.subMenu
      ? {
          nav: (item.subMenu.nav ?? []).map((sub: any) => ({
            link: { ...sub.link, locale },
          })),
          more: item.subMenu.more
            ? { ...item.subMenu.more, locale }
            : undefined,
        }
      : undefined,
  }));
}

export function configLoader(): Loader {
  return {
    name: "config-loader",
    load: async ({ store, parseData }) => {
      store.clear();

      const raw = await sanityClient.fetch(CONFIG_QUERY);
      if (!raw) {
        throw new Error(
          "No config document found in Sanity — create one in the Studio first",
        );
      }

      // internationalizedArrayString → Record<Locale, string>
      const siteTagline: Record<string, string> = {};
      for (const locale of LOCALES) {
        const entry = (raw.siteTagline ?? []).find(
          (t: any) => t._key === locale,
        );
        siteTagline[locale] = entry?.value ?? "";
      }

      // NavArea enum values ("aside", "courses", "footer", "mobile") match Sanity field names
      const navigation: Record<string, Record<string, unknown[]>> = {};
      for (const area of Object.values(NavArea)) {
        navigation[area] = {};
        for (const locale of LOCALES) {
          navigation[area][locale] = withLocale(
            raw.navigation?.[area]?.[locale] ?? [],
            locale,
          );
        }
      }

      const data = await parseData({
        id: "index",
        data: {
          siteTitle: raw.siteTitle ?? "Sydsveriges Guidebyrå",
          siteUrl: raw.siteUrl ?? "https://ssgb.se",
          siteTagline,
          contact: raw.contact,
          defaultPrices: raw.defaultPrices,
          navigation,
        },
      });

      store.set({ id: "index", data });
    },
    schema: configSchema,
  };
}
