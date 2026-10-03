import { describe, expect, it } from "vitest";
import { HOME_PAGE_QUERY, TEAMS_QUERY } from "./datoQueries";

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
