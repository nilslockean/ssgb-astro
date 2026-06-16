import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import { executeQuery } from "@lib/datocms";
import { TEAMS_QUERY } from "@lib/datoQueries";
import { LOCALE_CODES } from "@lib/routeUtils";
import { datoImageSchema } from "src/schemas/dato";
import { localeSchema } from "src/schemas/locale";

export const teamSchema = z.object({
  name: z.string(),
  bio: z.string(),
  image: datoImageSchema,
  alt: z.string().nullable().optional(),
  title: z.string().optional(),
  language: localeSchema.default("sv"),
  position: z.number().optional(),
});

const datoTeamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string().nullable(),
  bio: z.string().nullable(),
  image: z
    .object({
      url: z.string(),
      width: z.number(),
      height: z.number(),
      alt: z.string().nullable(),
    })
    .nullable(),
  position: z.number(),
});

export function datoTeamLoader(): Loader {
  return {
    name: "dato-team-loader",
    load: async ({ store, parseData, logger }) => {
      store.clear();

      for (const locale of LOCALE_CODES) {
        const result = await executeQuery(
          TEAMS_QUERY,
          z.object({ allTeams: z.array(datoTeamMemberSchema) }),
          { locale },
        );

        const parsed = result.allTeams;

        logger.info(
          `Loaded ${parsed.length} ${locale} team members from DatoCMS`,
        );

        for (const person of parsed) {
          const data = await parseData({
            id: `${locale}-${person.id}`,
            data: {
              name: person.name,
              bio: person.bio ?? "",
              image: person.image
                ? {
                    src: person.image.url,
                    width: person.image.width,
                    height: person.image.height,
                    alt: person.image.alt ?? undefined,
                  }
                : undefined,
              alt: person.image?.alt ?? undefined,
              title: person.title ?? undefined,
              language: locale,
              position: person.position,
            },
          });

          store.set({ id: `${locale}-${person.id}`, data });
        }
      }
    },
  };
}
