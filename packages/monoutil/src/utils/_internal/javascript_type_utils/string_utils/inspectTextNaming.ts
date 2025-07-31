import { nullEmpty } from "./nullEmptyChecks";
import { EVariableNamingStyle } from "./string_formatting.enums";

interface IInspectTextNaming_Output_Positive {
  hasKnownStyle: true;
  styles: EVariableNamingStyle[];
  lowercaseParts: string[];
  originalParts: string[];
}

type TInspectTextNaming_Output = IInspectTextNaming_Output_Positive | { hasKnownStyle: false };

const splitWordsRegex = /(?=[A-Z])|[_-]+/g;
const pascalCaseWordRegex = /^[A-Z][a-z0-9]*$/;
const lowerCaseWordRegex = /^[a-z][a-z0-9]*$/;

/**
 * This function inspects the naming style of a given text. It returns the style, and the separate
 * parts of the text which the style created separation of.
 *
 * @param text the text to inspect
 */
export function inspectTextNaming(text: string): TInspectTextNaming_Output {
  if (nullEmpty(text)) {
    return { hasKnownStyle: false };
  }

  const parts = text.split(splitWordsRegex).filter((part) => part.trim().length > 0);

  if (parts.length === 0) {
    return { hasKnownStyle: false };
  }

  const splitter = text.match(splitWordsRegex)?.filter((part) => part.trim().length > 0)?.[0];

  const firstWord = parts[0]!;

  // If the first part is capitalized, then it's PascalCase
  if (pascalCaseWordRegex.test(firstWord)) {
    if (!parts.every((part) => pascalCaseWordRegex.test(part))) {
      return { hasKnownStyle: false };
    }

    const lowercaseParts = parts.map((part) => part.toLowerCase());
    return {
      hasKnownStyle: true,
      styles: [EVariableNamingStyle.pascal_case],
      lowercaseParts,
      originalParts: parts,
    };
  }

  // If the first part is lowercase, then it's potentially camelCase, kebab-case, or snake_case
  if (lowerCaseWordRegex.test(firstWord)) {
    const lowercaseParts = parts.map((part) => part.toLowerCase());

    if (parts.length === 1) {
      return {
        hasKnownStyle: true,
        styles: [
          EVariableNamingStyle.camel_case,
          EVariableNamingStyle.kebab_case,
          EVariableNamingStyle.snake_case,
        ],
        lowercaseParts,
        originalParts: parts,
      };
    }

    const otherParts = parts.slice(1);

    if (otherParts.every((part) => part === part.toLowerCase())) {
      if (splitter != null) {
        if (splitter === "_") {
          return {
            hasKnownStyle: true,
            styles: [EVariableNamingStyle.snake_case],
            lowercaseParts,
            originalParts: parts,
          };
        }

        if (splitter === "-") {
          return {
            hasKnownStyle: true,
            styles: [EVariableNamingStyle.kebab_case],
            lowercaseParts,
            originalParts: parts,
          };
        }
      } else {
        return {
          hasKnownStyle: false,
        };
      }
    }

    if (!otherParts.every((part) => pascalCaseWordRegex.test(part))) {
      return { hasKnownStyle: false };
    }

    return {
      hasKnownStyle: true,
      styles: [EVariableNamingStyle.camel_case],
      lowercaseParts,
      originalParts: parts,
    };
  }

  return {
    hasKnownStyle: false,
  };
}
