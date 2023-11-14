import { SSTConfig } from "sst";
import { API } from "./stacks/ApiStack";
import { StorageStack } from "./stacks/StorageStack";

export default {
  config(_input) {
    return {
      name: "short-linker",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.stack(StorageStack).stack(API);
  }
} satisfies SSTConfig;
