import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import {
  NavArea,
  type NavLink,
  type Navigation,
  resolveSlug,
  type Locale,
  Slug,
} from "@lib/routeUtils";
import { localeSchema } from "../schemas/locale";

function link(
  slug: Slug,
  label: string,
  locale: Locale = "sv",
  className?: string,
): NavLink {
  const resolved = resolveSlug(slug, locale);
  return { label, path: resolved.path, locale: resolved.locale, className };
}

const courseNav: Record<Locale, Navigation> = {
  sv: [
    { link: link(Slug.COURSE_CRAG_BASIC, "Grundkurs klippa") },
    { link: link(Slug.COURSE_CRAG_ADV, "Fortsättningskurs klippa") },
    { link: link(Slug.COURSE_RESCUE_BASIC, "Räddning 1") },
    { link: link(Slug.COURSE_RESCUE_ADV, "Räddning 2") },
    { link: link(Slug.COURSE_SPORT, "Sportklätterkurs") },
    { link: link(Slug.COURSE_ASSISTANT, "Hjälpinstruktörskurs") },
  ],
  da: [],
  en: [
    {
      link: link(Slug.COURSE_CRAG_BASIC, "Rock climbing fundamentals", "en"),
    },
    {
      link: link(Slug.COURSE_CRAG_ADV, "Rock climbing continued", "en"),
    },
    { link: link(Slug.COURSE_RESCUE_BASIC, "Self-rescue 1", "en") },
    { link: link(Slug.COURSE_RESCUE_ADV, "Self-rescue 2", "en") },
  ],
};

const mobileNav: Record<Locale, Navigation> = {
  sv: [
    { link: link(Slug.HOME, "Hem") },
    {
      link: link(Slug.COURSES, "Kurser"),
      subMenu: {
        nav: courseNav.sv,
        more: link(Slug.COURSES, "Fler kurser →"),
      },
    },
    {
      link: link(Slug.TRIPS, "Resor"),
      subMenu: {
        nav: [
          { link: link(Slug.TRIP_ITALY, "Klättring i Dolomiterna") },
          { link: link(Slug.TRIP_SPAIN, "Sportklättring i Spanien") },
        ],
      },
    },
    { link: link(Slug.INSTRUCTOR_TRAINING, "Utbildning") },
    { link: link(Slug.PRICES, "Priser") },
    { link: link(Slug.ABOUT, "Om") },
    { link: link(Slug.CONTACT, "Kontakt") },
  ],
  da: [
    { link: link(Slug.HOME, "Forside", "da") },
    { link: link(Slug.ABOUT, "Om", "da") },
    { link: link(Slug.CONTACT, "Kontakt", "da") },
  ],
  en: [
    { link: link(Slug.HOME, "Home", "en") },
    { link: link(Slug.COURSES, "Courses", "en") },
    { link: link(Slug.PRICES, "Prices", "en") },
    { link: link(Slug.ABOUT, "About", "en") },
    { link: link(Slug.CONTACT, "Contact", "en") },
  ],
};

const mainNav: Record<Locale, Navigation> = {
  sv: [
    { link: link(Slug.COURSES, "Kurser") },
    { link: link(Slug.TRIPS, "Resor") },
    { link: link(Slug.INSTRUCTOR_TRAINING, "Utbildning") },
    { link: link(Slug.PRICES, "Priser") },
    { link: link(Slug.ABOUT, "Om") },
    { link: link(Slug.CONTACT, "Kontakt") },
  ],
  da: [
    { link: link(Slug.ABOUT, "Om", "da") },
    { link: link(Slug.CONTACT, "Kontakt", "da") },
  ],
  en: [
    { link: link(Slug.COURSES, "Courses", "en") },
    { link: link(Slug.PRICES, "Prices", "en") },
    { link: link(Slug.ABOUT, "About", "en") },
    { link: link(Slug.CONTACT, "Contact", "en") },
  ],
};

const footerNav: Record<Locale, Navigation> = {
  sv: [
    { link: link(Slug.TERMS_BOOKING, "Bokningsvillkor") },
    { link: link(Slug.TERMS_PRIVACY, "Integritetspolicy") },
  ],
  da: [],
  en: [],
};

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

export function configLoader() {
  return {
    name: "config-loader",
    load: async ({ store, parseData }) => {
      store.clear();

      const data = await parseData({
        id: "index",
        data: {
          siteTitle: "Sydsveriges Guidebyrå",
          siteUrl: "https://ssgb.se",
          siteTagline: {
            sv: "Klätterkurser på Kullaberg, i Spanien och Itailen",
            da: "Klatrekurser på Kullen, i Spanien og Italien",
            en: "Climbing courses in the south of Sweden, in Spain and in Italy",
          },

          contact: {
            email: "instruktor@ssgb.se",
            phone: "+46704947782",
          },

          defaultPrices: {
            openBooking: 3600,
            single: 4200,
            double: 2500,
            many: 2200,
          },

          navigation: {
            [NavArea.SIDEBAR_ASIDE]: mainNav,
            [NavArea.SIDEBAR_COURSE]: courseNav,
            [NavArea.FOOTER]: footerNav,
            [NavArea.MOBILE]: mobileNav,
          },
        },
      });

      store.set({
        id: "index",
        data,
      });
    },
    schema: configSchema,
  } satisfies Loader;
}
