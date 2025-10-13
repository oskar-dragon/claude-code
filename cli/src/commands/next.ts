import { buildCommand } from "@stricli/core";
import { getAvailableTasks } from "../utils/tasks.ts";

async function nextCommand(): Promise<void> {
	console.log("Getting status...");
	console.log("");
	console.log("");

	console.log("📋 Next Available Tasks");
	console.log("=======================");
	console.log("");

	const tasks = await getAvailableTasks();

	if (tasks.length === 0) {
		console.log("No available tasks found.");
		console.log("");
		console.log("💡 Suggestions:");
		console.log("  • Check blocked tasks: /pm:blocked");
		console.log("  • View all tasks: /pm:epic-list");
	} else {
		for (const task of tasks) {
			console.log(`✅ Ready: #${task.id} - ${task.name}`);
			console.log(`   Epic: ${task.epicName}`);
			if (task.parallel) {
				console.log("   🔄 Can run in parallel");
			}
			console.log("");
		}

		console.log(`📊 Summary: ${tasks.length} tasks ready to start`);
	}

	console.log("");
}

export const command = buildCommand({
	func: nextCommand,
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [],
		},
	},
	docs: {
		brief: "Show next available tasks ready to start",
	},
});
