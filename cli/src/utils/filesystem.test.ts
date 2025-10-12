import { afterEach, beforeEach, expect, test } from "bun:test";
import { access, mkdir, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { createClaudeMd, createDirectoryStructure, fileExists } from "./filesystem.ts";

const TEST_DIR = ".test-fs";

beforeEach(async () => {
	// Clean up test directory before each test
	try {
		await rm(TEST_DIR, { recursive: true });
	} catch {
		// Directory doesn't exist, ignore
	}
	await mkdir(TEST_DIR);
	process.chdir(TEST_DIR);
});

afterEach(async () => {
	// Clean up test directory after each test
	process.chdir("..");
	try {
		await rm(TEST_DIR, { recursive: true });
	} catch {
		// Ignore cleanup errors
	}
});

test("createDirectoryStructure creates all required directories", async () => {
	await createDirectoryStructure();

	// Check that all directories exist
	const directories = [
		".claude/prds",
		".claude/epics",
		".claude/rules",
		".claude/agents",
		".claude/scripts/pm",
	];

	for (const dir of directories) {
		try {
			await access(dir);
			expect(true).toBe(true); // Directory exists
		} catch {
			expect(false).toBe(true); // Directory doesn't exist - fail test
		}
	}
});

test("createClaudeMd creates file when it doesn't exist", async () => {
	const created = await createClaudeMd();

	expect(created).toBe(true);

	const content = await readFile("CLAUDE.md", "utf-8");
	expect(content).toContain("# CLAUDE.md");
	expect(content).toContain("## Project-Specific Instructions");
	expect(content).toContain("## Testing");
	expect(content).toContain("## Code Style");
});

test("createClaudeMd doesn't overwrite existing file", async () => {
	// Create file first
	const firstCreated = await createClaudeMd();
	expect(firstCreated).toBe(true);

	// Try to create again
	const secondCreated = await createClaudeMd();
	expect(secondCreated).toBe(false);
});

test("fileExists returns true for existing file", async () => {
	await createClaudeMd();
	const exists = await fileExists("CLAUDE.md");
	expect(exists).toBe(true);
});

test("fileExists returns false for non-existing file", async () => {
	const exists = await fileExists("nonexistent.txt");
	expect(exists).toBe(false);
});
