import { buildApplication, buildRouteMap } from "@stricli/core";
import { command as init } from "./commands/init";
import { command as validate } from "./commands/validate";

const root = buildRouteMap({
  routes: {
    init,
    validate,
  },
  docs: {
    brief: "CLI tool for Claude Code Flow",
  },
});

export const app = buildApplication(root, {
  name: "ccf",
  versionInfo: {
    currentVersion: "0.1.0",
  },
});
