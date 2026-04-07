import type { EventEntry } from "./types/event";
import type { FientaResponse } from "./types/fienta";

export function toEvents(
  response: FientaResponse,
  now = new Date(response.time.full_datetime).getTime(),
): Required<EventEntry>[] {
  return response.data.map((event) => {
    const eventTime = new Date(event.starts_at).getTime();

    return {
      id: event.id.toString(),
      public: event.is_public,
      draft: !event.is_published,
      url: event.url,
      ticketUrl: event.buy_tickets_url,
      past: eventTime < now,
      title: {
        sv: event.translations.sv.title,
      },
    };
  });
}
