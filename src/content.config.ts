import { defineCollection } from "astro:content";
import { configLoader, configSchema } from "./loaders/config";
import { datoCoursesLoader, courseSchema } from "./loaders/courses";
import { datoPagesLoader, pageSchema } from "./loaders/pages";
import { datoTeamLoader, teamSchema } from "./loaders/team";
import { datoTripsLoader, tripSchema } from "./loaders/trips";

const courses = defineCollection({
  loader: datoCoursesLoader(),
  schema: courseSchema,
});

const pages = defineCollection({
  loader: datoPagesLoader(),
  schema: pageSchema,
});

const trips = defineCollection({
  loader: datoTripsLoader(),
  schema: tripSchema,
});

const team = defineCollection({
  loader: datoTeamLoader(),
  schema: teamSchema,
});

const config = defineCollection({
  loader: configLoader(),
  schema: configSchema,
});

export const collections = {
  courses,
  pages,
  team,
  trips,
  config,
};
