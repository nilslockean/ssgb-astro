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

const seoAttributesSchema = z.record(z.string(), z.string()).nullable();
const seoContentSchema = z.string().nullable();

export const datoSeoTagSchema = z.object({
  tag: z.string(),
  content: seoContentSchema,
  attributes: seoAttributesSchema,
});

export type DatoSeoTag = z.infer<typeof datoSeoTagSchema>;

export const datoSeoTagsSchema = z.array(datoSeoTagSchema);

export const datoResponsiveImageSchema = z.object({
  src: z.string(),
  width: z.number(),
  height: z.number(),
  alt: z.string().nullable().optional(),
  base64: z.string().nullable().optional(),
});

export type DatoResponsiveImage = z.infer<typeof datoResponsiveImageSchema>;
