import * as path from "node:path";
import {
  TEST_PROJECT_PACKAGE_JSON_PATH,
  TEST_PROJECT_RESET_PACKAGE_JSON_PATH,
  TEST_PROJECT_TWO_PACKAGE_JSON_PATH,
  TEST_PROJECT_TWO_RESET_PACKAGE_JSON_PATH,
} from "./packages/test_src/test_monorepo.static";

console.log("[test_monorepo] Resetting package.json file");

const thisDirectory = import.meta.dirname;

const resetPackageJsonFile = path.join(thisDirectory, TEST_PROJECT_RESET_PACKAGE_JSON_PATH);
const modulePackageJsonFile = path.join(thisDirectory, TEST_PROJECT_PACKAGE_JSON_PATH);
const resetPackageJsonFileTwo = path.join(thisDirectory, TEST_PROJECT_TWO_RESET_PACKAGE_JSON_PATH);
const modulePackageJsonFileTwo = path.join(thisDirectory, TEST_PROJECT_TWO_PACKAGE_JSON_PATH);

const resetFileText = await Bun.file(resetPackageJsonFile).text();
const resetFileTextTwo = await Bun.file(resetPackageJsonFileTwo).text();

await Bun.file(modulePackageJsonFile).write(resetFileText);
await Bun.file(modulePackageJsonFileTwo).write(resetFileTextTwo);
