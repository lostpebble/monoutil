import { describe, expect, it, test } from "bun:test";
import { quickMessageTemplate } from "./quickMessageTemplate";

/**
 * If the "filePurpose" input is found, the bracket section (i.e. "[(" and ")]") that contains "{{filePurpose}}"
 * will have the same text as that part, but with "{{filePurpose}}" replaced with the input value of "filePurpose".
 */
const _exampleTemplateArea = `File [[required for "{{filePurpose}}"]] was not found at "{{filePath}}"`;

/**
 * If the "filePurpose" input is found, the first part inside any bracket sections (i.e. "[(" and ")]")
 * that contains "{{filePurpose}}" will have the same text as that part, but with "{{filePurpose}}" replaced
 * with the input value of "filePurpose".
 *
 * Otherwise, the second part inside the bracket sections (i.e. "[(" and ")]") will be used.
 */
const _exampleTemplateOption = `[[(File required for "{{filePurpose}}")|(Required file)]] was not found at "{{filePath}}"`;

/**
 * Same as above, except it will match the first option that includes all the inputs, or none of the inputs, or otherwise
 * an empty string.
 *
 * In this case, the final part has no inputs - so it will be the default option on no matches (no empty string).
 */
const _exampleTemplateMultipleOptions = `[[(File of type {{fileType}} required for "{{filePurpose}}")|(File required for "{{filePurpose}}")|(Required file)]] was not found at "{{filePath}}"`;

