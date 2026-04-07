import { fientaResponseSchema, type FientaResponse } from "./types/fienta";

export type EmbedOptions = Partial<{
  // lightbox background color
  background: string;

  // modal content border radius
  border_radius: string;

  // selector of links pointing to Fienta event pages
  link_selector: string;

  // referral name
  utm_source: string;

  // By default, our embed does not include the event description.
  descriptionEnabled: boolean;

  // To display the description as initial view, add:
  step: "description";

  // To display the event image:
  imageEnabled: boolean;

  // To pass buyer email address:
  email: string;

  // On each page load and ticket purchase by the visitor, a "onTicketsAvailableReady"
  // event is triggered. Use this to display the number of tickets left or to modify
  // your HTML, for example by disabling the link when sale has ended.
  onTicketsAvailableReady: (
    // HTML a tag pointing to event at fienta.com
    elem: HTMLAnchorElement,
    // number of tickets available, possible values:
    // true - when more than 50 tickets are available
    // 1 .. 50 - number tickets available
    // 0 - event is sold out
    // false - sale has ended
    count: number | boolean,
  ) => void;
}>;

export async function fetchEvents(apiKey: string): Promise<FientaResponse> {
  const url = new URL("https://fienta.com/api/v1/events");
  url.searchParams.set("organizer", "11092");
  url.searchParams.set("starts_from", "1970-01-01 01:00:00");

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${apiKey}`);

  const response = await fetch(url, {
    headers,
  });
  const json = await response.json();
  const result = fientaResponseSchema.parse(json);

  return result;
}
