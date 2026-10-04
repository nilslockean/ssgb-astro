import { describe, expect, test } from "vitest";
import { getCoursePriceRange } from "./pricingUtils";

describe("getCoursePriceRange", () => {
  test("returns the lowest and highest total per-person prices", () => {
    expect(getCoursePriceRange([600, 400, 500], 2)).toEqual([800, 1200]);
  });

  test("returns a single value when all participant tiers cost the same", () => {
    expect(getCoursePriceRange([400, 400, 400], 2)).toEqual([800, 800]);
  });
});
