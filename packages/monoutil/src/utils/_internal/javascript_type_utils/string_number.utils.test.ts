import { describe, expect, test } from "bun:test";
import { string_number_utils } from "./string_number.utils";

describe("string_number.utils", () => {
  // This test is not needed. Floats can also be whole numbers. This would fail on a lot of valid inputs.
  describe("isDecimal", () => {
    test("should return true for decimal strings", () => {
      expect(string_number_utils.isDecimal("3.14")).toBe(true);
      expect(string_number_utils.isDecimal("-2.718")).toBe(true);
      expect(string_number_utils.isDecimal("0.123")).toBe(true);
    });

    test("should return false for non-decimal strings", () => {
      expect(string_number_utils.isDecimal("abc")).toBe(false);
      expect(string_number_utils.isDecimal("123")).toBe(false);
      expect(string_number_utils.isDecimal("3.14abc")).toBe(false);
      expect(string_number_utils.isDecimal("1,234")).toBe(false);
    });
  });

  describe("isPositiveNumberOnly", () => {
    test("should return true for integer strings", () => {
      expect(string_number_utils.isPositiveNumber("123")).toBe(true);
      expect(string_number_utils.isPositiveNumber("456.2222")).toBe(true);
      expect(string_number_utils.isPositiveNumber("0")).toBe(true);
    });

    test("should return false for non positive number or not number", () => {
      expect(string_number_utils.isPositiveNumber("-456")).toBe(false);
      expect(string_number_utils.isPositiveNumber("-0")).toBe(false);
      expect(string_number_utils.isPositiveNumber("-456.22")).toBe(false);
      expect(string_number_utils.isPositiveNumber("abc")).toBe(false);
      expect(string_number_utils.isPositiveNumber("123abc")).toBe(false);
      expect(string_number_utils.isPositiveNumber("1,234")).toBe(false);
    });
  });

  test("removeTrailingZeros", () => {
    expect(string_number_utils.removeTrailingZeros("")).toBe("");
    expect(string_number_utils.removeTrailingZeros("teststring")).toBe("teststring");
    expect(string_number_utils.removeTrailingZeros("0")).toBe("0");
    expect(string_number_utils.removeTrailingZeros("0.00")).toBe("0");
    expect(string_number_utils.removeTrailingZeros("1000.00")).toBe("1000");
    expect(string_number_utils.removeTrailingZeros("100.001")).toBe("100.001");
  });
});
