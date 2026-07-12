import { describe, expect, test, vi } from "vitest";
import { composePath, courseUrl } from "./routeUtils";
import { detectPageType, getLocalizedUrls } from "./contentUtils.ts";

const mockGetCollection = vi.fn();

vi.mock("astro:content", () => ({
  getCollection: mockGetCollection,
}));

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

describe("detectPageType", () => {
  test("home page (sv)", () => {
    expect(detectPageType(new URL("http://localhost/"))).toEqual({
      type: "home",
      locale: "sv",
    });
  });

  test("home page (en)", () => {
    expect(detectPageType(new URL("http://localhost/en/"))).toEqual({
      type: "home",
      locale: "en",
    });
  });

  test("home page (da)", () => {
    expect(detectPageType(new URL("http://localhost/da/"))).toEqual({
      type: "home",
      locale: "da",
    });
  });

  test("en course page", () => {
    expect(
      detectPageType(new URL("http://localhost/en/courses/basic-rock/")),
    ).toEqual({ type: "course", locale: "en", slug: "basic-rock" });
  });

  test("da course page", () => {
    expect(
      detectPageType(new URL("http://localhost/da/kurser/grundkursus/")),
    ).toEqual({ type: "course", locale: "da", slug: "grundkursus" });
  });

  test("sv course page", () => {
    expect(
      detectPageType(new URL("http://localhost/kurser/grundkurs/")),
    ).toEqual({ type: "course", locale: "sv", slug: "grundkurs" });
  });

  test("en page", () => {
    expect(detectPageType(new URL("http://localhost/en/about/"))).toEqual({
      type: "page",
      locale: "en",
      slug: "about",
    });
  });

  test("da page", () => {
    expect(detectPageType(new URL("http://localhost/da/om-os/"))).toEqual({
      type: "page",
      locale: "da",
      slug: "om-os",
    });
  });

  test("sv page", () => {
    expect(detectPageType(new URL("http://localhost/om-oss/"))).toEqual({
      type: "page",
      locale: "sv",
      slug: "om-oss",
    });
  });

  test("sv trip page", () => {
    expect(detectPageType(new URL("http://localhost/resor/maj-2025/"))).toEqual(
      { type: "trip", locale: "sv", slug: "maj-2025" },
    );
  });
});

describe("getLocalizedUrls", () => {
  test("home page returns locale roots", async () => {
    const result = await getLocalizedUrls(new URL("http://localhost/"));
    expect(result).toEqual({ sv: "/", da: "/da/", en: "/en/" });
  });

  test("en home returns locale roots", async () => {
    const result = await getLocalizedUrls(new URL("http://localhost/en/"));
    expect(result).toEqual({ sv: "/", da: "/da/", en: "/en/" });
  });

  test("course page returns translated URLs", async () => {
    mockGetCollection.mockResolvedValue([
      {
        id: "en-111",
        data: { slug: "basic-rock", language: "en" },
      },
      {
        id: "sv-111",
        data: { slug: "grundkurs", language: "sv" },
      },
      {
        id: "da-111",
        data: { slug: "grundkursus", language: "da" },
      },
    ]);

    const result = await getLocalizedUrls(
      new URL("http://localhost/en/courses/basic-rock/"),
    );
    expect(result).toEqual({
      en: "/en/courses/basic-rock/",
      sv: "/kurser/grundkurs/",
      da: "/da/kurser/grundkursus/",
    });
  });

  test("page returns translated URLs", async () => {
    mockGetCollection.mockResolvedValue([
      {
        id: "en-222",
        data: { slug: "about", language: "en" },
      },
      {
        id: "sv-222",
        data: { slug: "om-oss", language: "sv" },
      },
      {
        id: "da-222",
        data: { slug: "om-os", language: "da" },
      },
    ]);

    const result = await getLocalizedUrls(
      new URL("http://localhost/en/about/"),
    );
    expect(result).toEqual({
      en: "/en/about/",
      sv: "/om-oss/",
      da: "/da/om-os/",
    });
  });

  test("missing translation falls back to home for that locale", async () => {
    mockGetCollection.mockResolvedValue([
      {
        id: "en-333",
        data: { slug: "only-english", language: "en" },
      },
    ]);

    const result = await getLocalizedUrls(
      new URL("http://localhost/en/only-english/"),
    );
    expect(result).toEqual({
      en: "/en/only-english/",
      sv: "/",
      da: "/da/",
    });
  });

  test("current entry not found falls back to home for all", async () => {
    mockGetCollection.mockResolvedValue([]);

    const result = await getLocalizedUrls(
      new URL("http://localhost/en/courses/unknown/"),
    );
    expect(result).toEqual({ sv: "/", da: "/da/", en: "/en/" });
  });
});
