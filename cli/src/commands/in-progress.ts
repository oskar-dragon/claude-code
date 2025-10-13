import { buildCommand } from "@stricli/core";
import { getEpicsByStatus } from "../utils/epics.ts";

async function inProgressCommand(): Promise<void> {
	console.log("Getting status...");
	console.log("");
	console.log("");

	console.log("🔄 In Progress Work");
	console.log("===================");
	console.log("");

	const grouped = await getEpicsByStatus();

	console.log("📚 Active Epics:");
	if (grouped.inProgress.length > 0) {
		for (const epic of grouped.inProgress) {
			console.log(`   • ${epic.name} - ${epic.progress} complete`);
		}
	} else {
		console.log("   (none)");
	}

	console.log("");

	if (grouped.inProgress.length === 0) {
		console.log("No active work items found.");
		console.log("");
		console.log("💡 Start work with: /pm:next");
	} else {
		console.log(`📊 Total active items: ${grouped.inProgress.length}`);
	}
}

export const command = buildCommand({
	func: inProgressCommand,
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [],
		},
	},
	docs: {
		brief: "Show work currently in progress",
	},
});
