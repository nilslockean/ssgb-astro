import { z } from "astro/zod";

export const sanityImageSchema = z.object({
  src: z.string().url(),
  width: z.number(),
  height: z.number(),
});

export type SanityImage = z.infer<typeof sanityImageSchema>;

export const sanityNormSchema = z.object({
  title: z.string(),
  url: z.string().url().nullable(),
});

export type SanityNorm = z.infer<typeof sanityNormSchema>;
