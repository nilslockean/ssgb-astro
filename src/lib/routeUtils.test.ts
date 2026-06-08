import { describe, expect, test } from "vitest";
import { courseUrl } from "./routeUtils";

describe("courseUrl", () => {
  test("Swedish course uses /kurser/{slug} with no locale prefix", () => {
    expect(courseUrl("grundkurs", "sv")).toBe("/kurser/grundkurs");
  });

  test("English course uses /en/courses/{slug}", () => {
    expect(courseUrl("basic-rock-climbing-course", "en")).toBe(
      "/en/courses/basic-rock-climbing-course",
    );
  });

  test("Danish course uses /da/kurser/{slug}", () => {
    expect(courseUrl("grundkurs", "da")).toBe("/da/kurser/grundkurs");
  });

  test("defaults to Swedish when no locale given", () => {
    expect(courseUrl("topprepskurs")).toBe("/kurser/topprepskurs");
  });
});
