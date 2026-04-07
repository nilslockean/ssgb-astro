import { z } from "astro:content";

export const fientaResponseSchema = z.object({
  time: z.object({
    full_datetime: z.string(),
  }),
  data: z.array(
    z.object({
      id: z.number(),
      starts_at: z.string(),
      ends_at: z.string(),
      sale_status: z.enum([
        "onSale",
        "salesEnded",
        "salesNotStarted",
        "soldOut",
      ]),
      is_published: z.boolean(),
      is_public: z.boolean(),
      url: z.string().url(),
      buy_tickets_url: z.string().url(),
      translations: z.object({
        sv: z.object({
          title: z.string(),
          description: z.string(),
          duration_string: z.string(),
          notes_about_time: z.string().nullable(),
        }),
      }),
    }),
  ),
});

export type FientaResponse = z.infer<typeof fientaResponseSchema>;
