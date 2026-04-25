import { describe, it, expect } from "vitest";
import cl from "./cl.ts";

describe("cl classList utility", () => {
  it("should return arguments as string array", () => {
    expect(cl("a", "b", "c")).toMatchObject(["a", "b", "c"]);
  });

  it("should convert numbers to strings", () => {
    expect(cl(1)).toMatchObject(["1"]);
  });

  it("should filter out falsy values", () => {
    expect(cl(undefined, false, null, 0)).toMatchObject(["0"]);
  });

  it("should evaluate object values", () => {
    expect(cl({ foo: true, bar: false })).toMatchObject(["foo"]);
  });

  it("should evaluate object values and keep strings", () => {
    expect(cl("test", { foo: true, bar: false })).toMatchObject([
      "test",
      "foo",
    ]);
  });

  it("should flatten arrays", () => {
    expect(cl(["foo", "bar"])).toMatchObject(["foo", "bar"]);
  });

  it("should flatten nested arrays", () => {
    expect(cl(["a", ["b", "c"]])).toMatchObject(["a", "b", "c"]);
  });

  it("should flatten deeply nested arrays", () => {
    expect(cl([[[["foo"]]]])).toMatchObject(["foo"]);
  });

  it("should handle arrays with objects", () => {
    expect(cl(["foo", { bar: true }])).toMatchObject(["foo", "bar"]);
  });

  it("should handle multiple arrays", () => {
    expect(cl(["a"], ["b"], ["c"])).toMatchObject(["a", "b", "c"]);
  });

  it("should handle booleans (no class added)", () => {
    expect(cl(true, false)).toMatchObject([]);
  });

  it("should handle booleans in arrays", () => {
    expect(cl([true, false, "foo"])).toMatchObject(["foo"]);
  });

  it("should handle mixed types", () => {
    expect(cl("a", [1, { b: true }], false)).toMatchObject(["a", "1", "b"]);
  });
});
