import { defineCollection, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import { Slug } from "@lib/routeUtils";
import { z } from "astro/zod";
import { configLoader } from "./loaders/config";
import { localeSchema } from "./schemas/locale";
import { sanityCoursesLoader, courseSchema } from "./loaders/courses";
import { sanityPagesLoader, pageSchema } from "./loaders/pages";

const courses = defineCollection({
  loader: sanityCoursesLoader(),
  schema: courseSchema,
});

const pages = defineCollection({
  loader: sanityPagesLoader(),
  schema: pageSchema,
});

const trips = defineCollection({
  loader: glob({ base: "./src/content/trips", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      shortName: z.string().optional(),
      excerpt: z.string(),
      price: z.number(),
      prerequisites: z.string().optional(),
      heroImage: image().optional(),
      cta: z.string(),
      gallery: reference("galleries").optional(),
      slugId: z.enum(Slug),
    }),
});

const galleries = defineCollection({
  loader: file("./src/content/galleries.json"),
  schema: ({ image }) =>
    z.object({
      images: z.array(
        z.object({
          image: image(),
          alt: z.string(),
          caption: z.string().optional(),
        }),
      ),
    }),
});

const norms = defineCollection({
  loader: file("./src/content/norms.json"),
  schema: z.object({
    url: z.url(),
    title: z.string(),
  }),
});

const team = defineCollection({
  loader: file("./src/content/team.json"),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.array(z.object({ _key: localeSchema, value: z.string() })),
      image: image(),
      alt: z.string(),
      featured: z.boolean().default(false),
    }),
});

const courseSelector = defineCollection({
  loader: file("./src/content/course-selector.json"),
  schema: z.object({
    title: z.string(),
    body: z.array(
      z.array(
        z.object({
          text: z.string(),
          slug: z.enum(Slug).optional(),
        }),
      ),
    ),
  }),
});

const config = defineCollection({
  loader: configLoader(),
});

export const collections = {
  courses,
  pages,
  galleries,
  norms,
  team,
  trips,
  courseSelector,
  config,
};
