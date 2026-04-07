import { describe, it, expect } from "vitest";
import { toEvents } from "./eventUtils";
import type { FientaResponse } from "./types/fienta";
import type { EventEntry } from "./types/event";

// --- minimal fixtures ------------------------------------------------------

const baseResponse: Pick<FientaResponse, "time" | "data"> = {
  time: { full_datetime: "2025-01-01T10:00:00Z" },
  data: [],
};

function fientaEvent(
  overrides: Partial<FientaResponse["data"][number]> = {},
): FientaResponse["data"][number] {
  return {
    id: 123,
    starts_at: "2025-01-02T10:00:00Z",
    ends_at: "2025-01-02T12:00:00Z",
    sale_status: "onSale",
    is_published: true,
    is_public: true,
    url: "https://example.com/event",
    buy_tickets_url: "https://example.com/tickets",
    translations: {
      sv: {
        title: "Grundkurs",
        description: "",
        duration_string: "",
        notes_about_time: null,
      },
    },
    ...overrides,
  };
}

// --- tests -----------------------------------------------------------------

describe("toEvents", () => {
  it("maps a published public event to an EventEntry", () => {
    const response: FientaResponse = {
      ...baseResponse,
      data: [fientaEvent()],
    };

    const result = toEvents(response);

    expect(result).toHaveLength(1);

    const event: EventEntry = result[0];

    expect(event).toEqual({
      id: "123",
      public: true,
      draft: false,
      url: "https://example.com/event",
      ticketUrl: "https://example.com/tickets",
      past: false,
      title: {
        sv: "Grundkurs",
      },
    });
  });

  it("marks events in the past when start time is before server time", () => {
    const response: FientaResponse = {
      time: { full_datetime: "2025-01-03T10:00:00Z" },
      data: [
        fientaEvent({
          starts_at: "2025-01-01T10:00:00Z",
        }),
      ],
    };

    const result = toEvents(response);

    expect(result[0].past).toBe(true);
  });

  it("converts ids to strings", () => {
    const response: FientaResponse = {
      time: { full_datetime: "2025-01-03T10:00:00Z" },
      data: [
        fientaEvent({
          id: 123,
        }),
      ],
    };

    const result = toEvents(response);

    expect(result[0].id).toBe("123");
  });

  it("does not mark future events as past", () => {
    const response: FientaResponse = {
      time: { full_datetime: "2025-01-01T10:00:00Z" },
      data: [
        fientaEvent({
          starts_at: "2025-01-02T10:00:00Z",
        }),
      ],
    };

    const result = toEvents(response);

    expect(result[0].past).toBe(false);
  });

  it("marks unpublished events as draft", () => {
    const response: FientaResponse = {
      ...baseResponse,
      data: [
        fientaEvent({
          is_published: false,
        }),
      ],
    };

    const result = toEvents(response);

    expect(result[0].draft).toBe(true);
  });

  it("handles multiple events", () => {
    const response: FientaResponse = {
      ...baseResponse,
      data: [fientaEvent({ id: 1 }), fientaEvent({ id: 2 })],
    };

    const result = toEvents(response);

    expect(result.map((e) => e.id)).toEqual(["1", "2"]);
  });
});
