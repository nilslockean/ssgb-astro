import type { Loader } from "astro/loaders";
import type { CdaStructuredTextValue } from "@datocms/astro/StructuredText";
import { z } from "astro/zod";
import { executeQuery } from "@lib/datocms";
import { TRIPS_QUERY } from "@lib/datoQueries";
import { LOCALE_CODES } from "@lib/routeUtils";
import { datoImageSchema, datoNormSchema } from "src/schemas/dato";
import { localeSchema } from "src/schemas/locale";

export const tripSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  cta: z.string(),
  price: z.number().optional(),
  prerequisites: z.string().nullable().optional(),
  order: z.number().min(0),
  heroImage: datoImageSchema.optional(),
  body: z.custom<CdaStructuredTextValue>().optional(),
  norm: datoNormSchema.optional(),
  language: localeSchema.default("sv"),
});

const datoTripSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string().nullable(),
  excerpt: z.string(),
  featuredImage: z
    .object({
      url: z.string(),
      width: z.number(),
      height: z.number(),
      alt: z.string().nullable(),
    })
    .nullable(),
  content: z.custom<CdaStructuredTextValue>().nullable(),
  cta: z.string(),
  price: z.number().nullable(),
  prerequisites: z.string().nullable(),
  norm: z
    .object({
      title: z.string(),
      url: z.string().nullable(),
    })
    .nullable(),
  position: z.number(),
});

export function datoTripsLoader(): Loader {
  return {
    name: "dato-trips-loader",
    load: async ({ store, parseData, logger }) => {
      store.clear();

      for (const locale of LOCALE_CODES) {
        const { allTrips } = await executeQuery(
          TRIPS_QUERY,
          z.object({ allTrips: z.array(datoTripSchema) }),
          { locale },
        );

        logger.info(`Loaded ${allTrips.length} ${locale} trips from DatoCMS`);

        for (const trip of allTrips) {
          if (!trip.slug) {
            logger.warn(`Trip ${trip.id} (${locale}) has no slug — skipping`);
            continue;
          }

          const data = await parseData({
            id: `${locale}-${trip.slug}`,
            data: {
              title: trip.title,
              slug: trip.slug,
              excerpt: trip.excerpt,
              cta: trip.cta,
              price: trip.price ?? undefined,
              prerequisites: trip.prerequisites ?? undefined,
              order: trip.position,
              heroImage: trip.featuredImage
                ? {
                    src: trip.featuredImage.url,
                    width: trip.featuredImage.width,
                    height: trip.featuredImage.height,
                    alt: trip.featuredImage.alt ?? undefined,
                  }
                : undefined,
              body: trip.content ?? undefined,
              norm: trip.norm ?? undefined,
              language: locale,
            },
          });

          store.set({ id: `${locale}-${trip.slug}`, data });
        }
      }
    },
  };
}
