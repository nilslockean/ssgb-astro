import { describe, expect, test } from "vitest";
import { MENU_TOGGLE_LABELS } from "./i18nUtils";

describe("menu toggle labels", () => {
  test.each([
    ["sv", "Öppna eller stäng huvudmenyn"],
    ["en", "Open or close the main menu"],
    ["da", "Åbn eller luk hovedmenuen"],
  ] as const)("provides a label for %s", (locale, label) => {
    expect(MENU_TOGGLE_LABELS[locale]).toBe(label);
  });
});
