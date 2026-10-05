import { describe, expect, it } from "vitest";
import { getCourseStructuredText } from "./courseContentUtils";

describe("getCourseStructuredText", () => {
  const legacy = {
    value: {
      document: {
        type: "root",
        children: [
          { type: "paragraph", children: [{ type: "span", value: "Legacy" }] },
        ],
      },
    },
  };
  const content = (children: unknown[]) => ({
    value: { document: { type: "root", children } },
  });

  it("prefers non-empty global structured text", () => {
    const current = content([
      { type: "paragraph", children: [{ type: "span", value: "Current" }] },
    ]);

    expect(getCourseStructuredText(current, legacy)).toBe(current);
  });

  it("falls back to legacy content when the global document is empty", () => {
    expect(
      getCourseStructuredText(
        content([
          { type: "paragraph", children: [{ type: "span", value: "" }] },
        ]),
        legacy,
      ),
    ).toBe(legacy);
  });

  it("returns undefined when both fields are empty", () => {
    expect(
      getCourseStructuredText(
        undefined,
        content([
          { type: "paragraph", children: [{ type: "span", value: "" }] },
        ]),
      ),
    ).toBeUndefined();
  });
});
