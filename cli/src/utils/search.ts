import { readdir } from "node:fs/promises";
import { basename, join } from "node:path";

export type SearchResult = {
	name: string;
	filePath: string;
	matchCount: number;
};

export type TaskSearchResult = SearchResult & {
	epicName: string;
	taskNumber: string;
};

async function readFileContent(filePath: string): Promise<string | null> {
	try {
		const file = Bun.file(filePath);
		return await file.text();
	} catch {
		return null;
	}
}

function countMatches(content: string, query: string): number {
	const regex = new RegExp(query, "gi");
	const matches = content.match(regex);
	return matches ? matches.length : 0;
}

export async function searchPrds(query: string, prdsDir = ".claude/prds"): Promise<SearchResult[]> {
	const results: SearchResult[] = [];

	try {
		const files = await readdir(prdsDir);

		for (const file of files) {
			if (!file.endsWith(".md")) {
				continue;
			}

			const filePath = join(prdsDir, file);
			const content = await readFileContent(filePath);

			if (!content) {
				continue;
			}

			const matchCount = countMatches(content, query);

			if (matchCount > 0) {
				results.push({
					name: basename(file, ".md"),
					filePath,
					matchCount,
				});
			}
		}
	} catch {
		// prds directory doesn't exist or can't be read
	}

	return results;
}

export async function searchEpics(
	query: string,
	epicsDir = ".claude/epics"
): Promise<SearchResult[]> {
	const results: SearchResult[] = [];

	try {
		const epicDirs = await readdir(epicsDir, { withFileTypes: true });

		for (const epicDir of epicDirs) {
			if (!epicDir.isDirectory()) {
				continue;
			}

			const epicMdPath = join(epicsDir, epicDir.name, "epic.md");
			const content = await readFileContent(epicMdPath);

			if (!content) {
				continue;
			}

			const matchCount = countMatches(content, query);

			if (matchCount > 0) {
				results.push({
					name: epicDir.name,
					filePath: epicMdPath,
					matchCount,
				});
			}
		}
	} catch {
		// epics directory doesn't exist or can't be read
	}

	return results;
}

export async function searchTasks(
	query: string,
	epicsDir = ".claude/epics",
	limit = 10
): Promise<TaskSearchResult[]> {
	const results: TaskSearchResult[] = [];

	try {
		const epicDirs = await readdir(epicsDir, { withFileTypes: true });

		for (const epicDir of epicDirs) {
			if (!epicDir.isDirectory()) {
				continue;
			}

			const epicPath = join(epicsDir, epicDir.name);
			const files = await readdir(epicPath);

			for (const file of files) {
				// Only search numbered task files
				if (!/^\d+\.md$/.test(file)) {
					continue;
				}

				const filePath = join(epicPath, file);
				const content = await readFileContent(filePath);

				if (!content) {
					continue;
				}

				const matchCount = countMatches(content, query);

				if (matchCount > 0) {
					results.push({
						name: basename(file, ".md"),
						epicName: epicDir.name,
						taskNumber: basename(file, ".md"),
						filePath,
						matchCount,
					});

					// Limit results to avoid overwhelming output
					if (results.length >= limit) {
						return results;
					}
				}
			}
		}
	} catch {
		// epics directory doesn't exist or can't be read
	}

	return results;
}
