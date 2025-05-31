import { confirm } from "@inquirer/prompts";
import { glob } from "tinyglobby";
import { getMonorepoProjectSrcDirectories } from "../_internal/monoutil_internal/package_json/funcs/getMonorepoProjectSrcDirectories";

export async function tsRemoveEmittedFromSource() {
  const projectSourceDirectories = await getMonorepoProjectSrcDirectories();
  console.log(`Found potential project source directories:
 * ${projectSourceDirectories.join("\n * ")}`);

  for (const sourceDir of projectSourceDirectories) {
    const emittedFiles = await glob([`${sourceDir}/**/*.{d.ts,js,mjs}`], {
      onlyFiles: true,
    });

    const sourceFiles = await glob([`${sourceDir}/**/*.{ts,tsx}`], {});
    const sourceFilesWithoutExtension = sourceFiles.map((file) => {
      return file.replace(/\.ts(x)?$/, "");
    });

    const matchedEmittedFiles = emittedFiles.filter((emittedFile) => {
      const emittedWithoutExtension = emittedFile
        .replace(/\.d\.ts$/, "")
        .replace(/\.js$/, "")
        .replace(/\.mjs$/, "");

      return sourceFilesWithoutExtension.some(
        (sourceFile) => sourceFile === emittedWithoutExtension,
      );
    });

    if (matchedEmittedFiles.length > 0) {
      console.log(`\nFound TypeScript emitted (.d.ts / .js / .mjs) files (with a corresponding source file) in "${sourceDir}":
  ${matchedEmittedFiles.join("\n  ")}\n`);

      const response = await confirm({
        message: `Would you like to remove emitted files from ${sourceDir}? (y/n)`,
      });

      if (response) {
        console.log(
          `\nRemoving (${matchedEmittedFiles.length}) emitted files from ${sourceDir}...`,
        );

        for (const file of matchedEmittedFiles) {
          try {
            await Bun.file(file).delete();
          } catch (e) {
            console.error(`Error removing file ${file}:`, e);
          }
        }
      }
    } else {
      console.log(`No emitted TypeScript files found in "${sourceDir}".\n`);
    }
  }
}
