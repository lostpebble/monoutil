function isPositiveNumber(value: string): boolean {
  const numberRegex = /^(?:0|[1-9]\d*)(?:\.\d+)?$/;
  return numberRegex.test(value);
}

function isDecimal(value: string): boolean {
  const decimalRegex = /^-?\d+?\.\d+?$/;
  return decimalRegex.test(value);
}

function removeTrailingZeros(amount: string): string {
  if (amount === "0") {
    return "0";
  }
  return amount.replace(/\.?0*$/, "");
}

export const string_number_utils = {
  isPositiveNumber,
  isDecimal,
  removeTrailingZeros,
};
