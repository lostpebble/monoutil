import { afterAll, beforeEach, describe, expect, it } from "bun:test";
import { $ } from "bun";
import { _uniformUpdateTestExport } from "../../packages/monoutil/src/utils/uniform_update/_uniform_update_test_export";
import { getTestProjectPackageJsonObject } from "./packages/test_src/funcs/getTestProjectPackageJson";

const { zods, funcs, enums } = _uniformUpdateTestExport;
const nothing = { zods, funcs, enums };

const originalCwd = process.cwd();

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
      await $`bun run monoutil_bin.ts uniform_update --module pullstate --version 2.0.0`;
      const testPackageJson = await getTestProjectPackageJsonObject();
      expect(testPackageJson.dependencies).not.toBeUndefined();
      expect(testPackageJson.dependencies!["pullstate"]).not.toBeUndefined();
      expect(testPackageJson.dependencies!["pullstate"]!).toEqual("2.0.0");
    });
  });
});
