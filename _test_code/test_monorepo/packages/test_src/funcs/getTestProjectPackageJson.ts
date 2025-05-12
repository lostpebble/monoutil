import { IPackageJsonFile } from "../../../../../packages/monoutil/src/utils/_internal/monoutil_internal/package_json/package_json.types";
import { TEST_PROJECT_RESET_PACKAGE_JSON_PATH } from "../test_monorepo.static";

export async function getTestProjectPackageJsonObject(): Promise<IPackageJsonFile> {
  return await Bun.file(TEST_PROJECT_RESET_PACKAGE_JSON_PATH).json();
}

export async function getTestProjectPackageJsonText(): Promise<string> {
  return await Bun.file(TEST_PROJECT_RESET_PACKAGE_JSON_PATH).text();
}
