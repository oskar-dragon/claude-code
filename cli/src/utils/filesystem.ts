import { access, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const CLAUDE_MD_TEMPLATE = `# CLAUDE.md

> Think carefully and implement the most concise solution that changes as little code as possible.

## Project-Specific Instructions

Add your project-specific instructions here.

## Testing

Always run tests before committing:
- \`npm test\` or equivalent for your stack

## Code Style

Follow existing patterns in the codebase.
`;

export async function createDirectoryStructure(): Promise<void> {
	const directories = [
		".claude/prds",
		".claude/epics",
		".claude/rules",
		".claude/agents",
		".claude/scripts/pm",
	];

	await Promise.all(directories.map((dir) => mkdir(dir, { recursive: true })));
}

export async function createClaudeMd(): Promise<boolean> {
	const filePath = "CLAUDE.md";

	try {
		await access(filePath);
		return false; // File already exists
	} catch {
		await writeFile(filePath, CLAUDE_MD_TEMPLATE, "utf-8");
		return true; // File created
	}
}

export async function fileExists(filePath: string): Promise<boolean> {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}
