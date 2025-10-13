import { buildCommand } from "@stricli/core";
import { getPrdsByStatus } from "../utils/prds.ts";

async function prdListCommand(): Promise<void> {
	const grouped = await getPrdsByStatus();
	const totalPrds = grouped.backlog.length + grouped.inProgress.length + grouped.implemented.length;

	if (totalPrds === 0) {
		console.log('📁 No PRDs found. Create your first PRD with: /pm:prd-new <feature-name>"');
		return;
	}

	console.log("Getting PRDs...");
	console.log("");
	console.log("");

	console.log("📋 PRD List");
	console.log("===========");
	console.log("");

	// Backlog PRDs
	console.log("🔍 Backlog PRDs:");
	if (grouped.backlog.length > 0) {
		for (const prd of grouped.backlog) {
			console.log(`   📋 ${prd.filePath} - ${prd.description}`);
		}
	} else {
		console.log("   (none)");
	}

	console.log("");

	// In-Progress PRDs
	console.log("🔄 In-Progress PRDs:");
	if (grouped.inProgress.length > 0) {
		for (const prd of grouped.inProgress) {
			console.log(`   📋 ${prd.filePath} - ${prd.description}`);
		}
	} else {
		console.log("   (none)");
	}

	console.log("");

	// Implemented PRDs
	console.log("✅ Implemented PRDs:");
	if (grouped.implemented.length > 0) {
		for (const prd of grouped.implemented) {
			console.log(`   📋 ${prd.filePath} - ${prd.description}`);
		}
	} else {
		console.log("   (none)");
	}

	// Summary
	console.log("");
	console.log("📊 PRD Summary");
	console.log(`   Total PRDs: ${totalPrds}`);
	console.log(`   Backlog: ${grouped.backlog.length}`);
	console.log(`   In-Progress: ${grouped.inProgress.length}`);
	console.log(`   Implemented: ${grouped.implemented.length}`);
}

export const command = buildCommand({
	func: prdListCommand,
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [],
		},
	},
	docs: {
		brief: "List all PRDs grouped by status",
	},
});
