import { buildCommand } from "@stricli/core";
import { getPrds } from "../utils/prds.ts";

async function prdStatusCommand(): Promise<void> {
	console.log("Getting status...");
	console.log("");
	console.log("");

	console.log("📄 PRD Status Report");
	console.log("====================");
	console.log("");

	const prds = await getPrds();

	if (prds.length === 0) {
		console.log("No PRDs found.");
		return;
	}

	// Count by status
	let backlogCount = 0;
	let inProgressCount = 0;
	let implementedCount = 0;

	for (const prd of prds) {
		const status = prd.status.toLowerCase();
		if (status === "backlog" || status === "draft" || status === "" || !status) {
			backlogCount++;
		} else if (status === "in-progress" || status === "active") {
			inProgressCount++;
		} else if (status === "implemented" || status === "completed" || status === "done") {
			implementedCount++;
		} else {
			backlogCount++; // default unknown to backlog
		}
	}

	// Display chart
	console.log("📊 Distribution:");
	console.log("================");
	console.log("");

	const total = prds.length;
	const backlogBars = Math.floor((backlogCount * 20) / total);
	const inProgressBars = Math.floor((inProgressCount * 20) / total);
	const implementedBars = Math.floor((implementedCount * 20) / total);

	console.log(`  Backlog:     ${String(backlogCount).padStart(3)} [${"█".repeat(backlogBars)}]`);
	console.log(
		`  In Progress: ${String(inProgressCount).padStart(3)} [${"█".repeat(inProgressBars)}]`
	);
	console.log(
		`  Implemented: ${String(implementedCount).padStart(3)} [${"█".repeat(implementedBars)}]`
	);
	console.log("");
	console.log(`  Total PRDs: ${total}`);

	// Recent activity (last 5 modified)
	console.log("");
	console.log("📅 Recent PRDs (last 5 modified):");

	// Sort by path (newest first based on filesystem)
	const sortedPrds = [...prds].sort((a, b) => b.filePath.localeCompare(a.filePath)).slice(0, 5);

	for (const prd of sortedPrds) {
		console.log(`  • ${prd.name}`);
	}

	// Suggestions
	console.log("");
	console.log("💡 Next Actions:");
	if (backlogCount > 0) {
		console.log("  • Parse backlog PRDs to epics: /pm:prd-parse <name>");
	}
	if (inProgressCount > 0) {
		console.log("  • Check progress on active PRDs: /pm:epic-status <name>");
	}
	if (total === 0) {
		console.log("  • Create your first PRD: /pm:prd-new <name>");
	}
}

export const command = buildCommand({
	func: prdStatusCommand,
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [],
		},
	},
	docs: {
		brief: "Show PRD status report with distribution chart",
	},
});
