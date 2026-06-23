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
  norm: datoNormSchema.optional(),
  body: z.custom<CdaStructuredTextValue>().optional(),
  form: z.string().optional(),
  preselectedFields: z.json().optional(),
  hasPage: z.boolean(),
});

const datoCourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string().nullable(),
  excerpt: z.string(),
  content: z.custom<CdaStructuredTextValue>().nullable(),
  featuredImage: z
    .object({
      url: z.string(),
      width: z.number(),
      height: z.number(),
      alt: z.string().nullable(),
    })
    .nullable(),
  numDaysMin: z.number(),
  numDaysMax: z.number().nullable(),
  featured: z.boolean(),
  prerequisites: z.string().nullable(),
  maxParticipants: z.number().nullable(),
  norm: z
    .object({
      title: z.string(),
      url: z.string().nullable(),
    })
    .nullable(),
  form: z.object({ id: z.string() }).nullable(),
  preselectedFields: z.json().nullable(),
  hasPage: z.boolean(),
});

export function datoCoursesLoader(): Loader {
  return {
    name: "dato-courses-loader",
    load: async ({ store, parseData, logger }) => {
      store.clear();

      for (const locale of LOCALE_CODES) {
        const { allCourses } = await executeQuery(
          COURSES_QUERY,
          z.object({ allCourses: z.array(datoCourseSchema) }),
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
              norm: course.norm ?? undefined,
              body: course.content ?? undefined,
              form: course.form ? `${locale}-${course.form.id}` : undefined,
              preselectedFields: course.preselectedFields,
              hasPage: course.hasPage,
            },
          });

          store.set({ id: `${locale}-${course.slug}`, data });
        }
      }
    },
  };
}
