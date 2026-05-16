import type { Loader } from "astro/loaders";
import { sanityClient } from "@lib/sanity";
import { COURSES_QUERY } from "@lib/queries";

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
