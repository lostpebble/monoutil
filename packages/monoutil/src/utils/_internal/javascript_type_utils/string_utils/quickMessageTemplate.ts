/**
 * If the "filePurpose" input is found, the bracket section (i.e. "[[" and "]]") that contains "{{filePurpose}}"
 * will have the same text as that part, but with "{{filePurpose}}" replaced with the input value of "filePurpose".
 */
const _exampleTemplateArea = `File [[required for "{{filePurpose}}"]] was not found at "{{filePath}}"`;

/**
 * If the "filePurpose" input is found, the first part inside any bracket sections (i.e. "[[" and "]]")
 * that contains "{{filePurpose}}" will have the same text as that part, but with "{{filePurpose}}" replaced
 * with the input value of "filePurpose".
 *
 * Otherwise, the second part inside the bracket sections (i.e. "[[" and "]]") will be used.
 */
const _exampleTemplateOption = `[0(File required for "{{filePurpose}}")|(Required file)0] was not found at "{{filePath}}"`;

/**
 * Same as above, except it will match the first option that includes all the inputs, or none of the inputs, or otherwise
 * an empty string.
 *
 * In this case, the final part has no inputs - so it will be the default option on no matches (no empty string).
 */
const _exampleTemplateMultipleOptions = `[0(File of type [1("{{fileType}}")|("unknown")1] required for "{{filePurpose}}")|(File required for "{{filePurpose}}")|(Required file)0] was not found at "{{filePath}}"`;

// type TTemplateInputs = Record<string, string | number | boolean>;
type TTemplateInputs = {
  [key: string]: string | number | boolean | undefined;
};

type TStringOrTemplateMarker<T extends TTemplateInputs> =
  | string
  | `{{${Extract<keyof T, string>}}}`;

type TPossibleTemplateStringPart<
  T extends TTemplateInputs,
  K extends TStringOrTemplateMarker<T>[] = TStringOrTemplateMarker<T>[],
> = `${K[number]}`;

/**
 * Processes template strings with conditional sections and variable substitution.
 *
 * Supports:
 * - Variable replacement: {{variableName}}
 * - Required sections: [[...{{variable}}...]]
 * - Optional sections: [[option1|option2|default]]
 * - Nested structures
 */
export function quickMessageTemplate<T extends TTemplateInputs = TTemplateInputs>(
  template: TPossibleTemplateStringPart<T>,
  inputs: T,
): string {
  // First process conditional sections, then handle variable substitutions
  return substituteVariables(processConditionals(template, inputs), inputs);
}

const conditionalRegex = new RegExp(/\[(?:(\d)|\[)\(?(.*?)\)?(\1|])]]?/g);

/**
 * Processes conditional sections in the template ([[...]]).
 * Handles both required sections and optional sections with fallbacks.
 */
function processConditionals(template: string, inputs: TTemplateInputs): string {
  // const conditionalRegex = new RegExp(/\[(?:(\d)|\[|\()\(?(.*?)\)?(\1|]|\))]/g);

  return template.replace(conditionalRegex, (_0, _1, content) => {
    // console.log(match);
    // console.log(content);
    // Handle required sections (no pipe character)
    let output: string;

    if (!content.includes(")|(")) {
      output = processRequiredSection(content, inputs);
    }

    // Handle optional sections with fallbacks
    output = processOptionalSection(content, inputs);

    if (conditionalRegex.test(output)) {
      // Recursively process nested conditionals
      output = processConditionals(output, inputs);
    }

    return output;
  });
}

/**
 * Processes a required section - the entire section must be renderable
 */
function processRequiredSection(content: string, inputs: TTemplateInputs): string {
  const rendered = substituteVariables(content, inputs);

  // Check if any variables weren't substituted
  if (rendered.match(/\{\{.*?}}/)) {
    throw new Error(`Missing required variables in section: ${content}`);
  }

  return rendered;
}

/**
 * Processes an optional section with fallback options
 */
function processOptionalSection(content: string, inputs: TTemplateInputs): string {
  const options = content.split(")|(").map((opt) => opt.trim());

  for (const option of options) {
    try {
      const rendered = substituteVariables(option, inputs);

      // Use the first option that either:
      // 1. Has no variables (default case)
      // 2. All variables are provided
      if (!rendered.match(/\{\{.*?}}/)) {
        return rendered;
      }
    } catch {
      // Don't break with error - skip options with missing variables
    }
  }

  // If no options matched and there's a default (last option with no variables)
  const lastOption = options[options.length - 1];
  if (!lastOption.match(/\{\{.*?}}/)) {
    return lastOption;
  }

  return ""; // No matching option and no default
}

/**
 * Substitutes variables in a string with their values from inputs
 */
function substituteVariables(str: string, inputs: TTemplateInputs): string {
  return str.replace(/\{\{(.*?)}}/g, (match, variableName) => {
    const value = inputs[variableName.trim()];

    if (value === undefined) {
      return match; // Leave unmatched variables as-is
    }

    return String(value);
  });
}
