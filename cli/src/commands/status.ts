import { readdir } from "node:fs/promises";
import { buildCommand } from "@stricli/core";
import { getTaskStatus } from "../utils/tasks.ts";

async function statusCommand(): Promise<void> {
	console.log("Getting status...");
	console.log("");
	console.log("");

	console.log("📊 Project Status");
	console.log("================");
	console.log("");

	// PRDs
	console.log("📄 PRDs:");
	try {
		const prdFiles = await readdir(".claude/prds");
		const mdFiles = prdFiles.filter((f) => f.endsWith(".md"));
		console.log(`  Total: ${mdFiles.length}`);
	} catch {
		console.log("  No PRDs found");
	}

	console.log("");

	// Epics
	console.log("📚 Epics:");
	try {
		const epicDirs = await readdir(".claude/epics", { withFileTypes: true });
		const dirs = epicDirs.filter((d) => d.isDirectory());
		console.log(`  Total: ${dirs.length}`);
	} catch {
		console.log("  No epics found");
	}

	console.log("");

	// Tasks
	console.log("📝 Tasks:");
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

		console.log(`  Open: ${openTasks}`);
		console.log(`  Closed: ${closedTasks}`);
		console.log(`  Total: ${totalTasks}`);
	} catch {
		console.log("  No tasks found");
	}
}

export const command = buildCommand({
	func: statusCommand,
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [],
		},
	},
	docs: {
		brief: "Show project status overview",
	},
});
