import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, test } from "vitest";
import Link from "./Link.astro";

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
});
