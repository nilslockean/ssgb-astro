import { describe, test, expect } from "vitest";
import { formatPrice, formatPhone } from "./stringUtils";

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

describe("formatPhone", () => {
  test("formats Swedish mobile international", () => {
    expect(formatPhone("+46736665997", false)).toBe("+46 73-666 59 97");
  });

  test("formats Swedish mobile domestic", () => {
    expect(formatPhone("+46736665997", true)).toBe("073-666 59 97");
  });

  test("formats standard national landline number", () => {
    expect(formatPhone("+4640123456", true)).toBe("040-12 34 56");
  });

  test("formats standard national landline number international", () => {
    expect(formatPhone("+4640123456", false)).toBe("+46 40-12 34 56");
  });

  test("throws on invalid E.164 format", () => {
    expect(() => formatPhone("12345", true)).toThrow("Invalid E.164 format");
  });
});
