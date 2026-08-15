import { describe, expect, it } from "vitest";
import { HOME_PAGE_QUERY } from "./datoQueries";

describe("HOME_PAGE_QUERY", () => {
  it("fetches SEO metadata for the requested locale", () => {
    expect(HOME_PAGE_QUERY).toContain(
      "seo: _seoMetaTags(locale: $locale) { attributes content tag }",
    );
  });
});
