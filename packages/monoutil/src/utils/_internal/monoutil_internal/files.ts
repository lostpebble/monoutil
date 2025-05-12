import stringify from "json-stringify-pretty-compact";
import { quickMessageTemplate } from "../javascript_type_utils/string_utils/quickMessageTemplate";

export const readJsonFile = async <T>(filePath: string, filePurpose?: string): Promise<T> => {
  const file = Bun.file(filePath);

  if (!(await file.exists())) {
    throw new Error(
      quickMessageTemplate(
        '[[(Required "{{filePurpose}}" file)|(Required file)]] was not found at "{{filePath}}"',
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
        '[[("{{filePurpose}}" file)|(Required file)]] found at "{{filePath}}" could not be parsed as JSON: {{error}}',
        {
          filePurpose,
          filePath,
          error: e instanceof Error ? e.message : "Unknown error",
        },
      ),
    );
  }
};

interface IWriteJsonFileInputs<T> {
  filePath: string;
  filePurpose?: string;
  json: T;
  shouldExist?: boolean;
}

export const writeJsonFile = async <T>({
  json,
  filePath,
  filePurpose,
  shouldExist = false,
}: IWriteJsonFileInputs<T>) => {
  const file = Bun.file(filePath);

  if (shouldExist) {
    if (!(await file.exists())) {
      throw new Error(
        quickMessageTemplate(
          '[[(Required "{{filePurpose}}" file)|(Required file)]] for writing to was not found at "{{filePath}}"',
          {
            filePurpose,
            filePath,
          },
        ),
      );
    }
  }

  try {
    return file.write(stringify(json));
  } catch (e) {
    throw new Error(
      quickMessageTemplate(
        '[[("{{filePurpose}}" file)|(Required file)]] found at "{{filePath}}" could not be written to (with JSON): {{error}}',
        {
          filePurpose,
          filePath,
          error: e instanceof Error ? e.message : "Unknown error",
        },
      ),
    );
  }
};
