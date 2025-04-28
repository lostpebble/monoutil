function isEnumMember<T extends { [key: string]: string }>(
  enumObj: T,
  value: string,
): value is T[keyof T] {
  return Object.values(enumObj).includes(value);
}

function getEnumEntries<T extends { [key: string]: string | number }>(
  enumObj: T,
): [keyof T, T[keyof T]][] {
  return Object.entries(enumObj) as [keyof T, T[keyof T]][];
}

export const enum_utils = {
  isEnumMember,
  getEnumEntries,
};
