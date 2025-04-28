import { object_utils } from "../object.utils";

type TRecordTrueOrOther<T> = Record<string, boolean | T>;
type TSnipStructure = TRecordTrueOrOther<
  TRecordTrueOrOther<TRecordTrueOrOther<TRecordTrueOrOther<true>>>
>;

interface IIsolateMatchingStructuresOptions {
  /**
   * If true, will only isolate the paths that end with a structure match.
   * */
  onlyIsolatedPaths?: boolean;
}

interface IIsolateMatchingStructuresOptionsInner extends IIsolateMatchingStructuresOptions {
  isMatched?: boolean;
}

function _isolateMatchingStructures_next<T extends object | unknown>(
  obj: T,
  structure: TSnipStructure,
  options?: IIsolateMatchingStructuresOptionsInner,
): {
  foundMatch: boolean;
  matchedParts: Partial<T>;
} {
  let isMatched = options?.isMatched || false;
  const onlyIsolatedPaths = options?.onlyIsolatedPaths || false;

  if (!object_utils.isObject(obj)) {
    return { matchedParts: obj, foundMatch: false };
  }

  const result: Partial<T> = {};

  for (const key in obj) {
    if (!(key in structure)) {
      if (!isMatched) {
        const { foundMatch, matchedParts } = _isolateMatchingStructures_next(
          obj[key],
          structure,
          options,
        );
        if (!onlyIsolatedPaths || foundMatch) {
          result[key] = matchedParts;
          isMatched = true;
        }
      }

      continue;
    }

    if (structure[key] === true) {
      result[key] = obj[key];
      isMatched = true;
      continue;
    }

    if (object_utils.isObject(obj[key])) {
      const { foundMatch, matchedParts } = _isolateMatchingStructures_next(
        obj[key],
        structure[key] as TSnipStructure,
        {
          ...options,
          isMatched: true,
        },
      );
      result[key] = matchedParts;
      isMatched = foundMatch;
    } else {
      result[key] = obj[key];
    }
  }

  return { matchedParts: result, foundMatch: isMatched };
}

/**
 * Isolates and cuts out (includes only those parts) the matching structure anywhere inside the object.
 *
 * The more specific the structure, the less likely of isolation happening.
 * */
export function isolateMatchingStructures_next<T extends object | unknown>(
  obj: T,
  structure: TSnipStructure,
  options?: IIsolateMatchingStructuresOptions,
): Partial<T> {
  return _isolateMatchingStructures_next(obj, structure, options).matchedParts;
}
