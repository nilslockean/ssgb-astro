import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import { executeQuery } from "@lib/datocms";
import { SITE_CONFIG_QUERY } from "@lib/datoQueries";
import { localeSchema } from "../schemas/locale";
import type { Locale } from "@lib/routeUtils";

const LOCALES: Locale[] = ["sv", "en", "da"];

const navLinkSchema = z.object({
  label: z.string(),
  path: z.string(),
  locale: localeSchema,
});

const navLeafSchema = z.object({
  link: navLinkSchema,
});

const navItemSchema = z.object({
  link: navLinkSchema,
  subMenu: z.object({ nav: z.array(navLeafSchema) }).optional(),
});

export const navSchema = z.array(navItemSchema);

export const configSchema = z.object({
  siteTitle: z.literal("Sydsveriges Guidebyrå"),
  siteUrl: z.url(),
  siteTagline: z.record(localeSchema, z.string()),
  contact: z.object({
    email: z.email(),
    phone: z.string(),
  }),
  defaultPrices: z.object({
    single: z.number(),
    double: z.number(),
    many: z.number(),
    openBooking: z.number(),
  }),
  navigation: z.object({
    primary: z.record(localeSchema, navSchema),
    secondary: z.record(localeSchema, navSchema),
    footer: z.record(localeSchema, navSchema),
  }),
});

export type SiteConfig = z.infer<typeof configSchema>;

type DatoMenuItem = {
  label: string;
  url: string;
  subMenu?: { items: DatoMenuItem[] } | null;
};

type DatoSiteConfig = {
  title: string;
  tagline: string;
  email: string;
  phone: string;
  pricesSingle: number;
  pricesDouble: number;
  pricesMany: number;
  pricesOpenBooking: number;
  navPrimary: { items: DatoMenuItem[] } | null;
  navSecondary: { items: DatoMenuItem[] } | null;
  navFooter: { items: DatoMenuItem[] } | null;
};

type NavItem = z.infer<typeof navItemSchema>;

function toNavItems(items: DatoMenuItem[], locale: Locale): NavItem[] {
  return items.map((item) => ({
    link: { label: item.label, path: item.url, locale },
    subMenu: item.subMenu?.items.length
      ? { nav: toNavItems(item.subMenu.items, locale) }
      : undefined,
  }));
}

export function configLoader(): Loader {
  return {
    name: "dato-config-loader",
    load: async ({ store, parseData, logger }) => {
      store.clear();

      const results: Array<{ locale: Locale; config: DatoSiteConfig }> = [];

      for (const locale of LOCALES) {
        const { siteConfig } = await executeQuery<{
          siteConfig: DatoSiteConfig;
        }>(SITE_CONFIG_QUERY, { locale });
        if (!siteConfig)
          throw new Error("No siteConfig record found in DatoCMS");
        results.push({ locale, config: siteConfig });
        logger.info(`Loaded ${locale} site config from DatoCMS`);
      }

      const svConfig = results.find((r) => r.locale === "sv")!.config;

      const tagline: Record<string, string> = {};
      const primary: Record<string, NavItem[]> = {};
      const secondary: Record<string, NavItem[]> = {};
      const footer: Record<string, NavItem[]> = {};

      for (const { locale, config } of results) {
        tagline[locale] = config.tagline ?? "";
        primary[locale] = toNavItems(config.navPrimary?.items ?? [], locale);
        secondary[locale] = toNavItems(
          config.navSecondary?.items ?? [],
          locale,
        );
        footer[locale] = toNavItems(config.navFooter?.items ?? [], locale);
      }

      const data = await parseData({
        id: "index",
        data: {
          siteTitle: "Sydsveriges Guidebyrå",
          siteUrl: "https://ssgb.se",
          siteTagline: tagline,
          contact: {
            email: svConfig.email,
            phone: svConfig.phone,
          },
          defaultPrices: {
            single: svConfig.pricesSingle,
            double: svConfig.pricesDouble,
            many: svConfig.pricesMany,
            openBooking: svConfig.pricesOpenBooking,
          },
          navigation: { primary, secondary, footer },
        },
      });

      store.set({ id: "index", data });
    },
    schema: configSchema,
  };
}
