import { afterAll, beforeEach, describe, expect, it } from "bun:test";
import { $ } from "bun";
import { _uniformUpdateTestExport } from "../../packages/monoutil/src/utils/uniform_update/_uniform_update_test_export";
import {
  getTestProjectPackageJsonObject,
  getTestProjectPackageJsonText,
  getTestProjectTwoPackageJsonObject,
  getTestProjectTwoPackageJsonText,
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

async function testPackageJsonFilesAreUpdated() {
  const testPackageText = await getTestProjectPackageJsonText();
  expect(testPackageText).toMatchSnapshot();

  const testPackageTwoText = await getTestProjectTwoPackageJsonText();
  expect(testPackageTwoText).toMatchSnapshot();

  const testPackageJson = await getTestProjectPackageJsonObject();
  expect(testPackageJson.dependencies).not.toBeUndefined();
  expect(testPackageJson.dependencies!["pullstate"]).not.toBeUndefined();
  expect(testPackageJson.dependencies!["pullstate"]!).toEqual("2.0.0");

  const testPackageTwoJson = await getTestProjectTwoPackageJsonObject();
  expect(testPackageTwoJson.dependencies).not.toBeUndefined();
  expect(testPackageTwoJson.dependencies!["lodash"]).not.toBeUndefined();
  expect(testPackageTwoJson.dependencies!["lodash"]!).toEqual("4.17.21");
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
      await $`bun run monoutil_bin.ts uniform_update --module lodash --version 4.17.21`;

      await testPackageJsonFilesAreUpdated();
    });

    it("should update the monorepo dependencies with a config file", async () => {
      await testPackageJsonFileIsOriginal();

      await $`bun run monoutil_bin.ts uniform_update`;

      await testPackageJsonFilesAreUpdated();
    });

    it("should change the name of a package (using config file)", async () => {
      await testPackageJsonFileIsOriginal();

      await $`bun run monoutil_bin.ts uniform_update`;

      // const testPackageText = await getTestProjectPackageJsonText();
      const testPackageJson = await getTestProjectPackageJsonObject();
      expect(testPackageJson.dependencies).toBeDefined();
      expect(testPackageJson.dependencies!["@meteorwallet/gleap"]).toBeDefined();
      expect(testPackageJson.dependencies!["gleap"]).toBeUndefined();
      expect(testPackageJson.dependencies!["@meteorwallet/gleap"]).toEqual("14.0.0");

      await testPackageJsonFilesAreUpdated();
    });
  });
});
