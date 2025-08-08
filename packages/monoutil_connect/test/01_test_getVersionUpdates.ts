import stringify from "json-stringify-pretty-compact";
import { getVersionUpdates } from "../src";

const response = await getVersionUpdates({
  react: "16.1.0",
});

console.log(stringify(response));
