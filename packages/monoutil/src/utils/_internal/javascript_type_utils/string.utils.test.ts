import { describe, expect, it, test } from "bun:test";
import { string_utils } from "./string.utils";
describe("string.utils", () => {
  describe("string_utils.notNullEmpty()", () => {
    test("returns true for non-empty strings", () => {
      expect(string_utils.notNullEmpty("hello")).toBe(true);
    });

    test("returns false for null, undefined, and empty strings", () => {
      expect(string_utils.notNullEmpty(null)).toBe(false);
      expect(string_utils.notNullEmpty(undefined)).toBe(false);
      expect(string_utils.notNullEmpty("")).toBe(false);
    });
  });

  describe("string_utils.nullEmpty()", () => {
    it("should return true for null or undefined", () => {
      expect(string_utils.nullEmpty(null)).toBe(true);
      expect(string_utils.nullEmpty(undefined)).toBe(true);
    });

    it("should return true for empty string", () => {
      expect(string_utils.nullEmpty("")).toBe(true);
    });

    it("should return false for non-empty strings", () => {
      expect(string_utils.nullEmpty("Hello")).toBe(false);
      expect(string_utils.nullEmpty(" ")).toBe(false);
      expect(string_utils.nullEmpty("null")).toBe(false);
      expect(string_utils.nullEmpty("undefined")).toBe(false);
    });
  });

  describe("StringUtils.isString function", () => {
    test("returns true for string values", () => {
      expect(string_utils.isString("hello")).toBe(true);
    });

    test("returns false for non-string values", () => {
      expect(string_utils.isString(42)).toBe(false);
      expect(string_utils.isString(null)).toBe(false);
      expect(string_utils.isString(undefined)).toBe(false);
    });
  });
});
