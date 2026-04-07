import { z } from "astro:content";

export const eventEntrySchema = z.object({
  id: z.string(),
  public: z.boolean(),
  draft: z.boolean(),
  url: z.string().url(),
  ticketUrl: z.string().url(),
  past: z.boolean(),
  title: z.object({
    sv: z.string(),
  }),
});
export type EventEntry = z.infer<typeof eventEntrySchema>;
