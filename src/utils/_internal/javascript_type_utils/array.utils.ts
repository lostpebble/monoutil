/**
 * Created by Paul on 2017-06-19.
 */

const isEqual = <T>(array1: T[], array2: T[]): boolean => {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
};

const updateArrayItem = <T>(
  array: T[],
  matchItem: (item: T) => boolean,
  updateOrAddNewItem: (item: T | undefined) => T | undefined,
): void => {
  const index = array.findIndex(matchItem);

  if (index === -1) {
    const newItem = updateOrAddNewItem(undefined);

    if (newItem != null) {
      array.push(newItem);
    }
  } else {
    const editedItem = updateOrAddNewItem(array[index]);

    if (editedItem != null) {
      array[index] = editedItem;
    }
  }
};

export const array_utils = {
  isEqual,
  updateArrayItem,
};
