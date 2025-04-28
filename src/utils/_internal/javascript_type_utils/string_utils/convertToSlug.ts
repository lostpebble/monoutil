import { getTextLogicalParts } from "./getTextLogicalParts";

interface IConvertToSlugOptions {
  slugDivider?: string;
  normalize?: boolean;
  letterCase?: "UPPER" | "LOWER" | "UNAFFECTED";
  excludeCharacters?: string[];
}

const regexAllSpaces = /\s+/g;
const regexDoubleDashes = /--+/g;
const regexFirstDash = /^-+/g;
const regexLastDash = /-+$/g;
const regexSingleDash = /-/g;
const regexRemoveNonWord = /[^\w-]+/g;
const regexAllUnderscores = /_/g;

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const convertToSlug = (
  text: string,
  {
    slugDivider = "-",
    letterCase = "LOWER",
    normalize = true,
    excludeCharacters = [],
  }: IConvertToSlugOptions = {},
): string => {
  if (!text || text.length === 0) {
    return "";
  }

  let resp = text.toString();

  if (normalize) {
    resp = resp.normalize("NFD");
  }

  resp = getTextLogicalParts(resp, {
    extraDividers: ["+"],
    ignoreCaseDividers: true,
    outputLowercase: true,
  }).join(" ");

  if (letterCase === "LOWER") {
    resp = resp.toLowerCase();
  } else if (letterCase === "UPPER") {
    resp = resp.toUpperCase();
  }

  return resp
    .replace(regexAllSpaces, "-") // Replace spaces with -
    .replace(
      excludeCharacters.length > 0
        ? new RegExp(`[^\\w\\-${excludeCharacters.map((c) => escapeRegExp(c)).join("")}]+`, "g")
        : regexRemoveNonWord,
      "",
    ) // Remove all non-word chars
    .replace(excludeCharacters.includes("_") ? regexAllSpaces : regexAllUnderscores, "-") // replace underscores with dashes
    .replace(regexDoubleDashes, "-") // Replace multiple - with single -
    .replace(regexFirstDash, "") // Trim - from start of text
    .replace(regexLastDash, "") // Trim - from end of text
    .replace(regexSingleDash, slugDivider); // Replace all - with whatever the slug divider is
};
