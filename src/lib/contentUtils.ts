import { NavArea, type Navigation } from "@lib/routeUtils";
import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { localeSchema } from "src/schemas/locale";

export async function getCourses(
  filter?: (entry: CollectionEntry<"courses">) => unknown | undefined,
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

  const currentLocale = localeSchema.parse(locale);
  const { data } = configEntry;

  const siteTagline = data.siteTagline[currentLocale];
  const navigation: Record<NavArea, Navigation> = {
    [NavArea.FOOTER]: data.navigation[NavArea.FOOTER][currentLocale],
    [NavArea.SIDEBAR_ASIDE]:
      data.navigation[NavArea.SIDEBAR_ASIDE][currentLocale],
    [NavArea.MOBILE]: data.navigation[NavArea.MOBILE][currentLocale],
  };

  return {
    ...configEntry.data,
    siteTagline,
    navigation,
  };
}
