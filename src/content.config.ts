import { defineCollection, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import config, { Slug } from "@config";
import { z } from "astro/zod";

const courses = defineCollection({
  loader: glob({ base: "./src/content/courses", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      numDays: z.array(z.number()),
      order: z.number().min(0),
      featured: z.boolean().optional(),
      openBookingPrice: z.number().default(config.defaultPrices.openBooking),
      maxParticipants: z.number().min(1).default(4),
      minAge: z.number().nullable().default(null),
      shortName: z.string().optional(),
      prerequisites: z.string().optional(),
      heroImage: image().optional(),
      cta: z.string(),
      norm: reference("norms").optional(),
      aka: z.string().optional(),
      gallery: reference("galleries").optional(),
      slugId: z.enum(Slug),
    }),
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

const pages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "**/*.{md,mdx}" }),
  schema: () =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
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
      description: z.string(),
      image: image(),
      alt: z.string(),
      featured: z.boolean().default(false),
    }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { courses, galleries, norms, team, pages, trips };
