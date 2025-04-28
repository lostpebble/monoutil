import { convertToNamingStyle } from "./string_utils/convertToNamingStyle";
import { getTextLogicalParts } from "./string_utils/getTextLogicalParts";
import { inspectTextNaming } from "./string_utils/inspectTextNaming";
import { shortenMiddleOut } from "./string_utils/shortenMiddleOut";

export const notNullEmpty = (str: string | null | undefined): str is string => {
  return str != null && str.length > 0;
};

export const nullEmpty = (str: string | null | undefined): str is null | undefined | "" => {
  return !notNullEmpty(str);
};

function isString(val: unknown): val is string {
  return typeof val === "string";
}

function capitalizeFirstLetter(str: string): string {
  if (str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const string_utils = {
  nullEmpty,
  notNullEmpty,
  isString,
  convertToNamingStyle,
  inspectTextNaming,
  getTextLogicalParts,
  shortenMiddleOut,
  capitalizeFirstLetter,
};
