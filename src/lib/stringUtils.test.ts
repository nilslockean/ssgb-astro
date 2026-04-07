import { describe, test, expect } from "vitest";
import { formatPrice } from "./stringUtils";

describe("formatPrice", () => {
  test("formats single price", () => {
    expect(formatPrice([1])).toBe("1 kr");
    expect(formatPrice([1234])).toBe("1 234 kr");
  });

  test("rounds price to nearest krona", () => {
    expect(formatPrice([12.5])).toBe("13 kr");
    expect(formatPrice([12.1])).toBe("12 kr");
  });

  test("formats price range", () => {
    expect(formatPrice([379, 580])).toBe("Från 379 kr");
  });

  test("formats unordered price range", () => {
    expect(formatPrice([2000, 1200, 104580])).toBe("Från 1 200 kr");
  });
});
