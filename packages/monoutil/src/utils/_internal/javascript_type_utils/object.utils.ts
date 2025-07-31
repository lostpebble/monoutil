import { isObject } from "./object_utils/isObject";
import { isolateMatchingStructures } from "./object_utils/isolateMatchingStructures";

function isEmptyObject(obj: object): obj is Record<string, never> {
  return (
    Object.keys(obj).length === 0 &&
    Object.getOwnPropertySymbols(obj).length === 0 &&
    obj.constructor === Object
  );
}

export const object_utils = {
  isEmptyObject,
  isObject,
  isolateMatchingStructures,
};
