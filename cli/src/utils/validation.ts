import { access, readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

export type ValidationResult = {
	errors: number;
	warnings: number;
	invalid: number;
	messages: Array<{
		type: "error" | "warning" | "info" | "success";
		message: string;
	}>;
};

type DirectoryCheckResult = {
	exists: boolean;
	required: boolean;
};

export async function checkDirectoryStructure(): Promise<ValidationResult> {
	const result: ValidationResult = {
		errors: 0,
		warnings: 0,
		invalid: 0,
		messages: [],
	};

	const directories: Array<[string, boolean]> = [
		[".claude", true],
		[".claude/prds", false],
		[".claude/epics", false],
		[".claude/rules", false],
	];

	for (const [dir, required] of directories) {
		try {
			await access(dir);
			const stats = await stat(dir);
			if (stats.isDirectory()) {
				result.messages.push({
					type: "success",
					message: `${dir} directory exists`,
				});
			} else if (required) {
				result.errors++;
				result.messages.push({
					type: "error",
					message: `${dir} exists but is not a directory`,
				});
			} else {
				result.warnings++;
				result.messages.push({
					type: "warning",
					message: `${dir} exists but is not a directory`,
				});
			}
		} catch {
			if (required) {
				result.errors++;
				result.messages.push({
					type: "error",
					message: `${dir} directory missing`,
				});
			} else {
				result.messages.push({
					type: "warning",
					message: `${dir} directory missing`,
				});
			}
		}
	}

	return result;
}

async function readDirRecursive(
	dir: string,
	filter?: (file: string) => boolean
): Promise<string[]> {
	const files: string[] = [];

	try {
		const entries = await readdir(dir, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = join(dir, entry.name);

			if (entry.isDirectory()) {
				const subFiles = await readDirRecursive(fullPath, filter);
				files.push(...subFiles);
			} else if (!filter || filter(fullPath)) {
				files.push(fullPath);
			}
		}
	} catch {
		// Directory doesn't exist or can't be read
	}

	return files;
}

export async function checkDataIntegrity(): Promise<ValidationResult> {
	const result: ValidationResult = {
		errors: 0,
		warnings: 0,
		invalid: 0,
		messages: [],
	};

	try {
		// Check epics have epic.md files
		const epicDirs = await readdir(".claude/epics", { withFileTypes: true });

		for (const entry of epicDirs) {
			if (entry.isDirectory()) {
				const epicMdPath = join(".claude/epics", entry.name, "epic.md");
				try {
					await access(epicMdPath);
				} catch {
					result.warnings++;
					result.messages.push({
						type: "warning",
						message: `Missing epic.md in ${entry.name}`,
					});
				}
			}
		}

		// Check for orphaned task files (task files not under .claude/epics/*/*)
		const allTaskFiles = await readDirRecursive(".claude", (file) => /\/\d+\.md$/.test(file));

		const orphanedTasks = allTaskFiles.filter((file) => {
			// Task files should be in .claude/epics/*/[0-9]*.md
			return !/\.claude\/epics\/[^/]+\/\d+\.md$/.test(file);
		});

		if (orphanedTasks.length > 0) {
			result.warnings++;
			result.messages.push({
				type: "warning",
				message: `Found ${orphanedTasks.length} orphaned task files`,
			});
		}
	} catch {
		// .claude/epics doesn't exist, skip checks
	}

	return result;
}

async function extractDependencies(taskFile: string): Promise<string[]> {
	try {
		const content = await readFile(taskFile, "utf-8");
		const lines = content.split("\n");

		for (const line of lines) {
			if (line.startsWith("depends_on:")) {
				const depsString = line
					.replace(/^depends_on:\s*/, "")
					.replace(/^\[/, "")
					.replace(/\]$/, "")
					.trim();

				if (!depsString || depsString === "depends_on:") {
					return [];
				}

				return depsString
					.split(",")
					.map((dep) => dep.trim())
					.filter((dep) => dep.length > 0);
			}
		}
	} catch {
		// Can't read file
	}

	return [];
}

export async function checkReferences(): Promise<ValidationResult> {
	const result: ValidationResult = {
		errors: 0,
		warnings: 0,
		invalid: 0,
		messages: [],
	};

	try {
		// Find all task files under .claude/epics/*/[0-9]*.md
		const taskFiles = await readDirRecursive(".claude/epics", (file) => /\/\d+\.md$/.test(file));

		let hasValidReferences = true;

		for (const taskFile of taskFiles) {
			const deps = await extractDependencies(taskFile);

			if (deps.length > 0) {
				const epicDir = taskFile.substring(0, taskFile.lastIndexOf("/"));

				for (const dep of deps) {
					const depPath = join(epicDir, `${dep}.md`);

					try {
						await access(depPath);
					} catch {
						hasValidReferences = false;
						result.warnings++;
						const taskId = taskFile.split("/").pop()?.replace(".md", "");
						result.messages.push({
							type: "warning",
							message: `Task ${taskId} references missing task: ${dep}`,
						});
					}
				}
			}
		}

		if (hasValidReferences && taskFiles.length > 0) {
			result.messages.push({
				type: "success",
				message: "All references valid",
			});
		}
	} catch {
		// .claude/epics doesn't exist, skip checks
	}

	return result;
}

export async function checkFrontmatter(): Promise<ValidationResult> {
	const result: ValidationResult = {
		errors: 0,
		warnings: 0,
		invalid: 0,
		messages: [],
	};

	try {
		// Find all markdown files in .claude/epics and .claude/prds
		const epicFiles = await readDirRecursive(".claude/epics", (file) => file.endsWith(".md"));
		const prdFiles = await readDirRecursive(".claude/prds", (file) => file.endsWith(".md"));

		const allFiles = [...epicFiles, ...prdFiles];

		for (const file of allFiles) {
			try {
				const content = await readFile(file, "utf-8");
				if (!content.startsWith("---")) {
					result.invalid++;
					const fileName = file.split("/").pop();
					result.messages.push({
						type: "warning",
						message: `Missing frontmatter: ${fileName}`,
					});
				}
			} catch {
				// Can't read file
			}
		}

		if (result.invalid === 0 && allFiles.length > 0) {
			result.messages.push({
				type: "success",
				message: "All files have frontmatter",
			});
		}
	} catch {
		// Directories don't exist, skip checks
	}

	return result;
}

export async function validatePmSystem(): Promise<ValidationResult> {
	const results = await Promise.all([
		checkDirectoryStructure(),
		checkDataIntegrity(),
		checkReferences(),
		checkFrontmatter(),
	]);

	const combined: ValidationResult = {
		errors: 0,
		warnings: 0,
		invalid: 0,
		messages: [],
	};

	for (const result of results) {
		combined.errors += result.errors;
		combined.warnings += result.warnings;
		combined.invalid += result.invalid;
		combined.messages.push(...result.messages);
	}

	return combined;
}
