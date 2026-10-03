import { describe, expect, test } from "vitest";
import { calculateCoursePrice } from "./pricingUtils";

describe("calculateCoursePrice", () => {
  test("calculates per-person course cost and group total", () => {
    expect(calculateCoursePrice(2, 600, 2)).toEqual({
      perPersonDaily: 600,
      perPersonTotal: 1200,
      total: 2400,
    });
  });

  test("calculates a single participant course", () => {
    expect(calculateCoursePrice(1, 750, 1)).toEqual({
      perPersonDaily: 750,
      perPersonTotal: 750,
      total: 750,
    });
  });
});
