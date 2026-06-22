import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import { executeQuery } from "@lib/datocms";
import { SITE_CONFIG_QUERY } from "@lib/datoQueries";
import { localeSchema } from "../schemas/locale";
import {
  composePath,
  courseUrl,
  tripUrl,
  type Locale,
  LOCALE_CODES,
  defaultLocale,
} from "@lib/routeUtils";

// ── Stored nav schemas ────────────────────────────────────────────────────────

const navLinkSchema = z.object({
  label: z.string(),
  path: z.string(),
  locale: localeSchema,
});

const navItemSchema = z.object({
  link: navLinkSchema,
  subMenu: z
    .object({ nav: z.array(z.object({ link: navLinkSchema })) })
    .optional(),
});
type NavItem = z.infer<typeof navItemSchema>;

export const navSchema = z.array(navItemSchema);

// ── Raw DatoCMS API response schemas ─────────────────────────────────────────

const datoLinkSchema = z.object({
  __typename: z.enum(["PageRecord", "CourseRecord", "TripRecord"]),
  slug: z.string(),
  title: z.string(),
});

const datoMenuItemSchema = z.object({
  label: z.string().nullable(),
  url: z.string().nullable(),
  link: datoLinkSchema.nullable().optional(),
  get subMenu() {
    return z
      .object({ items: z.array(datoMenuItemSchema) })
      .nullable()
      .optional();
  },
});
type DatoMenuItem = z.infer<typeof datoMenuItemSchema>;

const datoNavSchema = z
  .object({ items: z.array(datoMenuItemSchema) })
  .nullable();

const datoSiteConfigSchema = z.object({
  title: z.string(),
  tagline: z.string(),
  email: z.string(),
  phone: z.string(),
  pricesSingle: z.number(),
  pricesDouble: z.number(),
  pricesMany: z.number(),
  pricesOpenBooking: z.number(),
  navPrimary: datoNavSchema,
  navSecondary: datoNavSchema,
  navFooter: datoNavSchema,
  authorizedInstructorTitle: z.string(),
  authorizedInstructorContent: z.string(),
  authorizedInstructorImage: z.object({
    url: z.string(),
    width: z.number(),
    height: z.number(),
    alt: z.string(),
  }),
});

// ── Shared sub-schemas ────────────────────────────────────────────────────────

const authorizedInstructorSchema = z.object({
  title: z.string(),
  content: z.string(),
  image: z.object({
    url: z.string(),
    width: z.number(),
    height: z.number(),
    alt: z.string(),
  }),
});

const contactSchema = z.object({ email: z.email(), phone: z.string() });

const defaultPricesSchema = z.object({
  single: z.number(),
  double: z.number(),
  many: z.number(),
  openBooking: z.number(),
});

// ── Stored config schema (content collection) ─────────────────────────────────

export const configSchema = z.object({
  siteTitle: z.literal("Sydsveriges Guidebyrå"),
  siteUrl: z.url(),
  siteTagline: z.record(localeSchema, z.string()),
  contact: contactSchema,
  defaultPrices: defaultPricesSchema,
  navigation: z.object({
    primary: z.record(localeSchema, navSchema),
    secondary: z.record(localeSchema, navSchema),
    footer: z.record(localeSchema, navSchema),
  }),
  authorizedInstructor: z.record(localeSchema, authorizedInstructorSchema),
});

export type SiteConfig = z.infer<typeof configSchema>;

// ── Localized (single-locale) schema ─────────────────────────────────────────

export const localizedConfigSchema = z.object({
  siteTitle: z.literal("Sydsveriges Guidebyrå"),
  siteUrl: z.url(),
  siteTagline: z.string(),
  contact: contactSchema,
  defaultPrices: defaultPricesSchema,
  navigation: z.object({
    primary: navSchema,
    secondary: navSchema,
    footer: navSchema,
  }),
  authorizedInstructor: authorizedInstructorSchema,
});

// ── Loader ────────────────────────────────────────────────────────────────────

function linkPath(
  link: z.infer<typeof datoLinkSchema>,
  locale: Locale,
): string {
  switch (link.__typename) {
    case "CourseRecord":
      return courseUrl(link.slug, locale);
    case "TripRecord":
      return tripUrl(link.slug, locale);
    default:
      return composePath(link.slug, locale);
  }
}

function toItem(item: DatoMenuItem, locale = defaultLocale): NavItem {
  const label = item.label || item.link?.title || "Ingen etikett";
  const path = item.link ? linkPath(item.link, locale) : (item.url ?? "");
  return {
    link: { label, path, locale },
    subMenu: item.subMenu?.items.length
      ? {
          nav: item.subMenu.items.map((item) => toItem(item, locale)),
        }
      : undefined,
  };
}

function toNavItems(
  items: DatoMenuItem[],
  locale: Locale,
): z.infer<typeof navSchema> {
  return items.map((item) => toItem(item, locale));
}

export function configLoader(): Loader {
  return {
    name: "dato-config-loader",
    load: async ({ store, parseData, logger }) => {
      store.clear();

      const results: Array<{
        locale: Locale;
        config: z.infer<typeof datoSiteConfigSchema>;
      }> = [];

      for (const locale of LOCALE_CODES) {
        const { siteConfig } = await executeQuery(
          SITE_CONFIG_QUERY,
          z.object({ siteConfig: datoSiteConfigSchema }),
          { locale },
        );
        if (!siteConfig)
          throw new Error("No siteConfig record found in DatoCMS");
        results.push({ locale, config: siteConfig });
        logger.info(`Loaded ${locale} site config from DatoCMS`);
      }

      const svConfig = results.find((r) => r.locale === "sv")!.config;

      const siteTagline: Record<string, string> = {};
      const primary: Record<string, z.infer<typeof navSchema>> = {};
      const secondary: Record<string, z.infer<typeof navSchema>> = {};
      const footer: Record<string, z.infer<typeof navSchema>> = {};
      const authorizedInstructor: Record<
        string,
        z.infer<typeof authorizedInstructorSchema>
      > = {};

      for (const { locale, config } of results) {
        siteTagline[locale] = config.tagline ?? "";
        primary[locale] = toNavItems(config.navPrimary?.items ?? [], locale);
        secondary[locale] = toNavItems(
          config.navSecondary?.items ?? [],
          locale,
        );
        footer[locale] = toNavItems(config.navFooter?.items ?? [], locale);
        authorizedInstructor[locale] = {
          title: config.authorizedInstructorTitle,
          content: config.authorizedInstructorContent,
          image: config.authorizedInstructorImage,
        };
      }

      const data = await parseData({
        id: "index",
        data: {
          siteTitle: "Sydsveriges Guidebyrå",
          siteUrl: "https://ssgb.se",
          siteTagline,
          contact: { email: svConfig.email, phone: svConfig.phone },
          defaultPrices: {
            single: svConfig.pricesSingle,
            double: svConfig.pricesDouble,
            many: svConfig.pricesMany,
            openBooking: svConfig.pricesOpenBooking,
          },
          navigation: { primary, secondary, footer },
          authorizedInstructor,
        },
      });

      store.set({ id: "index", data });
    },
    schema: configSchema,
  };
}
