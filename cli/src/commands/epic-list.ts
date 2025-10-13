import { buildCommand } from "@stricli/core";
import { getEpicsByStatus } from "../utils/epics.ts";

async function epicListCommand(): Promise<void> {
	console.log("Getting epics...");
	console.log("");
	console.log("");

	const grouped = await getEpicsByStatus();
	const totalEpics = grouped.planning.length + grouped.inProgress.length + grouped.completed.length;

	if (totalEpics === 0) {
		console.log('📁 No epics found. Create your first epic with: /pm:prd-parse <feature-name>"');
		return;
	}

	console.log("📚 Project Epics");
	console.log("================");
	console.log("");

	// Planning epics
	console.log("📝 Planning:");
	if (grouped.planning.length > 0) {
		for (const epic of grouped.planning) {
			const issueInfo = epic.githubIssueNumber ? ` (#${epic.githubIssueNumber})` : "";
			console.log(
				`   📋 ${epic.filePath}${issueInfo} - ${epic.progress} complete (${epic.taskCount} tasks)`
			);
		}
	} else {
		console.log("   (none)");
	}

	console.log("");

	// In Progress epics
	console.log("🚀 In Progress:");
	if (grouped.inProgress.length > 0) {
		for (const epic of grouped.inProgress) {
			const issueInfo = epic.githubIssueNumber ? ` (#${epic.githubIssueNumber})` : "";
			console.log(
				`   📋 ${epic.filePath}${issueInfo} - ${epic.progress} complete (${epic.taskCount} tasks)`
			);
		}
	} else {
		console.log("   (none)");
	}

	console.log("");

	// Completed epics
	console.log("✅ Completed:");
	if (grouped.completed.length > 0) {
		for (const epic of grouped.completed) {
			const issueInfo = epic.githubIssueNumber ? ` (#${epic.githubIssueNumber})` : "";
			console.log(
				`   📋 ${epic.filePath}${issueInfo} - ${epic.progress} complete (${epic.taskCount} tasks)`
			);
		}
	} else {
		console.log("   (none)");
	}

	// Summary
	let totalTasks = 0;
	for (const epic of [...grouped.planning, ...grouped.inProgress, ...grouped.completed]) {
		totalTasks += epic.taskCount;
	}

	console.log("");
	console.log("📊 Summary");
	console.log(`   Total epics: ${totalEpics}`);
	console.log(`   Total tasks: ${totalTasks}`);
}

export const command = buildCommand({
	func: epicListCommand,
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [],
		},
	},
	docs: {
		brief: "List all epics grouped by status",
	},
});
