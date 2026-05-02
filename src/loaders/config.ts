// 1. Import the `Loader` type and any other dependencies needed
import {
  courseNav,
  footerNav,
  headerNav,
  mainNav,
  mobileNav,
  NavArea,
} from "@config";
import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import { localeSchema } from "../schemas/locale";

const navLinkSchema = z.object({
  label: z.string(),
  path: z.string(),
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

// 2. Define any options that your loader needs
export function configLoader() {
  // 3. Return a loader object
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
    // 4. Define the schema of an entry.
    schema: configSchema,
  } satisfies Loader;
}
