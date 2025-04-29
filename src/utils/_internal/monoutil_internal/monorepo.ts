import { glob } from "tinyglobby";

export async function getMonorepoProjectPackageJsonFilePaths(): Promise<string[]> {
  return await glob(["**/package.json", "!**/node_modules/**"]);
}
