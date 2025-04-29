import { quickMessageTemplate } from "../javascript_type_utils/string_utils/quickMessageTemplate";

export const readJsonFile = async <T>(filePath: string, filePurpose?: string): Promise<T> => {
  const file = Bun.file(filePath);

  if (!(await file.exists())) {
    throw new Error(
      quickMessageTemplate(
        '[[(File required for "{{filePurpose}}")|(Required file)]] was not found at "{{filePath}}"',
        {
          filePurpose,
          filePath,
        },
      ),
    );
  }

  const text = await file.text();

  try {
    return JSON.parse(text) as T;
  } catch (e) {
    throw new Error(
      quickMessageTemplate(
        '[[("{{filePurpose}}" file)|(Required file)]] was not found at "{{filePath}}"',
        {
          filePurpose,
          filePath,
        },
      ),
    );
  }
};

// `"${filePurpose}" file at "${filePath}}" is not valid JSON: ${e}`
