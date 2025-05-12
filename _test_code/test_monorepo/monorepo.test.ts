import { afterAll, beforeEach, describe, expect, it } from "bun:test";
import { $ } from "bun";
import { _uniformUpdateTestExport } from "../../packages/monoutil/src/utils/uniform_update/_uniform_update_test_export";
import {
  getTestProjectPackageJsonObject,
  getTestProjectPackageJsonText,
} from "./packages/test_src/funcs/getTestProjectPackageData";

const { zods, funcs, enums } = _uniformUpdateTestExport;
const nothing = { zods, funcs, enums };

const originalCwd = process.cwd();

async function testPackageJsonFileIsOriginal() {
  const testPackageJsonOriginal = await getTestProjectPackageJsonObject();
  expect(testPackageJsonOriginal.dependencies).not.toBeUndefined();
  expect(testPackageJsonOriginal.dependencies!["pullstate"]).not.toBeUndefined();
  expect(testPackageJsonOriginal.dependencies!["pullstate"]!).toEqual("1.7.3");
}

describe("monorepo utils", () => {
  beforeEach(async () => {
    process.chdir(__dirname);
    $.cwd(__dirname);
    await $`bun run reset_test.ts`;
  });

  afterAll(() => {
    $.cwd(originalCwd);
    process.chdir(originalCwd);
  });

  describe("uniform_update", () => {
    it("should update the monorepo dependencies with a passed CLI arguments", async () => {
      await testPackageJsonFileIsOriginal();

      await $`bun run monoutil_bin.ts uniform_update --module pullstate --version 2.0.0`;

      const testPackageJson = await getTestProjectPackageJsonObject();
      expect(testPackageJson.dependencies).not.toBeUndefined();
      expect(testPackageJson.dependencies!["pullstate"]).not.toBeUndefined();
      expect(testPackageJson.dependencies!["pullstate"]!).toEqual("2.0.0");
    });

    it("should update the monorepo dependencies with a config file", async () => {
      await testPackageJsonFileIsOriginal();

      await $`bun run monoutil_bin.ts uniform_update`;

      const testPackageJson = await getTestProjectPackageJsonObject();
      const testPackageText = await getTestProjectPackageJsonText();

      expect(testPackageText).toMatchSnapshot();

      expect(testPackageJson.dependencies).not.toBeUndefined();
      expect(testPackageJson.dependencies!["pullstate"]).not.toBeUndefined();
      expect(testPackageJson.dependencies!["pullstate"]!).toEqual("2.0.0");
    });
  });
});
