import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { buildCommand } from "@stricli/core";
import { getEpicMetadata } from "../utils/epics.ts";
import { getTaskDependencies, getTaskStatus } from "../utils/tasks.ts";

async function readFileContent(filePath: string): Promise<string | null> {
	try {
		const file = Bun.file(filePath);
		return await file.text();
	} catch {
		return null;
	}
}

async function listAvailableEpics(): Promise<void> {
	try {
		const entries = await readdir(".claude/epics", { withFileTypes: true });
		const epicDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

		if (epicDirs.length > 0) {
			for (const dir of epicDirs) {
				console.log(`  • ${dir}`);
			}
		}
	} catch {
		// Directory doesn't exist
	}
}

type TaskStats = {
	total: number;
	open: number;
	closed: number;
	blocked: number;
};

async function getTaskStats(epicDir: string): Promise<TaskStats> {
	const stats: TaskStats = {
		total: 0,
		open: 0,
		closed: 0,
		blocked: 0,
	};

	try {
		const files = await readdir(epicDir);

		for (const file of files) {
			if (!/^\d+\.md$/.test(file)) {
				continue;
			}

			stats.total++;

			const taskFilePath = join(epicDir, file);
			const status = await getTaskStatus(taskFilePath);
			const deps = await getTaskDependencies(taskFilePath);

			if (status === "closed" || status === "completed") {
				stats.closed++;
			} else if (deps.length > 0) {
				stats.blocked++;
			} else {
				stats.open++;
			}
		}
	} catch {
		// Directory can't be read
	}

	return stats;
}

function renderProgressBar(closed: number, total: number): string {
	if (total === 0) {
		return "Progress: No tasks created";
	}

	const percent = Math.floor((closed * 100) / total);
	const filled = Math.floor((percent * 20) / 100);
	const empty = 20 - filled;

	let bar = "Progress: [";
	bar += "█".repeat(filled);
	bar += "░".repeat(empty);
	bar += `] ${percent}%`;

	return bar;
}

async function epicStatusCommand(_context: unknown, epicName: string): Promise<void> {
	console.log("Getting status...");
	console.log("");
	console.log("");

	const epicDir = join(".claude/epics", epicName);
	const epicFile = join(epicDir, "epic.md");

	// Check if epic exists
	const epicContent = await readFileContent(epicFile);
	if (!epicContent) {
		console.log(`❌ Epic not found: ${epicName}`);
		console.log("");
		console.log("Available epics:");
		await listAvailableEpics();
		process.exit(1);
	}

	console.log(`📚 Epic Status: ${epicName}`);
	console.log("================================");
	console.log("");

	// Get epic metadata
	const epic = await getEpicMetadata(epicDir);

	// Get task statistics
	const stats = await getTaskStats(epicDir);

	// Display progress bar
	console.log(renderProgressBar(stats.closed, stats.total));

	console.log("");
	console.log("📊 Breakdown:");
	console.log(`  Total tasks: ${stats.total}`);
	console.log(`  ✅ Completed: ${stats.closed}`);
	console.log(`  🔄 Available: ${stats.open}`);
	console.log(`  ⏸️  Blocked: ${stats.blocked}`);

	if (epic.github) {
		console.log("");
		console.log(`🔗 GitHub: ${epic.github}`);
	}
}

export const command = buildCommand({
	func: epicStatusCommand,
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [
				{
					brief: "Name of the epic",
					parse: String,
				},
			],
		},
	},
	docs: {
		brief: "Show status of an epic's tasks",
	},
});
