import { describe, expect, it } from "bun:test";
import { object_utils } from "./object.utils";

describe("ObjectUtils.isEmptyObject", () => {
  it("returns true for an empty object", () => {
    const emptyObject = {};
    expect(object_utils.isEmptyObject(emptyObject)).toBe(true);
  });

  it("returns false for a non-empty object", () => {
    const nonEmptyObject = { key: "value" };
    expect(object_utils.isEmptyObject(nonEmptyObject)).toBe(false);
  });
});
