import { readJsonFile } from "../../files";
import { IPackageJsonFile } from "../package_json.types";

export async function readPackageJsonFile(filePath: string): Promise<IPackageJsonFile> {
  return readJsonFile(filePath, "module package.json");
}
