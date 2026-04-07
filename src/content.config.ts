import { defineCollection, reference, z } from "astro:content";
import { file, glob } from "astro/loaders";
import config, { Slug } from "@config";
import { eventEntrySchema } from "@lib/types/event";
import { FIENTA_API_KEY } from "astro:env/server";
import { fetchEvents } from "@lib/fientaUtils";
import { toEvents } from "@lib/eventUtils";

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
      shortName: z.string().optional(),
      prerequisites: z.string().optional(),
      heroImage: image().optional(),
      cta: z.string(),
      norm: reference("norms").optional(),
      aka: z.string().optional(),
      gallery: reference("galleries").optional(),
      slugId: z.nativeEnum(Slug),
    }),
});

const pages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "**/*.{md,mdx}" }),
  schema: () =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      slugId: z.nativeEnum(Slug),
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
    url: z.string().url(),
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
    }),
});

const events = defineCollection({
  loader: async () => {
    const result = await fetchEvents(FIENTA_API_KEY);
    return toEvents(result);
  },
  schema: eventEntrySchema,
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { courses, galleries, norms, team, pages, events };
