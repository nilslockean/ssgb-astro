import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "mwa46sl5",
  dataset: process.env.SANITY_DATASET ?? "production",
  apiVersion: "2026-03-22",
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});
