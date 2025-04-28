import { isolateMatchingStructures } from "./object_utils/isolateMatchingStructures";

function isEmptyObject(obj: object): obj is Record<string, never> {
  return (
    Object.keys(obj).length === 0 &&
    Object.getOwnPropertySymbols(obj).length === 0 &&
    obj.constructor === Object
  );
}

function isObject(obj: unknown): obj is Record<PropertyKey, unknown> {
  return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}

export const object_utils = {
  isEmptyObject,
  isObject,
  isolateMatchingStructures,
};
