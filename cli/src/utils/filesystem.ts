import { access, mkdir, writeFile } from "node:fs/promises";

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
	const directories = [".claude/prds", ".claude/epics", ".claude/rules"];

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

const RULES_TO_FETCH = [
	"github-operations.md",
	"worktree-operations.md",
	"path-standards.md",
	"test-execution.md",
	"datetime.md",
	"strip-frontmatter.md",
	"agent-coordination.md",
	"branch-operations.md",
	"frontmatter-operations.md",
	"standard-patterns.md",
	"use-ast-grep.md",
];

const GITHUB_RULES_BASE_URL =
	"https://raw.githubusercontent.com/oskar-dragon/claude-code/main/plugins/flow/rules";

export async function copyRulesFromGithub(): Promise<{
	success: boolean;
	count: number;
	errors: string[];
}> {
	const errors: string[] = [];
	let successCount = 0;

	for (const ruleName of RULES_TO_FETCH) {
		try {
			const url = `${GITHUB_RULES_BASE_URL}/${ruleName}`;
			const response = await fetch(url);

			if (!response.ok) {
				errors.push(`${ruleName}: HTTP ${response.status}`);
				continue;
			}

			const content = await response.text();
			const filePath = `.claude/rules/${ruleName}`;

			await writeFile(filePath, content, "utf-8");
			successCount++;
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			errors.push(`${ruleName}: ${message}`);
		}
	}

	return {
		success: successCount > 0,
		count: successCount,
		errors,
	};
}
