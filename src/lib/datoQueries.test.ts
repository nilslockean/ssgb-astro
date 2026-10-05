import { describe, expect, it } from "vitest";
import {
  COURSES_QUERY,
  GLOBAL_STRUCTURED_TEXT_FRAGMENT,
  HOME_PAGE_QUERY,
  TEAMS_QUERY,
  TRIPS_QUERY,
} from "./datoQueries";

describe("HOME_PAGE_QUERY", () => {
  it("fetches SEO metadata for the requested locale", () => {
    expect(HOME_PAGE_QUERY).toContain(
      "seo: _seoMetaTags(locale: $locale) { attributes content tag }",
    );
  });
});

describe("TEAMS_QUERY", () => {
  it("fetches localized job title and description records", () => {
    expect(TEAMS_QUERY).toContain("titles {");
    expect(TEAMS_QUERY).toContain("title(locale: $locale)");
    expect(TEAMS_QUERY).toContain("description(locale: $locale)");
    expect(TEAMS_QUERY).not.toContain("title(locale: $locale)\n      bio");
  });
});

describe("TRIPS_QUERY", () => {
  it("fetches the linked location title and slug", () => {
    expect(TRIPS_QUERY).toContain("location { title slug }");
  });
});

describe("global structured text queries", () => {
  it("queries current and legacy course content", () => {
    expect(COURSES_QUERY).toContain("... GlobalStructuredTextBlock");
    expect(COURSES_QUERY).toContain("legacyContent: content {");
  });

  it("queries responsive gallery images", () => {
    expect(GLOBAL_STRUCTURED_TEXT_FRAGMENT).toContain("... on GalleryRecord");
    expect(GLOBAL_STRUCTURED_TEXT_FRAGMENT).toContain("images {");
    expect(GLOBAL_STRUCTURED_TEXT_FRAGMENT).toContain("responsiveImage");
  });
});
