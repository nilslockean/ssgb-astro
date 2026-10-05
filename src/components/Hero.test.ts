import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, test } from "vitest";
import Hero from "./Hero.astro";

describe("Hero without media", () => {
  test("renders its metadata and call to action without an image frame", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Hero, {
      props: {
        title: "Course title",
        content: "Intro copy",
        buttons: [{ label: "Book course", href: "#booking" }],
      },
      slots: { metadata: "<ul><li>2 days</li></ul>" },
    });

    expect(result).toContain("Course title");
    expect(result).toContain("Intro copy");
    expect(result).toContain("2 days");
    expect(result).toContain('href="#booking"');
    expect(result).not.toContain("hero__img-wrapper");
  });
});
