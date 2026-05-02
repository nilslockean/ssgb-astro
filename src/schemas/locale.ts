import { z } from "astro/zod";

export const localeSchema = z.enum(["sv", "da", "en"]);
