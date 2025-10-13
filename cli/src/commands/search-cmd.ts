import { buildCommand } from "@stricli/core";
import { searchEpics, searchPrds, searchTasks } from "../utils/search.ts";

async function searchCommand(_context: unknown, query: string): Promise<void> {
	console.log(`Searching for '${query}'...`);
	console.log("");
	console.log("");

	console.log(`🔍 Search results for: '${query}'`);
	console.log("================================");
	console.log("");

	// Search PRDs
	console.log("📄 PRDs:");
	const prdResults = await searchPrds(query);
	if (prdResults.length > 0) {
		for (const result of prdResults) {
			console.log(`  • ${result.name} (${result.matchCount} matches)`);
		}
	} else {
		console.log("  No matches");
	}
	console.log("");

	// Search Epics
	console.log("📚 Epics:");
	const epicResults = await searchEpics(query);
	if (epicResults.length > 0) {
		for (const result of epicResults) {
			console.log(`  • ${result.name} (${result.matchCount} matches)`);
		}
	} else {
		console.log("  No matches");
	}
	console.log("");

	// Search Tasks
	console.log("📝 Tasks:");
	const taskResults = await searchTasks(query);
	if (taskResults.length > 0) {
		for (const result of taskResults) {
			console.log(`  • Task #${result.taskNumber} in ${result.epicName}`);
		}
	} else {
		console.log("  No matches");
	}

	// Summary
	const totalMatches = prdResults.length + epicResults.length + taskResults.length;
	console.log("");
	console.log(`📊 Total files with matches: ${totalMatches}`);
}

export const command = buildCommand({
	func: searchCommand,
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [
				{
					brief: "Search query",
					parse: String,
				},
			],
		},
	},
	docs: {
		brief: "Search across PRDs, epics, and tasks",
	},
});
