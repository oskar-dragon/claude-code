import { readdir } from "node:fs/promises";
import { join } from "node:path";

export type Task = {
	id: string;
	name: string;
	epicName: string;
	status: string;
	dependencies: string[];
	filePath: string;
};

export type BlockedTask = Task & {
	openDependencies: string[];
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

function parseDependencies(content: string): string[] {
	const depsLine = extractFrontmatterField(content, "depends_on");

	if (!depsLine || depsLine === "depends_on:") {
		return [];
	}

	const deps = depsLine.replace(/^\[/, "").replace(/\]$/, "").trim();

	if (!deps) {
		return [];
	}

	return deps
		.split(",")
		.map((dep) => dep.trim())
		.filter((dep) => dep.length > 0);
}

export async function getTaskStatus(taskFilePath: string): Promise<string> {
	const content = await readFileContent(taskFilePath);
	if (!content) {
		return "";
	}

	return extractFrontmatterField(content, "status");
}

export async function getTaskName(taskFilePath: string): Promise<string> {
	const content = await readFileContent(taskFilePath);
	if (!content) {
		return "";
	}

	return extractFrontmatterField(content, "name");
}

export async function getTaskDependencies(taskFilePath: string): Promise<string[]> {
	const content = await readFileContent(taskFilePath);
	if (!content) {
		return [];
	}

	return parseDependencies(content);
}

async function getOpenDependencies(epicDir: string, dependencies: string[]): Promise<string[]> {
	const openDeps: string[] = [];

	for (const dep of dependencies) {
		const depFilePath = join(epicDir, `${dep}.md`);
		const depStatus = await getTaskStatus(depFilePath);

		if (depStatus === "open" || depStatus === "") {
			openDeps.push(dep);
		}
	}

	return openDeps;
}

async function processTaskFile(
	file: string,
	epicDir: string,
	epicName: string
): Promise<BlockedTask | null> {
	if (!/^\d+\.md$/.test(file)) {
		return null;
	}

	const taskFilePath = join(epicDir, file);
	const status = await getTaskStatus(taskFilePath);

	// Only check open tasks
	if (status !== "open" && status !== "") {
		return null;
	}

	const dependencies = await getTaskDependencies(taskFilePath);

	// Only include tasks with dependencies
	if (dependencies.length === 0) {
		return null;
	}

	const name = await getTaskName(taskFilePath);
	const taskId = file.replace(".md", "");
	const openDependencies = await getOpenDependencies(epicDir, dependencies);

	return {
		id: taskId,
		name,
		epicName,
		status,
		dependencies,
		openDependencies,
		filePath: taskFilePath,
	};
}

async function processEpic(epicName: string): Promise<BlockedTask[]> {
	const blockedTasks: BlockedTask[] = [];
	const epicDir = join(".claude/epics", epicName);

	try {
		const epicFiles = await readdir(epicDir);

		for (const file of epicFiles) {
			const task = await processTaskFile(file, epicDir, epicName);
			if (task) {
				blockedTasks.push(task);
			}
		}
	} catch {
		// Epic directory can't be read
	}

	return blockedTasks;
}

export async function getBlockedTasks(): Promise<BlockedTask[]> {
	const blockedTasks: BlockedTask[] = [];

	try {
		const epicDirs = await readdir(".claude/epics", { withFileTypes: true });

		for (const epicEntry of epicDirs) {
			if (!epicEntry.isDirectory()) {
				continue;
			}

			const tasks = await processEpic(epicEntry.name);
			blockedTasks.push(...tasks);
		}
	} catch {
		// .claude/epics doesn't exist or can't be read
	}

	return blockedTasks;
}
