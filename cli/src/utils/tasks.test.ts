import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { getBlockedTasks, getTaskDependencies, getTaskName, getTaskStatus } from "./tasks.ts";

const TEST_DIR = ".test-tasks";

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

test("getTaskStatus returns empty string for non-existent file", async () => {
	const status = await getTaskStatus("non-existent.md");
	expect(status).toBe("");
});

test("getTaskStatus extracts status from frontmatter", async () => {
	await writeFile("task.md", "---\nstatus: open\n---\nContent", "utf-8");
	const status = await getTaskStatus("task.md");
	expect(status).toBe("open");
});

test("getTaskName extracts name from frontmatter", async () => {
	await writeFile("task.md", "---\nname: Test Task\n---\nContent", "utf-8");
	const name = await getTaskName("task.md");
	expect(name).toBe("Test Task");
});

test("getTaskDependencies returns empty array for no dependencies", async () => {
	await writeFile("task.md", "---\nname: Test\n---\nContent", "utf-8");
	const deps = await getTaskDependencies("task.md");
	expect(deps).toEqual([]);
});

test("getTaskDependencies parses single dependency", async () => {
	await writeFile("task.md", "---\ndepends_on: [1]\n---\nContent", "utf-8");
	const deps = await getTaskDependencies("task.md");
	expect(deps).toEqual(["1"]);
});

test("getTaskDependencies parses multiple dependencies", async () => {
	await writeFile("task.md", "---\ndepends_on: [1, 2, 3]\n---\nContent", "utf-8");
	const deps = await getTaskDependencies("task.md");
	expect(deps).toEqual(["1", "2", "3"]);
});

test("getBlockedTasks returns empty array when no epics exist", async () => {
	const tasks = await getBlockedTasks();
	expect(tasks).toEqual([]);
});

test("getBlockedTasks finds blocked task with open dependency", async () => {
	await mkdir(".claude/epics/test-epic", { recursive: true });

	// Task 2 depends on task 1, and task 1 is open
	await writeFile(
		".claude/epics/test-epic/1.md",
		"---\nname: First Task\nstatus: open\n---\nContent",
		"utf-8"
	);
	await writeFile(
		".claude/epics/test-epic/2.md",
		"---\nname: Second Task\nstatus: open\ndepends_on: [1]\n---\nContent",
		"utf-8"
	);

	const tasks = await getBlockedTasks();
	expect(tasks).toHaveLength(1);
	expect(tasks[0]?.id).toBe("2");
	expect(tasks[0]?.name).toBe("Second Task");
	expect(tasks[0]?.epicName).toBe("test-epic");
	expect(tasks[0]?.dependencies).toEqual(["1"]);
	expect(tasks[0]?.openDependencies).toEqual(["1"]);
});

test("getBlockedTasks excludes tasks with completed dependencies", async () => {
	await mkdir(".claude/epics/test-epic", { recursive: true });

	// Task 2 depends on task 1, but task 1 is done
	await writeFile(
		".claude/epics/test-epic/1.md",
		"---\nname: First Task\nstatus: done\n---\nContent",
		"utf-8"
	);
	await writeFile(
		".claude/epics/test-epic/2.md",
		"---\nname: Second Task\nstatus: open\ndepends_on: [1]\n---\nContent",
		"utf-8"
	);

	const tasks = await getBlockedTasks();
	// Task 2 should still appear because it has dependencies, but openDependencies should be empty
	expect(tasks).toHaveLength(1);
	expect(tasks[0]?.openDependencies).toEqual([]);
});

test("getBlockedTasks excludes completed tasks", async () => {
	await mkdir(".claude/epics/test-epic", { recursive: true });

	await writeFile(
		".claude/epics/test-epic/1.md",
		"---\nname: First Task\nstatus: open\n---\nContent",
		"utf-8"
	);
	await writeFile(
		".claude/epics/test-epic/2.md",
		"---\nname: Second Task\nstatus: done\ndepends_on: [1]\n---\nContent",
		"utf-8"
	);

	const tasks = await getBlockedTasks();
	expect(tasks).toHaveLength(0);
});

test("getBlockedTasks excludes tasks without dependencies", async () => {
	await mkdir(".claude/epics/test-epic", { recursive: true });

	await writeFile(
		".claude/epics/test-epic/1.md",
		"---\nname: Independent Task\nstatus: open\n---\nContent",
		"utf-8"
	);

	const tasks = await getBlockedTasks();
	expect(tasks).toHaveLength(0);
});

test("getBlockedTasks handles multiple epics", async () => {
	await mkdir(".claude/epics/epic-1", { recursive: true });
	await mkdir(".claude/epics/epic-2", { recursive: true });

	await writeFile(".claude/epics/epic-1/1.md", "---\nname: Task 1\nstatus: open\n---\n", "utf-8");
	await writeFile(
		".claude/epics/epic-1/2.md",
		"---\nname: Task 2\nstatus: open\ndepends_on: [1]\n---\n",
		"utf-8"
	);

	await writeFile(".claude/epics/epic-2/1.md", "---\nname: Task 1\nstatus: open\n---\n", "utf-8");
	await writeFile(
		".claude/epics/epic-2/2.md",
		"---\nname: Task 2\nstatus: open\ndepends_on: [1]\n---\n",
		"utf-8"
	);

	const tasks = await getBlockedTasks();
	expect(tasks).toHaveLength(2);
	expect(tasks.some((t) => t.epicName === "epic-1")).toBe(true);
	expect(tasks.some((t) => t.epicName === "epic-2")).toBe(true);
});
