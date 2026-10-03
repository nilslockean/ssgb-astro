import { describe, expect, it } from "vitest";
import { mapTeamTitles } from "./teamUtils";

describe("mapTeamTitles", () => {
  it("keeps localized title labels and optional descriptions", () => {
    expect(
      mapTeamTitles([
        { id: "title-1", title: "Guide", description: "Leads the courses" },
        { id: "title-2", title: "Instructor", description: null },
      ]),
    ).toEqual([
      { id: "title-1", title: "Guide", description: "Leads the courses" },
      { id: "title-2", title: "Instructor", description: undefined },
    ]);
  });

  it("omits records without a localized title", () => {
    expect(
      mapTeamTitles([{ id: "title-1", title: null, description: null }]),
    ).toEqual([]);
  });
});
