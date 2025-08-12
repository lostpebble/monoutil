import { parseArgs } from "node:util";
import { linkLocalPackages } from "./link-local-packages";

const {
  values: { watch },
} = parseArgs({
  args: Bun.argv,
  options: {
    watch: {
      type: "boolean",
      default: false,
    },
  },
  strict: true,
  allowPositionals: true,
});

await linkLocalPackages({ watch });
