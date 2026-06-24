import type { Loader } from "astro/loaders";
import type { CdaStructuredTextValue } from "@datocms/astro/StructuredText";
import { z } from "astro/zod";
import { executeQuery } from "@lib/datocms";
import { HOME_PAGE_QUERY } from "@lib/datoQueries";
import {
  LOCALE_CODES,
  type Locale,
  courseUrl,
  tripUrl,
  composePath,
} from "@lib/routeUtils";
import { localeSchema } from "src/schemas/locale";
import { datoSeoTagsSchema, type DatoSeoTag } from "../schemas/dato";

const datoLinkSchema = z.object({
  __typename: z.string().optional(),
  slug: z.string(),
});

const datoButtonSchema = z.object({
  id: z.string(),
  __typename: z.literal("ButtonRecord"),
  variant: z.string().nullable(),
  label: z.string(),
  url: z.string().nullable(),
  link: datoLinkSchema.nullable(),
});

const datoVideoSchema = z
  .object({
    muxPlaybackId: z.string(),
    streamingUrl: z.string(),
    mp4High: z.string().nullable(),
    mp4Med: z.string().nullable(),
    thumbnailUrl: z.string(),
  })
  .nullable();

const datoUploadSchema = z
  .object({
    video: datoVideoSchema,
  })
  .nullable();

const datoStructuredTextSchema = z.object({
  value: z.custom<CdaStructuredTextValue["value"]>(),
  blocks: z.custom<CdaStructuredTextValue["blocks"]>().optional(),
  links: z.custom<CdaStructuredTextValue["links"]>().optional(),
});

const datoHomePageSchema = z.object({
  seo: datoSeoTagsSchema,
  eyebrow: z.string().nullable(),
  tagline: z.string().nullable(),
  title: z.string(),
  heroDescription: z.string().nullable(),
  heroButtons: z.array(datoButtonSchema).nullable(),
  structuredText: datoStructuredTextSchema.nullable(),
  heroVideo: datoUploadSchema,
});

export const heroButtonSchema = z.object({
  variant: z.string(),
  label: z.string(),
  href: z.string(),
});

export const homePageSchema = z.object({
  eyebrow: z.record(localeSchema, z.string()),
  tagline: z.record(localeSchema, z.string()),
  title: z.record(localeSchema, z.string()),
  heroDescription: z.record(localeSchema, z.string()),
  heroButtons: z.record(localeSchema, z.array(heroButtonSchema)),
  structuredText: z.record(localeSchema, z.custom<CdaStructuredTextValue>()),
  heroVideo: z.string(),
  seo: z.record(localeSchema, datoSeoTagsSchema),
});

export const localizedHomePageSchema = z.object({
  eyebrow: z.string(),
  tagline: z.string(),
  title: z.string(),
  heroDescription: z.string(),
  heroButtons: z.array(heroButtonSchema),
  structuredText: z.custom<CdaStructuredTextValue>(),
  heroVideo: z.string(),
  seo: datoSeoTagsSchema,
});

function resolveButtonLink(
  link: z.infer<typeof datoLinkSchema> | null,
  locale: Locale,
): string | null {
  if (!link) return null;
  switch (link.__typename) {
    case "CourseRecord":
      return courseUrl(link.slug, locale);
    case "TripRecord":
      return tripUrl(link.slug, locale);
    default:
      return composePath(link.slug, locale);
  }
}

export function homePageLoader(): Loader {
  return {
    name: "dato-home-page-loader",
    load: async ({ store, parseData, logger }) => {
      store.clear();

      const results: Array<{
        locale: Locale;
        data: z.infer<typeof datoHomePageSchema>;
      }> = [];

      for (const locale of LOCALE_CODES) {
        const { homePage } = await executeQuery(
          HOME_PAGE_QUERY,
          z.object({ homePage: datoHomePageSchema }),
          { locale },
        );
        if (!homePage) {
          throw new Error("No homePage record found in DatoCMS");
        }
        results.push({ locale, data: homePage });
        logger.info(`Loaded ${locale} home page from DatoCMS`);
      }

      const eyebrow: Record<string, string> = {};
      const tagline: Record<string, string> = {};
      const title: Record<string, string> = {};
      const heroDescription: Record<string, string> = {};
      const heroButtons: Record<string, z.infer<typeof heroButtonSchema>[]> =
        {};
      const structuredText: Record<string, CdaStructuredTextValue> = {};
      const seo: Record<string, DatoSeoTag[]> = {};
      let heroVideo = "";

      for (const { locale, data } of results) {
        eyebrow[locale] = data.eyebrow ?? "";
        tagline[locale] = data.tagline ?? "";
        title[locale] = data.title;
        heroDescription[locale] = data.heroDescription ?? "";

        heroButtons[locale] = (data.heroButtons ?? []).map((btn) => ({
          variant: btn.variant ?? "default",
          label: btn.label,
          href: resolveButtonLink(btn.link, locale) ?? btn.url ?? "#",
        }));

        structuredText[locale] = data.structuredText as CdaStructuredTextValue;
        seo[locale] = data.seo;

        if (!heroVideo && data.heroVideo?.video?.mp4High) {
          heroVideo = data.heroVideo.video.mp4High;
        }
        if (!heroVideo && data.heroVideo?.video?.mp4Med) {
          heroVideo = data.heroVideo.video.mp4Med;
        }
      }

      const data = await parseData({
        id: "index",
        data: {
          eyebrow,
          tagline,
          title,
          heroDescription,
          heroButtons,
          structuredText,
          heroVideo,
          seo,
        },
      });

      store.set({ id: "index", data });
    },
  };
}
