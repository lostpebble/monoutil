import { readPackageJsonFile } from "../../../../../packages/monoutil/src/utils/_internal/monoutil_internal/package_json/funcs/readPackageJsonFile";
import { IPackageJsonFile } from "../../../../../packages/monoutil/src/utils/_internal/monoutil_internal/package_json/package_json.types";
import {
  TEST_PROJECT_PACKAGE_JSON_PATH,
  TEST_PROJECT_TWO_PACKAGE_JSON_PATH,
} from "../test_monorepo.static";

export async function getTestProjectPackageJsonObject(): Promise<IPackageJsonFile> {
  return await readPackageJsonFile(TEST_PROJECT_PACKAGE_JSON_PATH);
}

export async function getTestProjectPackageJsonText(): Promise<string> {
  return await Bun.file(TEST_PROJECT_PACKAGE_JSON_PATH).text();
}

export async function getTestProjectTwoPackageJsonObject(): Promise<IPackageJsonFile> {
  return await readPackageJsonFile(TEST_PROJECT_TWO_PACKAGE_JSON_PATH);
}

export async function getTestProjectTwoPackageJsonText(): Promise<string> {
  return await Bun.file(TEST_PROJECT_TWO_PACKAGE_JSON_PATH).text();
}
