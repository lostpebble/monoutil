import { describe, expect, it } from "bun:test";
import { isolateMatchingStructures } from "./isolateMatchingStructures";

describe("isolateMatchingStructures()", () => {
  it("empty object still empty when snip structure is blank", () => {
    const emptyObject = {};
    expect(isolateMatchingStructures(emptyObject, {})).toEqual({});
  });

  it("regular object same when snip structure is blank", () => {
    const nonEmptyObject = { key: "value" };
    expect(isolateMatchingStructures(nonEmptyObject, {})).toEqual({ ...nonEmptyObject });
  });

  it("snips matching structure from object", () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: 3,
      },
      e: 4,
    };

    const structure = {
      b: {
        c: true,
      },
    };

    const expected = {
      a: 1,
      b: {
        c: 2,
      },
      e: 4,
    };

    expect(isolateMatchingStructures(obj, structure)).toEqual(expected);
  });

  it("handles nested structures correctly", () => {
    const obj = {
      a: {
        b: {
          c: 1,
          d: 2,
        },
        e: 3,
      },
      other: {
        a: {
          b: {
            c: 1,
            d: 2,
          },
          e: 3,
        },
      },
      f: 4,
    };

    const structure = {
      a: {
        b: {
          c: true,
        },
      },
    } as const;

    const expected = {
      a: {
        b: {
          c: 1,
        },
      },
      other: {
        a: {
          b: {
            c: 1,
          },
        },
      },
      f: 4,
    } as const;

    expect(isolateMatchingStructures(obj, structure)).toEqual(expected);
  });

  it("returns original object when no matching structure", () => {
    const obj = {
      a: 1,
      b: 2,
    };

    const structure = {
      c: true,
    };

    expect(isolateMatchingStructures(obj, structure)).toEqual(obj);
  });

  it("handles arrays within objects", () => {
    const obj = {
      a: [1, 2, 3],
      b: {
        c: 4,
        d: [5, 6],
      },
    };

    const structure = {
      b: {
        d: true,
      },
    };

    const expected = {
      a: [1, 2, 3],
      b: {
        d: [5, 6],
      },
    };

    expect(isolateMatchingStructures(obj, structure)).toEqual(expected);
  });

  it("handles complex nested structures", () => {
    const obj = {
      a: {
        b: {
          c: {
            d: 1,
            e: 2,
          },
        },
      },
      f: 3,
    };

    const structure = {
      a: {
        b: {
          c: {
            d: true,
          },
        },
      },
    };

    const expected = {
      a: {
        b: {
          c: {
            d: 1,
          },
        },
      },
      f: 3,
    };

    expect(isolateMatchingStructures(obj, structure)).toEqual(expected);
  });
});
