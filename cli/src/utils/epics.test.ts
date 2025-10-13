import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getEpicMetadata, getEpics, getEpicsByStatus } from "./epics.ts";

const TEST_DIR = ".test-epics";
const EPICS_DIR = join(TEST_DIR, ".claude", "epics");

beforeEach(async () => {
	await mkdir(EPICS_DIR, { recursive: true });
});

afterEach(async () => {
	await rm(TEST_DIR, { recursive: true, force: true });
});

describe("getEpicMetadata", () => {
	test("extracts basic epic metadata", async () => {
		const epicDir = join(EPICS_DIR, "test-epic");
		await mkdir(epicDir, { recursive: true });
		await writeFile(
			join(epicDir, "epic.md"),
			`name: Test Epic
status: planning
progress: 25%
github: https://github.com/owner/repo/issues/1

# Test Epic
Description here`
		);

		const metadata = await getEpicMetadata(epicDir);

		expect(metadata.name).toBe("Test Epic");
		expect(metadata.status).toBe("planning");
		expect(metadata.progress).toBe("25%");
		expect(metadata.github).toBe("https://github.com/owner/repo/issues/1");
	});

	test("uses directory name as fallback for missing name", async () => {
		const epicDir = join(EPICS_DIR, "fallback-epic");
		await mkdir(epicDir, { recursive: true });
		await writeFile(
			join(epicDir, "epic.md"),
			`status: in-progress

# Description`
		);

		const metadata = await getEpicMetadata(epicDir);

		expect(metadata.name).toBe("fallback-epic");
	});

	test("defaults progress to 0% if missing", async () => {
		const epicDir = join(EPICS_DIR, "no-progress");
		await mkdir(epicDir, { recursive: true });
		await writeFile(
			join(epicDir, "epic.md"),
			`name: No Progress
status: planning`
		);

		const metadata = await getEpicMetadata(epicDir);

		expect(metadata.progress).toBe("0%");
	});

	test("counts tasks in epic directory", async () => {
		const epicDir = join(EPICS_DIR, "task-count");
		await mkdir(epicDir, { recursive: true });
		await writeFile(join(epicDir, "epic.md"), "name: Task Count\n");
		await writeFile(join(epicDir, "1.md"), "task 1");
		await writeFile(join(epicDir, "2.md"), "task 2");
		await writeFile(join(epicDir, "10.md"), "task 10");
		await writeFile(join(epicDir, "other.md"), "not a task");

		const metadata = await getEpicMetadata(epicDir);

		expect(metadata.taskCount).toBe(3);
	});

	test("extracts GitHub issue number", async () => {
		const epicDir = join(EPICS_DIR, "github-issue");
		await mkdir(epicDir, { recursive: true });
		await writeFile(
			join(epicDir, "epic.md"),
			`name: GitHub Epic
github: https://github.com/owner/repo/issues/42`
		);

		const metadata = await getEpicMetadata(epicDir);

		expect(metadata.githubIssueNumber).toBe("42");
	});
});

describe("getEpics", () => {
	test("returns all epics", async () => {
		// Create test epics
		for (const name of ["epic1", "epic2", "epic3"]) {
			const epicDir = join(EPICS_DIR, name);
			await mkdir(epicDir, { recursive: true });
			await writeFile(join(epicDir, "epic.md"), `name: ${name}\n`);
		}

		const epics = await getEpics(EPICS_DIR);

		expect(epics).toHaveLength(3);
		expect(epics.map((e) => e.name)).toContain("epic1");
		expect(epics.map((e) => e.name)).toContain("epic2");
		expect(epics.map((e) => e.name)).toContain("epic3");
	});

	test("returns empty array when no epics directory exists", async () => {
		const epics = await getEpics(join(TEST_DIR, "nonexistent"));

		expect(epics).toEqual([]);
	});

	test("skips directories without epic.md", async () => {
		const validEpic = join(EPICS_DIR, "valid");
		const invalidEpic = join(EPICS_DIR, "invalid");
		await mkdir(validEpic, { recursive: true });
		await mkdir(invalidEpic, { recursive: true });
		await writeFile(join(validEpic, "epic.md"), "name: Valid\n");
		// invalidEpic has no epic.md

		const epics = await getEpics(EPICS_DIR);

		expect(epics).toHaveLength(1);
		expect(epics[0]?.name).toBe("Valid");
	});
});

describe("getEpicsByStatus", () => {
	test("groups epics by status", async () => {
		const statuses = [
			["planning", "epic1"],
			["in-progress", "epic2"],
			["completed", "epic3"],
			["planning", "epic4"],
		] as const;

		for (const [status, name] of statuses) {
			const epicDir = join(EPICS_DIR, name);
			await mkdir(epicDir, { recursive: true });
			await writeFile(join(epicDir, "epic.md"), `name: ${name}\nstatus: ${status}\n`);
		}

		const grouped = await getEpicsByStatus(EPICS_DIR);

		expect(grouped.planning).toHaveLength(2);
		expect(grouped.inProgress).toHaveLength(1);
		expect(grouped.completed).toHaveLength(1);
	});

	test("handles various status aliases", async () => {
		const statuses = [
			["draft", "epic1"],
			["in_progress", "epic2"],
			["active", "epic3"],
			["done", "epic4"],
			["closed", "epic5"],
		] as const;

		for (const [status, name] of statuses) {
			const epicDir = join(EPICS_DIR, name);
			await mkdir(epicDir, { recursive: true });
			await writeFile(join(epicDir, "epic.md"), `name: ${name}\nstatus: ${status}\n`);
		}

		const grouped = await getEpicsByStatus(EPICS_DIR);

		expect(grouped.planning).toHaveLength(1); // draft
		expect(grouped.inProgress).toHaveLength(2); // in_progress, active
		expect(grouped.completed).toHaveLength(2); // done, closed
	});

	test("defaults unknown status to planning", async () => {
		const epicDir = join(EPICS_DIR, "unknown");
		await mkdir(epicDir, { recursive: true });
		await writeFile(join(epicDir, "epic.md"), "name: Unknown\nstatus: weird-status\n");

		const grouped = await getEpicsByStatus(EPICS_DIR);

		expect(grouped.planning).toHaveLength(1);
	});
});
