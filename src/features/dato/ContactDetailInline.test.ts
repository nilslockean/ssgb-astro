import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, test, vi } from "vitest";
import ContactDetailInline from "./ContactDetailInline.astro";

vi.mock("@lib/contentUtils", () => ({
  getLocalizedConfig: vi.fn().mockResolvedValue({
    contact: {
      phone: "+46736665997",
      email: "info@ssgb.se",
    },
  }),
}));

describe("ContactDetailInline", async () => {
  test("renders phone as formatted tel link", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ContactDetailInline, {
      props: { block: { value: "phone" } },
    });

    expect(result).toContain('href="tel:+46736665997"');
    expect(result).toContain("073-666 59 97");
  });

  test("renders email as mailto link", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ContactDetailInline, {
      props: { block: { value: "email" } },
    });

    expect(result).toContain('href="mailto:info@ssgb.se"');
    expect(result).toContain("info@ssgb.se");
  });
});
