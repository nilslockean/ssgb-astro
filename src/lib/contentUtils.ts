import { getCollection, type CollectionEntry } from "astro:content";

export async function getCourses(
  filter?: (entry: CollectionEntry<"courses">) => unknown | undefined,
) {
  const courses = await getCollection("courses", filter);

  return courses.sort((a, b) => a.data.order - b.data.order);
}
