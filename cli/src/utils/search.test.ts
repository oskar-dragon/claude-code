import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { searchEpics, searchPrds, searchTasks } from "./search.ts";

const TEST_DIR = ".test-search";
const CLAUDE_DIR = join(TEST_DIR, ".claude");
const PRDS_DIR = join(CLAUDE_DIR, "prds");
const EPICS_DIR = join(CLAUDE_DIR, "epics");

beforeEach(async () => {
	await mkdir(PRDS_DIR, { recursive: true });
	await mkdir(EPICS_DIR, { recursive: true });
});

afterEach(async () => {
	await rm(TEST_DIR, { recursive: true, force: true });
});

describe("searchPrds", () => {
	test("finds case-insensitive matches in PRDs", async () => {
		await writeFile(
			join(PRDS_DIR, "feature-a.md"),
			"name: Feature A\nImplement authentication system"
		);
		await writeFile(join(PRDS_DIR, "feature-b.md"), "name: Feature B\nAdd user profile page");

		const results = await searchPrds("authentication", PRDS_DIR);

		expect(results).toHaveLength(1);
		expect(results[0]?.name).toBe("feature-a");
		expect(results[0]?.matchCount).toBe(1);
	});

	test("counts multiple matches in same file", async () => {
		await writeFile(join(PRDS_DIR, "test.md"), "name: Test\ntest test TEST\nAnother test line");

		const results = await searchPrds("test", PRDS_DIR);

		expect(results).toHaveLength(1);
		expect(results[0]?.matchCount).toBe(5); // test, test, test, TEST, test
	});

	test("returns empty array when no matches", async () => {
		await writeFile(join(PRDS_DIR, "no-match.md"), "name: No Match\nSomething");

		const results = await searchPrds("nonexistent", PRDS_DIR);

		expect(results).toEqual([]);
	});

	test("returns empty array when directory doesn't exist", async () => {
		const results = await searchPrds("query", join(TEST_DIR, "nonexistent"));

		expect(results).toEqual([]);
	});
});

describe("searchEpics", () => {
	test("finds matches in epic.md files", async () => {
		const epic1 = join(EPICS_DIR, "epic-one");
		const epic2 = join(EPICS_DIR, "epic-two");
		await mkdir(epic1, { recursive: true });
		await mkdir(epic2, { recursive: true });
		await writeFile(join(epic1, "epic.md"), "name: Epic One\nImplement authentication");
		await writeFile(join(epic2, "epic.md"), "name: Epic Two\nAdd user profiles");

		const results = await searchEpics("authentication", EPICS_DIR);

		expect(results).toHaveLength(1);
		expect(results[0]?.name).toBe("epic-one");
		expect(results[0]?.matchCount).toBe(1);
	});

	test("searches case-insensitively", async () => {
		const epic = join(EPICS_DIR, "test-epic");
		await mkdir(epic, { recursive: true });
		await writeFile(join(epic, "epic.md"), "AUTHENTICATION auth AUTH");

		const results = await searchEpics("authentication", EPICS_DIR);

		expect(results).toHaveLength(1);
		expect(results[0]?.matchCount).toBe(1); // Only the exact word AUTHENTICATION
	});

	test("returns empty array when no epic.md files match", async () => {
		const epic = join(EPICS_DIR, "test-epic");
		await mkdir(epic, { recursive: true });
		await writeFile(join(epic, "epic.md"), "name: Test\nNo match here");

		const results = await searchEpics("nonexistent", EPICS_DIR);

		expect(results).toEqual([]);
	});
});

describe("searchTasks", () => {
	test("finds matches in task files", async () => {
		const epic = join(EPICS_DIR, "test-epic");
		await mkdir(epic, { recursive: true });
		await writeFile(join(epic, "epic.md"), "name: Test Epic");
		await writeFile(join(epic, "1.md"), "name: Task One\nImplement login authentication");
		await writeFile(join(epic, "2.md"), "name: Task Two\nAdd user profile");

		const results = await searchTasks("authentication", EPICS_DIR);

		expect(results).toHaveLength(1);
		expect(results[0]?.epicName).toBe("test-epic");
		expect(results[0]?.taskNumber).toBe("1");
	});

	test("limits results to 10", async () => {
		const epic = join(EPICS_DIR, "test-epic");
		await mkdir(epic, { recursive: true });
		await writeFile(join(epic, "epic.md"), "name: Test Epic");

		// Create 15 matching tasks
		for (let i = 1; i <= 15; i++) {
			await writeFile(join(epic, `${i}.md`), "test match");
		}

		const results = await searchTasks("test", EPICS_DIR);

		expect(results).toHaveLength(10);
	});

	test("only searches numbered .md files", async () => {
		const epic = join(EPICS_DIR, "test-epic");
		await mkdir(epic, { recursive: true });
		await writeFile(join(epic, "epic.md"), "test");
		await writeFile(join(epic, "1.md"), "test");
		await writeFile(join(epic, "notes.md"), "test");
		await writeFile(join(epic, "README.md"), "test");

		const results = await searchTasks("test", EPICS_DIR);

		expect(results).toHaveLength(1);
		expect(results[0]?.taskNumber).toBe("1");
	});

	test("returns empty array when no matches", async () => {
		const epic = join(EPICS_DIR, "test-epic");
		await mkdir(epic, { recursive: true });
		await writeFile(join(epic, "1.md"), "name: Task\nNo match");

		const results = await searchTasks("nonexistent", EPICS_DIR);

		expect(results).toEqual([]);
	});
});
