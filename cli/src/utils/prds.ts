import { readdir } from "node:fs/promises";
import { basename, join } from "node:path";

export type Prd = {
	name: string;
	fileName: string;
	description: string;
	status: string;
	filePath: string;
};

export type PrdsByStatus = {
	backlog: Prd[];
	inProgress: Prd[];
	implemented: Prd[];
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

export async function getPrdMetadata(prdPath: string): Promise<Prd> {
	const content = await readFileContent(prdPath);
	const fileName = basename(prdPath, ".md");

	if (!content) {
		return {
			name: fileName,
			fileName,
			description: "No description",
			status: "backlog",
			filePath: prdPath,
		};
	}

	const name = extractFrontmatterField(content, "name") || fileName;
	const description = extractFrontmatterField(content, "description") || "No description";
	const status = extractFrontmatterField(content, "status") || "backlog";

	return {
		name,
		fileName,
		description,
		status,
		filePath: prdPath,
	};
}

export async function getPrds(prdsDir = ".claude/prds"): Promise<Prd[]> {
	const prds: Prd[] = [];

	try {
		const files = await readdir(prdsDir);

		for (const file of files) {
			if (!file.endsWith(".md")) {
				continue;
			}

			const prdPath = join(prdsDir, file);
			const metadata = await getPrdMetadata(prdPath);
			prds.push(metadata);
		}
	} catch {
		// .claude/prds doesn't exist or can't be read
	}

	return prds;
}

function categorizeStatus(status: string): keyof PrdsByStatus {
	const normalized = status.toLowerCase();

	switch (normalized) {
		case "in-progress":
		case "in_progress":
		case "active":
			return "inProgress";
		case "implemented":
		case "completed":
		case "complete":
		case "done":
		case "finished":
			return "implemented";
		default:
			return "backlog";
	}
}

export async function getPrdsByStatus(prdsDir = ".claude/prds"): Promise<PrdsByStatus> {
	const prds = await getPrds(prdsDir);

	const grouped: PrdsByStatus = {
		backlog: [],
		inProgress: [],
		implemented: [],
	};

	for (const prd of prds) {
		const category = categorizeStatus(prd.status);
		grouped[category].push(prd);
	}

	return grouped;
}
