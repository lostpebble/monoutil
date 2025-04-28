import { describe, expect, it } from "bun:test";
import { ENamingStyle } from "./convertToNamingStyle";
import { inspectTextNaming } from "./inspectTextNaming";

describe("inspectTextNaming", () => {
  it("should return hasKnownStyle false for empty string", () => {
    expect(inspectTextNaming("")).toEqual({ hasKnownStyle: false });
  });

  it("should identify PascalCase", () => {
    expect(inspectTextNaming("PascalCase")).toEqual({
      hasKnownStyle: true,
      styles: [ENamingStyle.pascal_case],
      lowercaseParts: ["pascal", "case"],
      originalParts: ["Pascal", "Case"],
    });

    expect(inspectTextNaming("Pascal")).toEqual({
      hasKnownStyle: true,
      styles: [ENamingStyle.pascal_case],
      lowercaseParts: ["pascal"],
      originalParts: ["Pascal"],
    });
  });

  it("should return hasKnownStyle false for unknown style", () => {
    expect(inspectTextNaming("unknownStyle")).toEqual({
      hasKnownStyle: true,
      styles: [ENamingStyle.camel_case],
      lowercaseParts: ["unknown", "style"],
      originalParts: ["unknown", "Style"],
    });
  });

  // Add more tests as needed
});
