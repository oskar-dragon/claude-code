import { buildCommand } from "@stricli/core";
import { getBlockedTasks } from "../utils/tasks.ts";

async function blockedCommand(): Promise<void> {
	console.log("Getting tasks...");
	console.log("");
	console.log("");

	console.log("🚫 Blocked Tasks");
	console.log("================");
	console.log("");

	const tasks = await getBlockedTasks();

	if (tasks.length === 0) {
		console.log("No blocked tasks found!");
		console.log("");
		console.log("💡 All tasks with dependencies are either completed or in progress.");
	} else {
		for (const task of tasks) {
			console.log(`⏸️ Task #${task.id} - ${task.name}`);
			console.log(`   Epic: ${task.epicName}`);
			console.log(`   Blocked by: [${task.dependencies.join(", ")}]`);

			if (task.openDependencies.length > 0) {
				const openDepsStr = task.openDependencies.map((dep) => `#${dep}`).join(" ");
				console.log(`   Waiting for: ${openDepsStr}`);
			}

			console.log("");
		}

		console.log(`📊 Total blocked: ${tasks.length} tasks`);
	}
}

export const command = buildCommand({
	func: blockedCommand,
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [],
		},
	},
	docs: {
		brief: "Show tasks blocked by dependencies",
	},
});
