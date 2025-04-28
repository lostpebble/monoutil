function isNumber(val: unknown): val is number {
  return val != null && !Number.isNaN(val as number);
}

export const number_utils = {
  isNumber,
};
