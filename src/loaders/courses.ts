import type { Loader } from "astro/loaders";
import type { CdaStructuredTextValue } from "@datocms/astro/StructuredText";
import { z } from "astro/zod";
import { executeQuery } from "@lib/datocms";
import { COURSES_QUERY } from "@lib/datoQueries";
import { LOCALE_CODES } from "@lib/routeUtils";
import { datoImageSchema, datoNormSchema } from "src/schemas/dato";
import { localeSchema } from "src/schemas/locale";

export const courseSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  language: localeSchema.default("sv"),
  numDays: z.array(z.number()),
  order: z.number().min(0),
  featured: z.boolean().optional(),
  prerequisites: z.string().nullable().optional(),
  heroImage: datoImageSchema.optional(),
  maxParticipants: z.number().min(1).default(4),
  minAge: z.number().nullable().default(null),
  norm: datoNormSchema.optional(),
  body: z.custom<CdaStructuredTextValue>().optional(),
});

type DatoCourse = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: CdaStructuredTextValue | null;
  featuredImage: {
    url: string;
    width: number;
    height: number;
    alt: string | null;
  } | null;
  numDaysMin: number;
  numDaysMax: number | null;
  featured: boolean;
  prerequisites: string | null;
  maxParticipants: number | null;
  minAge: number | null;
  norm: { title: string; url: string | null } | null;
};

export function datoCoursesLoader(): Loader {
  return {
    name: "dato-courses-loader",
    load: async ({ store, parseData, logger }) => {
      store.clear();

      for (const locale of LOCALE_CODES) {
        const { allCourses } = await executeQuery<{ allCourses: DatoCourse[] }>(
          COURSES_QUERY,
          { locale },
        );

        logger.info(
          `Loaded ${allCourses.length} ${locale} courses from DatoCMS`,
        );

        for (const course of allCourses) {
          if (!course.slug) {
            logger.warn(
              `Course ${course.id} (${locale}) has no slug — skipping`,
            );
            continue;
          }

          const data = await parseData({
            id: `${locale}-${course.slug}`,
            data: {
              title: course.title,
              slug: course.slug,
              excerpt: course.excerpt,
              language: locale,
              numDays:
                course.numDaysMax !== null &&
                course.numDaysMax !== course.numDaysMin
                  ? [course.numDaysMin, course.numDaysMax]
                  : [course.numDaysMin],
              order: allCourses.indexOf(course),
              featured: course.featured ?? false,
              prerequisites: course.prerequisites ?? undefined,
              heroImage: course.featuredImage
                ? {
                    src: course.featuredImage.url,
                    width: course.featuredImage.width,
                    height: course.featuredImage.height,
                    alt: course.featuredImage.alt ?? undefined,
                  }
                : undefined,
              maxParticipants: course.maxParticipants ?? 4,
              minAge: course.minAge ?? null,
              norm: course.norm ?? undefined,
              body: course.content ?? undefined,
            },
          });

          store.set({ id: `${locale}-${course.slug}`, data });
        }
      }
    },
  };
}
