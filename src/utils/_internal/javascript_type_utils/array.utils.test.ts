import { describe, expect, test } from "bun:test";
import { array_utils } from "./array.utils";

describe("array_utils", () => {
  describe("isEqual", () => {
    test("isEqual should return true for equal arrays", () => {
      const array1 = [1, 2, 3];
      const array2 = [1, 2, 3];
      expect(array_utils.isEqual(array1, array2)).toBe(true);
    });

    test("isEqual should return false for different arrays", () => {
      const array1 = [1, 2, 3];
      const array2 = [1, 2, 4];
      expect(array_utils.isEqual(array1, array2)).toBe(false);
    });

    test("isEqual should return false for arrays of different lengths", () => {
      const array1 = [1, 2, 3];
      const array2 = [1, 2, 3, 4];
      expect(array_utils.isEqual(array1, array2)).toBe(false);
    });
  });

  describe("updateArrayItem", () => {
    test("updateArrayItem should add a new item if the matchItem function returns false", () => {
      const array = [1, 2, 3];
      const matchItem = (item: number) => item === 4;
      const updateOrAddNewItem = () => 4;
      array_utils.updateArrayItem(array, matchItem, updateOrAddNewItem);
      expect(array).toEqual([1, 2, 3, 4]);
    });

    test("updateArrayItem should update an existing item if the matchItem function returns true", () => {
      const array = [1, 2, 3];
      const matchItem = (item: number) => item === 2;
      const updateOrAddNewItem = (item: number | undefined) => item! * 2;
      array_utils.updateArrayItem(array, matchItem, updateOrAddNewItem);
      expect(array).toEqual([1, 4, 3]);
    });
  });
});
