import { describe, expect, it } from "bun:test";
import {
  IShortenMiddleOutResult_Shortened,
  shortenMiddleOut,
  TShortenMiddleOutResult,
} from "./shortenMiddleOut";

describe("shortenMiddleOut", () => {
  it("should return the original text if it is shorter than maxLength", () => {
    const result: TShortenMiddleOutResult = shortenMiddleOut("short text", { maxLength: 20 });
    expect(result).toEqual({
      wasShortened: false,
      text: "short text",
    });
  });

  it("should shorten the text and add the filler in the middle, with some trimming", () => {
    const text = "this is a very long text";
    const result: TShortenMiddleOutResult = shortenMiddleOut(text, {
      maxLength: 10,
    });

    const expectedText = "this...xt";

    expect(result).toEqual({
      wasShortened: true,
      text: expectedText,
      firstPart: "this",
      secondPart: "xt",
      sizeComparison: expectedText.length / text.length,
    });
  });

  it("should use the default filler if none is provided", () => {
    const result: TShortenMiddleOutResult = shortenMiddleOut("this is a very long text", {
      maxLength: 10,
    });
    expect(result.text).toBe("this...xt");
  });

  it("should use the provided filler", () => {
    const result: TShortenMiddleOutResult = shortenMiddleOut("this is a very long text", {
      maxLength: 10,
      filler: "---",
    });
    expect(result.text).toBe("this---xt");
  });

  it("should use the provided weightStart", () => {
    const result: TShortenMiddleOutResult = shortenMiddleOut("this is a very long text", {
      maxLength: 10,
      weightStart: 0.4,
    });

    expect(result.wasShortened).toBe(true);
    expect((result as IShortenMiddleOutResult_Shortened).firstPart.length).toBe(
      Math.ceil((10 - 3) * 0.4),
    );
  });
});
