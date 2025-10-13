import { readdir } from "node:fs/promises";
import { basename, join } from "node:path";

export type Epic = {
	name: string;
	dirName: string;
	status: string;
	progress: string;
	github: string;
	githubIssueNumber: string;
	taskCount: number;
	filePath: string;
};

export type EpicsByStatus = {
	planning: Epic[];
	inProgress: Epic[];
	completed: Epic[];
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

function extractGitHubIssueNumber(githubUrl: string): string {
	const match = githubUrl.match(/\/(\d+)$/);
	return match?.[1] ?? "";
}

async function countTasks(epicDir: string): Promise<number> {
	try {
		const files = await readdir(epicDir);
		return files.filter((file) => /^\d+\.md$/.test(file)).length;
	} catch {
		return 0;
	}
}

export async function getEpicMetadata(epicDir: string): Promise<Epic> {
	const epicMdPath = join(epicDir, "epic.md");
	const content = await readFileContent(epicMdPath);
	const dirName = basename(epicDir);

	if (!content) {
		return {
			name: dirName,
			dirName,
			status: "",
			progress: "0%",
			github: "",
			githubIssueNumber: "",
			taskCount: 0,
			filePath: epicMdPath,
		};
	}

	const name = extractFrontmatterField(content, "name") || dirName;
	const status = extractFrontmatterField(content, "status");
	const progress = extractFrontmatterField(content, "progress") || "0%";
	const github = extractFrontmatterField(content, "github");
	const githubIssueNumber = extractGitHubIssueNumber(github);
	const taskCount = await countTasks(epicDir);

	return {
		name,
		dirName,
		status,
		progress,
		github,
		githubIssueNumber,
		taskCount,
		filePath: epicMdPath,
	};
}

export async function getEpics(epicsDir = ".claude/epics"): Promise<Epic[]> {
	const epics: Epic[] = [];

	try {
		const entries = await readdir(epicsDir, { withFileTypes: true });

		for (const entry of entries) {
			if (!entry.isDirectory()) {
				continue;
			}

			const epicDir = join(epicsDir, entry.name);
			const epicMdPath = join(epicDir, "epic.md");

			// Check if epic.md exists
			const epicMdContent = await readFileContent(epicMdPath);
			if (!epicMdContent) {
				continue;
			}

			const metadata = await getEpicMetadata(epicDir);
			epics.push(metadata);
		}
	} catch {
		// .claude/epics doesn't exist or can't be read
	}

	return epics;
}

function categorizeStatus(status: string): keyof EpicsByStatus {
	const normalized = status.toLowerCase();

	switch (normalized) {
		case "in-progress":
		case "in_progress":
		case "active":
		case "started":
			return "inProgress";
		case "completed":
		case "complete":
		case "done":
		case "closed":
		case "finished":
			return "completed";
		default:
			return "planning";
	}
}

export async function getEpicsByStatus(epicsDir = ".claude/epics"): Promise<EpicsByStatus> {
	const epics = await getEpics(epicsDir);

	const grouped: EpicsByStatus = {
		planning: [],
		inProgress: [],
		completed: [],
	};

	for (const epic of epics) {
		const category = categorizeStatus(epic.status);
		grouped[category].push(epic);
	}

	return grouped;
}
