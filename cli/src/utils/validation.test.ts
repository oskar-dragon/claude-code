import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import {
	checkDataIntegrity,
	checkDirectoryStructure,
	checkFrontmatter,
	checkReferences,
	validatePmSystem,
} from "./validation.ts";

const TEST_DIR = ".test-validation";

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

test("checkDirectoryStructure detects missing required directories", async () => {
	const result = await checkDirectoryStructure();

	expect(result.errors).toBeGreaterThan(0);
	expect(result.messages.some((m) => m.type === "error")).toBe(true);
});

test("checkDirectoryStructure succeeds with all directories", async () => {
	await mkdir(".claude/prds", { recursive: true });
	await mkdir(".claude/epics", { recursive: true });
	await mkdir(".claude/rules", { recursive: true });

	const result = await checkDirectoryStructure();

	expect(result.errors).toBe(0);
	expect(result.messages.some((m) => m.type === "success")).toBe(true);
});

test("checkDataIntegrity detects missing epic.md files", async () => {
	await mkdir(".claude/epics/test-epic", { recursive: true });

	const result = await checkDataIntegrity();

	expect(result.warnings).toBeGreaterThan(0);
	expect(result.messages.some((m) => m.message.includes("Missing epic.md"))).toBe(true);
});

test("checkDataIntegrity succeeds with proper epic structure", async () => {
	await mkdir(".claude/epics/test-epic", { recursive: true });
	await writeFile(".claude/epics/test-epic/epic.md", "# Epic\n", "utf-8");

	const result = await checkDataIntegrity();

	expect(result.warnings).toBe(0);
});

test("checkDataIntegrity detects orphaned task files", async () => {
	await mkdir(".claude/epics", { recursive: true });
	await mkdir(".claude/tasks", { recursive: true });
	await writeFile(".claude/tasks/123.md", "task content", "utf-8");

	const result = await checkDataIntegrity();

	expect(result.warnings).toBeGreaterThan(0);
	expect(result.messages.some((m) => m.message.includes("orphaned task files"))).toBe(true);
});

test("checkReferences detects broken task dependencies", async () => {
	await mkdir(".claude/epics/test-epic", { recursive: true });
	await writeFile(
		".claude/epics/test-epic/1.md",
		"---\ntitle: Task 1\n---\ndepends_on: [2]\n",
		"utf-8"
	);

	const result = await checkReferences();

	expect(result.warnings).toBeGreaterThan(0);
	expect(result.messages.some((m) => m.message.includes("references missing task"))).toBe(true);
});

test("checkReferences succeeds with valid dependencies", async () => {
	await mkdir(".claude/epics/test-epic", { recursive: true });
	await writeFile(
		".claude/epics/test-epic/1.md",
		"---\ntitle: Task 1\n---\ndepends_on: [2]\n",
		"utf-8"
	);
	await writeFile(".claude/epics/test-epic/2.md", "---\ntitle: Task 2\n---\n", "utf-8");

	const result = await checkReferences();

	expect(result.warnings).toBe(0);
	expect(result.messages.some((m) => m.type === "success")).toBe(true);
});

test("checkFrontmatter detects missing frontmatter", async () => {
	await mkdir(".claude/epics/test-epic", { recursive: true });
	await writeFile(".claude/epics/test-epic/epic.md", "# No frontmatter\n", "utf-8");

	const result = await checkFrontmatter();

	expect(result.invalid).toBeGreaterThan(0);
	expect(result.messages.some((m) => m.message.includes("Missing frontmatter"))).toBe(true);
});

test("checkFrontmatter succeeds with valid frontmatter", async () => {
	await mkdir(".claude/epics/test-epic", { recursive: true });
	await writeFile(".claude/epics/test-epic/epic.md", "---\ntitle: Epic\n---\nContent\n", "utf-8");

	const result = await checkFrontmatter();

	expect(result.invalid).toBe(0);
	expect(result.messages.some((m) => m.type === "success")).toBe(true);
});

test("validatePmSystem combines all validation results", async () => {
	await mkdir(".claude/prds", { recursive: true });
	await mkdir(".claude/epics/test-epic", { recursive: true });
	await mkdir(".claude/rules", { recursive: true });
	await writeFile(".claude/epics/test-epic/epic.md", "---\ntitle: Epic\n---\n", "utf-8");

	const result = await validatePmSystem();

	expect(result.errors).toBe(0);
	expect(result.warnings).toBe(0);
	expect(result.invalid).toBe(0);
});
