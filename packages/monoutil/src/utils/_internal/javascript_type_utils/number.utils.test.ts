import { expect, test } from "bun:test";
import { number_utils } from "./number.utils";

test("NumberUtils.isNumber", () => {
  expect(number_utils.isNumber(null)).toBeFalsy();
  expect(number_utils.isNumber(Number.NaN)).toBeFalsy();
  expect(number_utils.isNumber(undefined)).toBeFalsy();

  expect(number_utils.isNumber(-1)).toBeTruthy();
  expect(number_utils.isNumber(0)).toBeTruthy();
  expect(number_utils.isNumber(0.1)).toBeTruthy();
  expect(number_utils.isNumber(1)).toBeTruthy();
  expect(number_utils.isNumber("0")).toBeTruthy();
  expect(number_utils.isNumber("")).toBeTruthy();
  expect(number_utils.isNumber(" ")).toBeTruthy();
});
