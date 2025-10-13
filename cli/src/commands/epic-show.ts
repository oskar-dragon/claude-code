import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { buildCommand } from "@stricli/core";
import { getEpicMetadata } from "../utils/epics.ts";
import { getTaskName, getTaskStatus } from "../utils/tasks.ts";

type TaskInfo = {
	id: string;
	name: string;
	status: string;
	parallel: boolean;
};

async function readFileContent(filePath: string): Promise<string | null> {
	try {
		const file = Bun.file(filePath);
		return await file.text();
	} catch {
		return null;
	}
}

function extractFrontmatterField(content: string, field: string): string {
	const lines = content.split("\n");
	for (const line of lines) {
		if (line.startsWith(`${field}:`)) {
			return line.replace(`${field}:`, "").trim();
		}
	}
	return "";
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

async function getTasks(epicDir: string): Promise<TaskInfo[]> {
	const tasks: TaskInfo[] = [];

	try {
		const files = await readdir(epicDir);

		for (const file of files) {
			if (!/^\d+\.md$/.test(file)) {
				continue;
			}

			const taskFilePath = join(epicDir, file);
			const taskId = file.replace(".md", "");
			const name = await getTaskName(taskFilePath);
			const status = await getTaskStatus(taskFilePath);

			// Check for parallel flag
			const content = await readFileContent(taskFilePath);
			const parallelStr = content ? extractFrontmatterField(content, "parallel") : "";
			const parallel = parallelStr === "true";

			tasks.push({ id: taskId, name, status, parallel });
		}
	} catch {
		// Directory can't be read
	}

	// Sort by task ID
	tasks.sort((a, b) => {
		const aNum = Number.parseInt(a.id, 10);
		const bNum = Number.parseInt(b.id, 10);
		return aNum - bNum;
	});

	return tasks;
}

async function epicShowCommand(_context: unknown, epicName: string): Promise<void> {
	console.log("Getting epic...");
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

	// Get epic metadata
	const epic = await getEpicMetadata(epicDir);

	// Display epic details
	console.log(`📚 Epic: ${epicName}`);
	console.log("================================");
	console.log("");

	// Extract metadata
	const created = extractFrontmatterField(epicContent, "created");

	console.log("📊 Metadata:");
	console.log(`  Status: ${epic.status || "planning"}`);
	console.log(`  Progress: ${epic.progress}`);
	if (epic.github) {
		console.log(`  GitHub: ${epic.github}`);
	}
	console.log(`  Created: ${created || "unknown"}`);
	console.log("");

	// Get and display tasks
	console.log("📝 Tasks:");
	const tasks = await getTasks(epicDir);

	let closedCount = 0;
	let openCount = 0;

	if (tasks.length === 0) {
		console.log("  No tasks created yet");
		console.log(`  Run: /pm:epic-decompose ${epicName}`);
	} else {
		for (const task of tasks) {
			const isClosed = task.status === "closed" || task.status === "completed";

			if (isClosed) {
				console.log(`  ✅ #${task.id} - ${task.name}`);
				closedCount++;
			} else {
				let line = `  ⬜ #${task.id} - ${task.name}`;
				if (task.parallel) {
					line += " (parallel)";
				}
				console.log(line);
				openCount++;
			}
		}
	}

	console.log("");
	console.log("📈 Statistics:");
	console.log(`  Total tasks: ${tasks.length}`);
	console.log(`  Open: ${openCount}`);
	console.log(`  Closed: ${closedCount}`);
	if (tasks.length > 0) {
		const completion = Math.floor((closedCount * 100) / tasks.length);
		console.log(`  Completion: ${completion}%`);
	}

	// Next actions
	console.log("");
	console.log("💡 Actions:");
	if (tasks.length === 0) {
		console.log(`  • Decompose into tasks: /pm:epic-decompose ${epicName}`);
	}
	if (!epic.github && tasks.length > 0) {
		console.log(`  • Sync to GitHub: /pm:epic-sync ${epicName}`);
	}
	if (epic.github && epic.status !== "completed") {
		console.log(`  • Start work: /pm:epic-start ${epicName}`);
	}
}

export const command = buildCommand({
	func: epicShowCommand,
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
		brief: "Show detailed information about an epic",
	},
});
