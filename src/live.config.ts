import { defineLiveCollection } from "astro:content";
import { sanityPagesLoader, pageSchema } from "./loaders/pages";

const pages = defineLiveCollection({
  loader: sanityPagesLoader(),
  schema: pageSchema,
});

export const collections = { pages };
