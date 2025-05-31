import { glob } from "tinyglobby";

export async function getMonorepoProjectSrcDirectories(): Promise<string[]> {
  return (
    await glob(["**/src", "!**/node_modules/**"], {
      onlyDirectories: true,
    })
  ).filter((dir) => dir.endsWith("src/"));
}
