import { describe, expect, test } from "vitest";
import { composePath, courseUrl } from "./routeUtils";

describe("courseUrl", () => {
  test("Swedish course uses /kurser/{slug} with no locale prefix", () => {
    expect(courseUrl("grundkurs", "sv")).toBe("/kurser/grundkurs/");
  });

  test("English course uses /en/courses/{slug}", () => {
    expect(courseUrl("basic-rock-climbing-course", "en")).toBe(
      "/en/courses/basic-rock-climbing-course/",
    );
  });

  test("Danish course uses /da/kurser/{slug}", () => {
    expect(courseUrl("grundkurs", "da")).toBe("/da/kurser/grundkurs/");
  });

  test("defaults to Swedish when no locale given", () => {
    expect(courseUrl("topprepskurs")).toBe("/kurser/topprepskurs/");
  });
});

describe("composePath", () => {
  test("Default locale is sv", () => {
    const a = composePath("test");
    const b = composePath("test", "sv");
    expect(a).toBe(b);
  });

  test("Returns slash followed by slug and trailing slash", () => {
    expect(composePath("test")).toBe("/test/");
  });

  test("Supports root page", () => {
    expect(composePath("")).toBe("/");
    expect(composePath("/")).toBe("/");
    expect(composePath("", "da")).toBe("/da/");
  });

  test("Adds locale prefix if not default locale", () => {
    expect(composePath("test", "da")).toBe("/da/test/");
  });

  test("Strips slashes from slug", () => {
    expect(composePath("/test/", "da")).toBe("/da/test/");
    expect(composePath("/test", "da")).toBe("/da/test/");
    expect(composePath("test/", "da")).toBe("/da/test/");
  });

  test("Throws if slug is nested", () => {
    expect(() => {
      composePath("/test/nested/");
    }).toThrow();
  });

  test("Adds parent page if provided", () => {
    expect(composePath("grundkurs", "sv", "kurser")).toBe("/kurser/grundkurs/");
    expect(composePath("test", "sv", "nested/path")).toBe("/nested/path/test/");
    expect(composePath("test", "sv", "/nested/path")).toBe(
      "/nested/path/test/",
    );
    expect(composePath("test", "sv", "/nested/path/")).toBe(
      "/nested/path/test/",
    );
    expect(composePath("test", "sv", "nested/path/")).toBe(
      "/nested/path/test/",
    );
  });

  test("Ignores parent page if slug is falsy", () => {
    expect(composePath("", "sv", "kurser")).toBe("/");
  });
});
