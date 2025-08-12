import { linkLocalPackages } from "local-package-link";

const watch = process.argv.includes("--watch");

(async () => {
  try {
    await linkLocalPackages({ watch });
    console.log("local-package-link: completed" + (watch ? " (watch mode running)" : ""));
  } catch (err) {
    console.error("local-package-link: error", err);
    process.exit(1);
  }
})();
