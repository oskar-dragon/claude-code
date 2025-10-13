import { buildCommand } from "@stricli/core";

async function helpCommand(): Promise<void> {
	console.log("Helping...");
	console.log("");
	console.log("");

	console.log("📚 Claude Code Flow - CLI Commands");
	console.log("===================================");
	console.log("");

	console.log("🔄 Workflow Commands");
	console.log("  claude-code-flow status             - Overall project status");
	console.log("  claude-code-flow next               - Show next available tasks");
	console.log("  claude-code-flow blocked            - Show blocked tasks");
	console.log("  claude-code-flow in-progress        - Show work in progress");
	console.log("  claude-code-flow standup            - Daily standup report");
	console.log("");

	console.log("📄 PRD Commands");
	console.log("  claude-code-flow prd-list           - List all PRDs by status");
	console.log("  claude-code-flow prd-status         - Show PRD distribution chart");
	console.log("");

	console.log("📚 Epic Commands");
	console.log("  claude-code-flow epic-list          - List all epics by status");
	console.log("");

	console.log("🔍 Search Commands");
	console.log("  claude-code-flow search <query>     - Search across PRDs, epics, and tasks");
	console.log("");

	console.log("⚙️  Setup Commands");
	console.log("  claude-code-flow init               - Initialize Claude Code Flow system");
	console.log("  claude-code-flow validate           - Check system integrity");
	console.log("  claude-code-flow help               - Show this help message");
	console.log("");

	console.log("💡 Tips");
	console.log("  • Use 'claude-code-flow next' to find available work");
	console.log("  • Run 'claude-code-flow status' for quick overview");
	console.log("  • Use 'claude-code-flow search <term>' to find content");
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
