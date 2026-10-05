import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, test } from "vitest";
import Pill from "./Pill.astro";

describe("Pill", () => {
  test("renders a non-linked label with a native tooltip", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Pill, {
      props: { label: "Guide", tooltip: "Leads the courses" },
    });

    expect(result).toContain("Guide");
    expect(result).toContain('title="Leads the courses"');
    expect(result).toContain("<span");
    expect(result).not.toContain("<a");
  });

  test("renders a linked pill with the requested icon", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Pill, {
      props: { label: "Mölle", href: "/locations/molle/", icon: "location" },
    });

    expect(result).toContain('href="/locations/molle/"');
    expect(result).toContain("pill--link");
    expect(result).toContain('viewBox="0 0 24 24"');
    expect(result).toContain("Mölle");
  });
});
