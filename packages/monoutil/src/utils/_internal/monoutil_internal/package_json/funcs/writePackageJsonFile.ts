import { writeJsonFile } from "../../files";
import { IPackageJsonFile } from "../package_json.types";

export async function writePackageJsonFile<P extends IPackageJsonFile>(
  filePath: string,
  packageJson: P,
): Promise<void> {
  await writeJsonFile({
    json: packageJson,
    filePurpose: "module package.json",
    filePath,
    shouldExist: true,
  });
}
