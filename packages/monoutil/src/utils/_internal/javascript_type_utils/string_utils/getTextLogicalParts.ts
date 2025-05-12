interface IGetTextLogicalPartsOptions {
  outputLowercase?: boolean;
  extraDividers?: string[];
  /**
   * Pascal or camel case dividers are ignored when true
   */
  ignoreCaseDividers?: boolean;
  removeNonTextCharacters?: boolean;
}

const splitWordsByCaseRegex = /([a-z])([A-Z])/g;
const removeNonWordRegex = /[^\w-]+/g;

// TODO: Add exclusion option for non-text character removal
//  e.g. ["!"] and we get "Hello World!" ->

export function getTextLogicalParts(
  text: string,
  {
    outputLowercase = false,
    ignoreCaseDividers,
    extraDividers = [],
    removeNonTextCharacters = false,
  }: IGetTextLogicalPartsOptions = {},
): string[] {
  const allNonTextDividers: Set<string> = new Set(["-", "_", " ", ...extraDividers]);

  const nonTextDividerRegex = new RegExp(`[${Array.from(allNonTextDividers).join("")}]`, "g");

  let parts = text.split(nonTextDividerRegex).filter((part) => part.length > 0);

  const textOnly = parts.join("");

  const hasUniformCase = textOnly === textOnly.toLowerCase() || textOnly === textOnly.toUpperCase();
  const ignoreCase = ignoreCaseDividers ?? hasUniformCase;

  if (!ignoreCase) {
    parts = parts.flatMap((part) =>
      part
        .replace(splitWordsByCaseRegex, "$1 $2")
        .split(/\s+/)
        .filter((part) => part.length > 0),
    );
  }

  if (removeNonTextCharacters) {
    parts = parts
      .map((part) => part.replace(removeNonWordRegex, ""))
      .filter((part) => part.length > 0);
  }

  return outputLowercase ? parts.map((part) => part.toLowerCase()) : parts;
}
