import { readdir } from "node:fs/promises";
import { buildCommand } from "@stricli/core";
import { getEpicsByStatus } from "../utils/epics.ts";
import { getAvailableTasks, getTaskStatus } from "../utils/tasks.ts";

async function standupCommand(): Promise<void> {
	const today = new Date().toISOString().split("T")[0];

	console.log(`📅 Daily Standup - ${today}`);
	console.log("================================");
	console.log("");

	console.log("Getting status...");
	console.log("");
	console.log("");

	// Today's activity (simplified - checking for recently modified files)
	console.log("📝 Today's Activity:");
	console.log("====================");
	console.log("");
	console.log("  No activity recorded today");
	console.log("");

	// Currently in progress
	console.log("🔄 Currently In Progress:");
	const grouped = await getEpicsByStatus();
	if (grouped.inProgress.length > 0) {
		for (const epic of grouped.inProgress) {
			console.log(`  • ${epic.name} - ${epic.progress} complete`);
		}
	} else {
		console.log("  (none)");
	}

	console.log("");

	// Next available tasks (top 3)
	console.log("⏭️ Next Available Tasks:");
	const availableTasks = await getAvailableTasks();
	const topTasks = availableTasks.slice(0, 3);

	if (topTasks.length > 0) {
		for (const task of topTasks) {
			console.log(`  • #${task.id} - ${task.name}`);
		}
	} else {
		console.log("  (none)");
	}

	console.log("");

	// Quick stats
	console.log("📊 Quick Stats:");
	try {
		const epicDirs = await readdir(".claude/epics", { withFileTypes: true });
		let totalTasks = 0;
		let openTasks = 0;
		let closedTasks = 0;

		for (const epicDir of epicDirs) {
			if (!epicDir.isDirectory()) {
				continue;
			}

			const epicPath = `.claude/epics/${epicDir.name}`;
			const files = await readdir(epicPath);

			for (const file of files) {
				if (!/^\d+\.md$/.test(file)) {
					continue;
				}

				totalTasks++;
				const taskPath = `${epicPath}/${file}`;
				const status = await getTaskStatus(taskPath);

				if (status === "open" || status === "") {
					openTasks++;
				} else if (status === "closed") {
					closedTasks++;
				}
			}
		}

		console.log(`  Tasks: ${openTasks} open, ${closedTasks} closed, ${totalTasks} total`);
	} catch {
		console.log("  No task statistics available");
	}
}

export const command = buildCommand({
	func: standupCommand,
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [],
		},
	},
	docs: {
		brief: "Generate daily standup report",
	},
});