describe("quickMessageTemplate", () => {
  it("should return the same string without any template variables", () => {
    const result = quickMessageTemplate("this is a test", {});
    expect(result).toEqual("this is a test");
  });

  describe("Basic Variable Substitution", () => {
    test("should replace simple variables", () => {
      const result = quickMessageTemplate("Hello {{name}}!", { name: "World" });
      expect(result).toBe("Hello World!");
    });

    test("should handle multiple variables", () => {
      const result = quickMessageTemplate("{{greeting}} {{name}}!", {
        greeting: "Hello",
        name: "World",
      });
      expect(result).toBe("Hello World!");
    });

    test("should leave unmatched variables as-is", () => {
      const result = quickMessageTemplate("Hello {{name}} from {{location}}!", {
        name: "Alice",
      });
      expect(result).toBe("Hello Alice from {{location}}!");
    });

    test("should handle number and boolean inputs", () => {
      const result = quickMessageTemplate("Value: {{num}}, Flag: {{flag}}", {
        num: 42,
        flag: true,
      });
      expect(result).toBe("Value: 42, Flag: true");
    });
  });

  describe("Required Sections ([(...)])", () => {
    test("should process required sections when variables exist", () => {
      const template = 'File [[required for "{{filePurpose}}"]] was not found';
      const result = quickMessageTemplate(template, { filePurpose: "config" });
      expect(result).toBe('File required for "config" was not found');
    });

    test("should throw error when required section has missing variables", () => {
      const template = 'File [[required for "{{filePurpose}}"]] was not found';
      expect(() => quickMessageTemplate(template, {})).toThrow(
        "Missing required variables in section",
      );
    });

    test("should handle multiple required sections", () => {
      const template = "[[{{a}}]] and [[{{b}}]]";
      const result = quickMessageTemplate(template, { a: "foo", b: "bar" });
      expect(result).toBe("foo and bar");
    });
  });

  describe("Optional Sections ([(...|...)])", () => {
    test("should use first option when variables exist", () => {
      const template = "[[(File {{type}})|(Default file)]]";
      const result = quickMessageTemplate(template, { type: "config" });
      expect(result).toBe("File config");
    });

    test("should fall back to second option when first has missing vars", () => {
      const template = "[[(File {{type}})|(Default file)]]";
      const result = quickMessageTemplate(template, {});
      expect(result).toBe("Default file");
    });

    test("should use last option as default when no vars match", () => {
      const template = "[[(A {{x}})|(B {{y}})|(Default)]]";
      const result = quickMessageTemplate(template, {});
      expect(result).toBe("Default");
    });

    test("should return empty string if no default and no matches", () => {
      const template = "[[(A {{x}})|(B {{y}})]]";
      const result = quickMessageTemplate(template, {});
      expect(result).toBe("");
    });
  });

  describe("Multiple Options ([(...|...|...)])", () => {
    test("should use first matching option", () => {
      const template = "[[(File of type {{type}})|(File {{name}})|(Default file)]] was found";
      const result = quickMessageTemplate(template, { name: "config" });
      expect(result).toBe("File config was found");
    });

    test("should prefer earlier matches", () => {
      const template = "[[({{a}} {{b}})|({{a}})|({{b}})|(Default)]]";
      const result = quickMessageTemplate(template, { a: "foo", b: "bar" });
      expect(result).toBe("foo bar");
    });

    test("should use default when no variables match", () => {
      const template =
        "[[(File of type {{type}} for {{purpose}})|(File {{type}})|({{purpose}} file)|(Default)]]";
      const result = quickMessageTemplate(template, {});
      expect(result).toBe("Default");
    });
  });

  describe("Complex Examples", () => {
    test("should handle your exampleTemplateArea", () => {
      const template = 'File [[required for "{{filePurpose}}"]] was not found at "{{filePath}}"';
      const result = quickMessageTemplate(template, {
        filePurpose: "configuration",
        filePath: "/etc/app.conf",
      });
      expect(result).toBe('File required for "configuration" was not found at "/etc/app.conf"');
    });

    test("should handle your exampleTemplateOption", () => {
      const template =
        '[[(File required for "{{filePurpose}}")|(Required file)]] was not found at "{{filePath}}"';
      const result1 = quickMessageTemplate(template, {
        filePurpose: "config",
        filePath: "/path",
      });
      expect(result1).toBe('File required for "config" was not found at "/path"');

      const result2 = quickMessageTemplate(template, { filePath: "/path" });
      expect(result2).toBe('Required file was not found at "/path"');
    });

    test("should handle your exampleTemplateMultipleOptions", () => {
      const template =
        '[[(File of type {{fileType}} required for "{{filePurpose}}")|(File required for "{{filePurpose}}")|(Required file)]] was not found at "{{filePath}}"';

      const result1 = quickMessageTemplate(template, {
        fileType: "JSON",
        filePurpose: "config",
        filePath: "/path",
      });
      expect(result1).toBe('File of type JSON required for "config" was not found at "/path"');

      const result2 = quickMessageTemplate(template, {
        filePurpose: "config",
        filePath: "/path",
      });
      expect(result2).toBe('File required for "config" was not found at "/path"');

      const result3 = quickMessageTemplate(template, { filePath: "/path" });
      expect(result3).toBe('Required file was not found at "/path"');
    });

    test("should handle nested conditionals", () => {
      const template = "[0(Outer [1inner {{var}}1])|(Default)0]";
      const result1 = quickMessageTemplate(template, { var: "value" });
      expect(result1).toBe("Outer inner value");

      const result2 = quickMessageTemplate(template, {});
      expect(result2).toBe("Default");
    });
  });

  describe("Edge Cases", () => {
    test("should handle empty template", () => {
      expect(quickMessageTemplate("", {})).toBe("");
    });

    test("should handle template with no variables", () => {
      expect(quickMessageTemplate("Static content", {})).toBe("Static content");
    });

    test("should handle template with only variables", () => {
      const result = quickMessageTemplate("{{a}}{{b}}", { a: "foo", b: "bar" });
      expect(result).toBe("foobar");
    });

    test("should handle malformed brackets", () => {
      const template = "Text [( with [ unmatched brackets ]";
      expect(quickMessageTemplate(template, {})).toBe(template);
    });

    test("should handle empty sections", () => {
      expect(quickMessageTemplate("[[]]", {})).toBe("");
      expect(quickMessageTemplate("[[|]]", {})).toBe("|");
      expect(quickMessageTemplate("[[||]]", {})).toBe("||");
    });
  });
});
