import { buildApplication, buildRouteMap } from "@stricli/core";
import { command as blocked } from "./commands/blocked";
import { command as epicList } from "./commands/epic-list";
import { command as helpCmd } from "./commands/help-cmd";
import { command as inProgress } from "./commands/in-progress";
import { command as init } from "./commands/init";
import { command as next } from "./commands/next";
import { command as prdList } from "./commands/prd-list";
import { command as prdStatus } from "./commands/prd-status";
import { command as searchCmd } from "./commands/search-cmd";
import { command as standup } from "./commands/standup";
import { command as status } from "./commands/status";
import { command as validate } from "./commands/validate";

const root = buildRouteMap({
	routes: {
		blocked,
		"epic-list": epicList,
		help: helpCmd,
		"in-progress": inProgress,
		init,
		next,
		"prd-list": prdList,
		"prd-status": prdStatus,
		search: searchCmd,
		standup,
		status,
		validate,
	},
	docs: {
		brief: "CLI tool for Claude Code Flow",
	},
});

export const app = buildApplication(root, {
	name: "claude-code-flow",
	versionInfo: {
		currentVersion: "0.1.0",
	},
});
