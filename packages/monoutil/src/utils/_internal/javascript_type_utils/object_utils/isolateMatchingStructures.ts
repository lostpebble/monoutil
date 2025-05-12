import { DeepPartial } from "../../typescript.util_types";
import { object_utils } from "../object.utils";

type TRecordTrueOrOther<T> = Record<string, boolean | T>;
type TSnipStructure = TRecordTrueOrOther<
  TRecordTrueOrOther<TRecordTrueOrOther<TRecordTrueOrOther<true>>>
>;

interface IIsolateMatchingStructuresOptions {
  isMatched?: boolean;
}

function _isolateMatchingStructures<T extends object | unknown>(
  obj: T,
  structure: TSnipStructure,
  options?: IIsolateMatchingStructuresOptions,
): DeepPartial<T> | T {
  const isMatched = options?.isMatched || false;

  if (!object_utils.isObject(obj)) {
    return obj;
  }

  const result: DeepPartial<T> = {} as DeepPartial<T>;

  for (const key in obj) {
    if (!(key in structure)) {
      if (!isMatched) {
        result[key] = _isolateMatchingStructures(obj[key], structure);
      }

      continue;
    }

    if (object_utils.isObject(obj[key])) {
      result[key] = _isolateMatchingStructures(obj[key], structure[key] as TSnipStructure, {
        isMatched: true,
      });
    } else {
      result[key] = obj[key];
    }
  }

  return result;
}

/**
 * Isolates and cuts out (includes only those parts) the matching structure anywhere inside the object.
 *
 * The more specific the structure, the less likely of isolation happening.
 * */
export function isolateMatchingStructures<T extends object | unknown>(
  obj: T,
  structure: TSnipStructure,
): DeepPartial<T> | T {
  return _isolateMatchingStructures(obj, structure);
}
