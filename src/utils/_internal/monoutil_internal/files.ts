export const readJsonFile = async <T>(
  filePath: string,
  filePurpose?: string,
): Promise<T | null> => {
  const file = Bun.file(filePath);

  if (!(await file.exists())) {
    throw new Error(`File required for "${filePurpose}" was not found at "${filePath}"`);
  }

  const text = await file.text();

  try {
    return JSON.parse(text) as T;
  } catch (e) {
    throw new Error(`"${filePurpose}" file at "${filePath}}" is not valid JSON: ${e}`);
  }
};
