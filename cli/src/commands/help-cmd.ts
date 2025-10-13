import { buildCommand } from "@stricli/core";

async function helpCommand(): Promise<void> {
	console.log("Helping...");
	console.log("");
	console.log("");

	console.log("📚 Claude Code Flow (ccf) - CLI Commands");
	console.log("=========================================");
	console.log("");

	console.log("🔄 Workflow Commands");
	console.log("  ccf status             - Overall project status");
	console.log("  ccf next               - Show next available tasks");
	console.log("  ccf blocked            - Show blocked tasks");
	console.log("  ccf in-progress        - Show work in progress");
	console.log("  ccf standup            - Daily standup report");
	console.log("");

	console.log("📄 PRD Commands");
	console.log("  ccf prd-list           - List all PRDs by status");
	console.log("  ccf prd-status         - Show PRD distribution chart");
	console.log("");

	console.log("📚 Epic Commands");
	console.log("  ccf epic-list          - List all epics by status");
	console.log("");

	console.log("🔍 Search Commands");
	console.log("  ccf search <query>     - Search across PRDs, epics, and tasks");
	console.log("");

	console.log("⚙️  Setup Commands");
	console.log("  ccf init               - Initialize Claude Code Flow system");
	console.log("  ccf validate           - Check system integrity");
	console.log("  ccf help               - Show this help message");
	console.log("");

	console.log("💡 Tips");
	console.log("  • Use 'ccf next' to find available work");
	console.log("  • Run 'ccf status' for quick overview");
	console.log("  • Use 'ccf search <term>' to find content");
	console.log("");
}

export const command = buildCommand({
	func: helpCommand,
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [],
		},
	},
	docs: {
		brief: "Show help message with available commands",
	},
});
