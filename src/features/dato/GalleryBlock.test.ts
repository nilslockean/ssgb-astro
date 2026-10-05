import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import GalleryBlock from "./GalleryBlock.astro";

describe("GalleryBlock", () => {
  it("renders an accessible image grid with Fancybox gallery links", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(GalleryBlock, {
      props: {
        block: {
          id: "gallery-record-id",
          images: [
            {
              url: "https://www.datocms-assets.com/123/test.jpg",
              alt: "Climber on a wall",
              responsiveImage: {
                src: "https://www.datocms-assets.com/123/test.jpg",
                width: 1200,
                height: 800,
                alt: "Climber on a wall",
                base64: null,
              },
            },
          ],
        },
      },
    });

    expect(result).toContain('data-fancybox="gallery-gallery-record-id"');
    expect(result).toContain('alt="Climber on a wall"');
    expect(result).toContain('class="gallery-grid"');
  });
});
