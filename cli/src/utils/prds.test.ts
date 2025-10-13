import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getPrdMetadata, getPrds, getPrdsByStatus } from "./prds.ts";

const TEST_DIR = ".test-prds";
const PRDS_DIR = join(TEST_DIR, ".claude", "prds");

beforeEach(async () => {
	await mkdir(PRDS_DIR, { recursive: true });
});

afterEach(async () => {
	await rm(TEST_DIR, { recursive: true, force: true });
});

describe("getPrdMetadata", () => {
	test("extracts basic prd metadata", async () => {
		const prdPath = join(PRDS_DIR, "test-prd.md");
		await writeFile(
			prdPath,
			`name: Test PRD
description: A test product requirement document
status: backlog

# Test PRD
Content here`
		);

		const metadata = await getPrdMetadata(prdPath);

		expect(metadata.name).toBe("Test PRD");
		expect(metadata.description).toBe("A test product requirement document");
		expect(metadata.status).toBe("backlog");
	});

	test("uses filename as fallback for missing name", async () => {
		const prdPath = join(PRDS_DIR, "fallback-prd.md");
		await writeFile(
			prdPath,
			`status: in-progress

# Description`
		);

		const metadata = await getPrdMetadata(prdPath);

		expect(metadata.name).toBe("fallback-prd");
	});

	test("defaults description if missing", async () => {
		const prdPath = join(PRDS_DIR, "no-desc.md");
		await writeFile(
			prdPath,
			`name: No Description
status: backlog`
		);

		const metadata = await getPrdMetadata(prdPath);

		expect(metadata.description).toBe("No description");
	});

	test("defaults status to backlog if missing", async () => {
		const prdPath = join(PRDS_DIR, "no-status.md");
		await writeFile(prdPath, "name: No Status\n");

		const metadata = await getPrdMetadata(prdPath);

		expect(metadata.status).toBe("backlog");
	});
});

describe("getPrds", () => {
	test("returns all prds", async () => {
		for (const name of ["prd1.md", "prd2.md", "prd3.md"]) {
			await writeFile(join(PRDS_DIR, name), `name: ${name}\n`);
		}

		const prds = await getPrds(PRDS_DIR);

		expect(prds).toHaveLength(3);
	});

	test("returns empty array when no prds directory exists", async () => {
		const prds = await getPrds(join(TEST_DIR, "nonexistent"));

		expect(prds).toEqual([]);
	});

	test("only includes .md files", async () => {
		await writeFile(join(PRDS_DIR, "valid.md"), "name: Valid\n");
		await writeFile(join(PRDS_DIR, "invalid.txt"), "not a prd");
		await writeFile(join(PRDS_DIR, "README.md"), "name: README\n");

		const prds = await getPrds(PRDS_DIR);

		expect(prds).toHaveLength(2);
		expect(prds.map((p) => p.name)).toContain("Valid");
		expect(prds.map((p) => p.name)).toContain("README");
	});
});

describe("getPrdsByStatus", () => {
	test("groups prds by status", async () => {
		const statuses = [
			["backlog", "prd1.md"],
			["in-progress", "prd2.md"],
			["implemented", "prd3.md"],
			["backlog", "prd4.md"],
		] as const;

		for (const [status, name] of statuses) {
			await writeFile(join(PRDS_DIR, name), `name: ${name}\nstatus: ${status}\n`);
		}

		const grouped = await getPrdsByStatus(PRDS_DIR);

		expect(grouped.backlog).toHaveLength(2);
		expect(grouped.inProgress).toHaveLength(1);
		expect(grouped.implemented).toHaveLength(1);
	});

	test("handles various status aliases", async () => {
		const statuses = [
			["draft", "prd1.md"],
			["active", "prd2.md"],
			["completed", "prd3.md"],
			["done", "prd4.md"],
		] as const;

		for (const [status, name] of statuses) {
			await writeFile(join(PRDS_DIR, name), `name: ${name}\nstatus: ${status}\n`);
		}

		const grouped = await getPrdsByStatus(PRDS_DIR);

		expect(grouped.backlog).toHaveLength(1); // draft
		expect(grouped.inProgress).toHaveLength(1); // active
		expect(grouped.implemented).toHaveLength(2); // completed, done
	});

	test("defaults empty status to backlog", async () => {
		await writeFile(join(PRDS_DIR, "no-status.md"), "name: No Status\n");

		const grouped = await getPrdsByStatus(PRDS_DIR);

		expect(grouped.backlog).toHaveLength(1);
	});
});
