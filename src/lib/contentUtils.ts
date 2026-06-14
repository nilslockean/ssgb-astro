import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { localeSchema } from "src/schemas/locale";

export async function getCourses(
  filter?: (entry: CollectionEntry<"courses">) => unknown,
) {
  const courses = await getCollection(
    "courses",
    (course) => course.data.language === "sv" && (!filter || filter(course)),
  );
  return courses.sort((a, b) => a.data.order - b.data.order);
}

export async function getLocalizedConfig(locale = "sv") {
  const configEntry = await getEntry("config", "index");
  if (!configEntry) {
    throw new Error("No config entry with id index found");
  }

  const currentLocale = localeSchema.catch("sv").parse(locale);
  const { data } = configEntry;

  return {
    ...data,
    siteTagline: data.siteTagline[currentLocale],
    navigation: {
      primary: data.navigation.primary[currentLocale] ?? [],
      secondary: data.navigation.secondary[currentLocale] ?? [],
      footer: data.navigation.footer[currentLocale] ?? [],
    },
  };
}
