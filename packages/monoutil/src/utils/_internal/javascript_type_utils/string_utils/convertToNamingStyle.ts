import { getTextLogicalParts } from "./getTextLogicalParts";
import { inspectTextNaming } from "./inspectTextNaming";
import { EVariableNamingStyle } from "./string_formatting.enums";

export function convertToNamingStyle(inputText: string, namingStyle: EVariableNamingStyle) {
  let textInfo = inspectTextNaming(inputText);

  if (!textInfo.hasKnownStyle) {
    const text = getTextLogicalParts(inputText).join("-");
    console.warn(
      `Unknown naming style from received input text "${inputText}". Attempting with slug "${text}"`,
    );
    textInfo = inspectTextNaming(text);
  }

  if (!textInfo.hasKnownStyle) {
    console.warn(
      `Unknown naming style from received input text "${inputText}". Returning input text as is.`,
    );
    return inputText;
  }

  if (textInfo.styles.includes(namingStyle)) {
    return inputText;
  }

  let resultText = "";

  for (const [index, part] of textInfo.lowercaseParts.entries()) {
    switch (namingStyle) {
      case EVariableNamingStyle.camel_case:
        if (index === 0) {
          resultText += part;
        } else {
          resultText += part[0]!.toUpperCase() + part.slice(1);
        }
        break;
      case EVariableNamingStyle.snake_case:
        if (index > 0) {
          resultText += `_${part}`;
        } else {
          resultText += part;
        }
        break;
      case EVariableNamingStyle.kebab_case:
        if (index > 0) {
          resultText += `-${part}`;
        } else {
          resultText += part;
        }
        break;
      case EVariableNamingStyle.pascal_case:
        resultText += part[0]!.toUpperCase() + part.slice(1);
        break;
    }
  }

  return resultText;
}
