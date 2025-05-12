import * as path from "node:path";
import {
  TEST_PROJECT_PACKAGE_JSON_PATH,
  TEST_PROJECT_RESET_PACKAGE_JSON_PATH,
} from "./packages/test_src/test_monorepo.static";

const thisDirectory = import.meta.dirname;

const resetPackageJsonFile = path.join(thisDirectory, TEST_PROJECT_RESET_PACKAGE_JSON_PATH);
// const testPaca
const modulePackageJsonFile = path.join(thisDirectory, TEST_PROJECT_PACKAGE_JSON_PATH);

const resetFileText = await Bun.file(resetPackageJsonFile).text();

await Bun.file(modulePackageJsonFile).write(resetFileText);
