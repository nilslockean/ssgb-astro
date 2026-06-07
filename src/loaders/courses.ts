import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import { sanityClient } from "@lib/sanity";
import { COURSES_QUERY } from "@lib/queries";
import { sanityImageSchema, sanityNormSchema } from "src/schemas/sanity";
import { localeSchema } from "src/schemas/locale";

export const courseSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  language: localeSchema.default("sv"),
  slug: z.string().optional(),
  numDays: z.array(z.number()),
  order: z.number().min(0),
  featured: z.boolean().optional(),
  openBookingPrice: z.number().default(3600),
  maxParticipants: z.number().min(1).default(4),
  minAge: z.number().nullable().default(null),
  shortName: z.string().optional(),
  prerequisites: z.string().optional(),
  heroImage: sanityImageSchema.optional(),
  cta: z.string(),
  norm: sanityNormSchema.optional(),
  aka: z.string().optional(),
  body: z.array(z.any()).optional(),
});

export function sanityCoursesLoader(): Loader {
  return {
    name: "sanity-courses-loader",
    load: async ({ store, parseData, logger }) => {
      store.clear();

      const courses = await sanityClient.fetch(COURSES_QUERY);
      logger.info(`Loaded ${courses.length} courses from Sanity`);

      for (const course of courses) {
        const id = course.slug as string | undefined;
        if (!id) {
          logger.warn(`Course "${course.title}" has no slug — skipping`);
          continue;
        }

        const data = await parseData({
          id,
          data: {
            title: course.title,
            shortName: course.shortName ?? undefined,
            excerpt: course.excerpt,
            language: course.language ?? "sv",
            numDays: course.numDays,
            order: course.order,
            featured: course.featured ?? false,
            openBookingPrice: course.openBookingPrice ?? undefined,
            maxParticipants: course.maxParticipants ?? undefined,
            minAge: course.minAge ?? null,
            prerequisites: course.prerequisites ?? undefined,
            heroImage: course.heroImage ?? undefined,
            cta: course.cta,
            aka: course.aka ?? undefined,
            body: course.body ?? [],
            norm: course.norm ?? undefined,
          },
        });

        store.set({ id, data });
      }
    },
  };
}
