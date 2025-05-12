const DEFAULT_START_WEIGHT = 0.6;

export interface IShortenMiddleOutResult_Shortened {
  wasShortened: true;
  text: string;
  firstPart: string;
  secondPart: string;
  /**
   * The size comparison between the original text and the shortened text
   *
   * This takes into account the middle part of the text that is added (if any)
   *
   * 1 is not possible- because wasShortened would be false (they are the same size)
   * 0.5 means the new size is half (and so on)
   */
  sizeComparison: number;
}

export interface IShortenMiddleOutResult_NotShortened {
  wasShortened: false;
  text: string;
}

export type TShortenMiddleOutResult =
  | IShortenMiddleOutResult_Shortened
  | IShortenMiddleOutResult_NotShortened;

interface IShortenMiddleOutOptions {
  /**
   * The string to put in the middle of the text
   * @default "..."
   */
  filler?: string;
  maxLength: number;
  /**
   * The relative weight of the firstPart between 0 and 1
   * @default 0.6
   */
  weightStart?: number;
  trimPartWhitespace?: boolean;
}

export function shortenMiddleOut(
  text: string,
  {
    filler = "...",
    maxLength,
    weightStart = DEFAULT_START_WEIGHT,
    trimPartWhitespace = true,
  }: IShortenMiddleOutOptions,
): TShortenMiddleOutResult {
  if (text.length <= maxLength) {
    return {
      wasShortened: false,
      text,
    };
  }

  const maxLengthWithoutFiller = maxLength - filler.length;
  const firstPartLength = Math.ceil(maxLengthWithoutFiller * weightStart);
  const secondPartLength = maxLengthWithoutFiller - firstPartLength;

  let firstPart = text.slice(0, firstPartLength);
  let secondPart = text.slice(text.length - secondPartLength);

  if (trimPartWhitespace) {
    firstPart = firstPart.trim();
    secondPart = secondPart.trim();
  }

  const finalText = `${firstPart}${filler}${secondPart}`;

  const sizeComparison = finalText.length / text.length;

  return {
    wasShortened: true,
    text: finalText,
    firstPart,
    secondPart,
    sizeComparison,
  };
}
