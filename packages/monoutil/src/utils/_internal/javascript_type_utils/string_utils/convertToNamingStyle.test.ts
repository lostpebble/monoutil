import { describe, expect, it } from "bun:test";
import { convertToNamingStyle, ENamingStyle } from "./convertToNamingStyle";

describe("convertToNamingStyle", () => {
  it("should convert camelCase to kebab-case", () => {
    expect(convertToNamingStyle("camelCase", ENamingStyle.kebab_case)).toBe("camel-case");
  });

  it("should convert snake_case to camelCase", () => {
    expect(convertToNamingStyle("snake_case", ENamingStyle.camel_case)).toBe("snakeCase");
  });

  it("should convert kebab-case to PascalCase", () => {
    expect(convertToNamingStyle("kebab-case", ENamingStyle.pascal_case)).toBe("KebabCase");
  });

  it("should convert PascalCase to snake_case", () => {
    expect(convertToNamingStyle("PascalCase", ENamingStyle.snake_case)).toBe("pascal_case");
  });

  it("should return the same text if already in the desired naming style", () => {
    expect(convertToNamingStyle("alreadyCamelCase", ENamingStyle.camel_case)).toBe(
      "alreadyCamelCase",
    );
    expect(convertToNamingStyle("already_snake_case", ENamingStyle.snake_case)).toBe(
      "already_snake_case",
    );
    expect(convertToNamingStyle("already-kebab-case", ENamingStyle.kebab_case)).toBe(
      "already-kebab-case",
    );
    expect(convertToNamingStyle("AlreadyPascalCase", ENamingStyle.pascal_case)).toBe(
      "AlreadyPascalCase",
    );
  });
});
