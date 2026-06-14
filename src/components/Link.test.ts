import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, test } from "vitest";
import Link from "./Link.astro";
import { getPath, Slug } from "@lib/routeUtils";

describe("Link component", async () => {
  test("renders default props", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Link, {
      slots: {
        default: "Link content",
      },
      props: {
        href: "test",
      },
    });

    // expect(result).toContain("This is a card");
    expect(result).toContain("Link content");
    expect(result).toContain('href="test"');
  });

  test("prefers slug over href", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Link, {
      props: {
        href: "test",
        slug: Slug.ABOUT,
      },
    });
    const basePath = getPath(Slug.ABOUT);

    expect(result).not.toContain('href="test"');
    expect(result).toMatch(new RegExp(`href="${basePath}\\/?"`));
  });
});
