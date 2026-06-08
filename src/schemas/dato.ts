import { z } from "astro/zod";

export const datoImageSchema = z.object({
  src: z.string().url(),
  width: z.number(),
  height: z.number(),
  alt: z.string().nullable().optional(),
});

export type DatoImage = z.infer<typeof datoImageSchema>;

export const datoNormSchema = z.object({
  title: z.string(),
  url: z.string().url().nullable(),
});

export type DatoNorm = z.infer<typeof datoNormSchema>;
