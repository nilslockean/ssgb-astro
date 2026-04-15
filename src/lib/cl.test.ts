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
    expect(cl({ "foo": true, "bar": false })).toMatchObject(["foo"]);
  })
});
