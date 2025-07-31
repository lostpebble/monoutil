import { describe, expect, it } from "bun:test";
import { convertToNamingStyle } from "./convertToNamingStyle";
import { EVariableNamingStyle } from "./string_formatting.enums";

describe("convertToNamingStyle", () => {
  it("should convert camelCase to kebab-case", () => {
    expect(convertToNamingStyle("camelCase", EVariableNamingStyle.kebab_case)).toBe("camel-case");
  });

  it("should convert snake_case to camelCase", () => {
    expect(convertToNamingStyle("snake_case", EVariableNamingStyle.camel_case)).toBe("snakeCase");
  });

  it("should convert kebab-case to PascalCase", () => {
    expect(convertToNamingStyle("kebab-case", EVariableNamingStyle.pascal_case)).toBe("KebabCase");
  });

  it("should convert PascalCase to snake_case", () => {
    expect(convertToNamingStyle("PascalCase", EVariableNamingStyle.snake_case)).toBe("pascal_case");
  });

  it("should return the same text if already in the desired naming style", () => {
    expect(convertToNamingStyle("alreadyCamelCase", EVariableNamingStyle.camel_case)).toBe(
      "alreadyCamelCase",
    );
    expect(convertToNamingStyle("already_snake_case", EVariableNamingStyle.snake_case)).toBe(
      "already_snake_case",
    );
    expect(convertToNamingStyle("already-kebab-case", EVariableNamingStyle.kebab_case)).toBe(
      "already-kebab-case",
    );
    expect(convertToNamingStyle("AlreadyPascalCase", EVariableNamingStyle.pascal_case)).toBe(
      "AlreadyPascalCase",
    );
  });
});
