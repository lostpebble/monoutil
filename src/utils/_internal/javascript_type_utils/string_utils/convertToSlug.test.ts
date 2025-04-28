import { describe, expect, it } from "bun:test";
import { convertToSlug } from "./convertToSlug";

describe("convertToSlug", () => {
  it("should convert a string to a slug", () => {
    expect(convertToSlug("Hello World")).toBe("hello-world");
  });

  it("should handle multiple spaces", () => {
    expect(convertToSlug("Hello   World")).toBe("hello-world");
  });

  it("should handle special characters", () => {
    expect(convertToSlug("Hello, World!")).toBe("hello-world");
  });

  it("should handle mixed case", () => {
    expect(convertToSlug("HeLLo WoRLd")).toBe("hello-world");
  });

  it("should handle empty strings", () => {
    expect(convertToSlug("")).toBe("");
  });

  it("should handle strings with only special characters", () => {
    expect(convertToSlug("!@#$%^&*()")).toBe("");
  });

  it("should handle strings with only spaces", () => {
    expect(convertToSlug("   ")).toBe("");
  });

  it("should handle strings with only special characters and spaces", () => {
    expect(convertToSlug("!@#$%^&*()   ")).toBe("");
  });

  it('should be be able to create a slug out text with an "_" divider', () => {
    expect(convertToSlug("HeLLo_WoRLd")).toBe("hello-world");
  });

  it('should be be able to create a slug out text with an "-" divider', () => {
    expect(convertToSlug("HeLLo-WoRLd")).toBe("hello-world");
  });

  it('should be be able to create a slug out text with an "+" divider', () => {
    expect(convertToSlug("HeLLo+WoRLd")).toBe("hello-world");
  });
});
