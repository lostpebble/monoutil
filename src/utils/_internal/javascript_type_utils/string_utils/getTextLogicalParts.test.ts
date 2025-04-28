import { describe, expect, it } from "bun:test";
import { getTextLogicalParts } from "./getTextLogicalParts";

describe("getTextLogicalParts", () => {
  it("should split camelCase text into logical parts", () => {
    const result = getTextLogicalParts("camelCaseText");
    expect(result).toEqual(["camel", "Case", "Text"]);
  });

  it("should split snake_case text into logical parts", () => {
    const result = getTextLogicalParts("snake_case_text");
    expect(result).toEqual(["snake", "case", "text"]);
  });

  it("should split kebab-case text into logical parts", () => {
    const result = getTextLogicalParts("kebab-case-text");
    expect(result).toEqual(["kebab", "case", "text"]);
  });

  it("should split PascalCase text into logical parts", () => {
    const result = getTextLogicalParts("PascalCaseText");
    expect(result).toEqual(["Pascal", "Case", "Text"]);
  });

  it("should split text with spaces into logical parts", () => {
    const result = getTextLogicalParts("text with spaces");
    expect(result).toEqual(["text", "with", "spaces"]);
  });

  it("should return lowercase parts when lowerCase option is true", () => {
    const result = getTextLogicalParts("camelCaseText", { outputLowercase: true });
    expect(result).toEqual(["camel", "case", "text"]);
  });

  it("should handle mixed delimiters correctly", () => {
    const result = getTextLogicalParts("mixed_delimiters-Text");
    expect(result).toEqual(["mixed", "delimiters", "Text"]);
  });

  it("should handle upper case delimited text correctly", () => {
    const result = getTextLogicalParts("SHOUTING_SNAKE_TEXT");
    expect(result).toEqual(["SHOUTING", "SNAKE", "TEXT"]);
  });

  it("should handle upper case delimited text correctly, and split by case if we choose", () => {
    const result = getTextLogicalParts("SHOUTING_SNAKE_TEXT", {
      ignoreCaseDividers: false,
    });
    expect(result).toEqual(["SHOUTING", "SNAKE", "TEXT"]);
  });

  it("should handle specified delimiters", () => {
    const result = getTextLogicalParts("shouting+snake+text", {
      extraDividers: ["+"],
    });
    expect(result).toEqual(["shouting", "snake", "text"]);
  });

  it("should handle specified delimiters with Case delimiters", () => {
    const result = getTextLogicalParts("MyGod+that's+crazy", {
      extraDividers: ["+"],
    });
    expect(result).toEqual(["My", "God", "that's", "crazy"]);
  });

  it("should handle specified delimiters with Case delimiters, and remove non-word characters", () => {
    const result = getTextLogicalParts("MyGod+that's+crazy", {
      extraDividers: ["+"],
      removeNonTextCharacters: true,
    });
    expect(result).toEqual(["My", "God", "thats", "crazy"]);

    const resultLowercase = getTextLogicalParts("MyGod+that's+crazy", {
      extraDividers: ["+"],
      removeNonTextCharacters: true,
      outputLowercase: true,
    });
    expect(resultLowercase).toEqual(["my", "god", "thats", "crazy"]);
  });

  it("should handle specified delimiters and ignore case", () => {
    const result = getTextLogicalParts("SHOUTing+snake+text", {
      extraDividers: ["+"],
      ignoreCaseDividers: true,
    });
    expect(result).toEqual(["SHOUTing", "snake", "text"]);
  });

  it("should handle specified delimiters with lower case response", () => {
    const result = getTextLogicalParts("SHOUTing+snake+text", {
      extraDividers: ["+"],
      outputLowercase: true,
    });
    expect(result).toEqual(["shouting", "snake", "text"]);
  });
});
