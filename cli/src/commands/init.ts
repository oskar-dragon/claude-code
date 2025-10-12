import { buildCommand } from "@stricli/core";
import { createClaudeMd, createDirectoryStructure } from "../utils/filesystem.ts";
import { checkGitStatus } from "../utils/git.ts";
import {
	authenticateGh,
	createGhLabels,
	getGhAuthStatus,
	getGhExtensionCount,
	getGhVersion,
	hasGhCli,
	hasGhSubIssueExtension,
	installGhCli,
	installGhSubIssueExtension,
	isGhAuthenticated,
	isGhRepo,
} from "../utils/github.ts";
import {
	printBanner,
	printError,
	printHeader,
	printInfo,
	printSection,
	printStep,
	printSuccess,
	printWarning,
} from "../utils/output.ts";

async function initCommand(): Promise<void> {
	console.log("Initializing...");
	printBanner();

	printHeader("🚀 Initializing Claude Code Flow System");

	// Check dependencies
	printSection("🔍", "Checking dependencies...");

	const hasGh = await hasGhCli();
	if (hasGh) {
		printSuccess("GitHub CLI (gh) installed");
	} else {
		printError("GitHub CLI (gh) not found");
		console.log("");
		printStep("Installing gh...");
		const installed = await installGhCli();
		if (!installed) {
			printStep("Please install GitHub CLI manually: https://cli.github.com/");
			process.exit(1);
		}
	}

	// Check GitHub authentication
	printSection("🔐", "Checking GitHub authentication...");
	const isAuthenticated = await isGhAuthenticated();
	if (isAuthenticated) {
		printSuccess("GitHub authenticated");
	} else {
		printWarning("GitHub not authenticated");
		printStep("Running: gh auth login");
		await authenticateGh();
	}

	// Check gh extensions
	printSection("📦", "Checking gh extensions...");
	const hasExtension = await hasGhSubIssueExtension();
	if (hasExtension) {
		printSuccess("gh-sub-issue extension installed");
	} else {
		printStep("📥 Installing gh-sub-issue extension...");
		await installGhSubIssueExtension();
	}

	// Create directory structure
	printSection("📁", "Creating directory structure...");
	await createDirectoryStructure();
	printSuccess("Directories created");

	// Check Git configuration
	printSection("🔗", "Checking Git configuration...");
	const gitStatus = await checkGitStatus();

	if (gitStatus.isRepository) {
		printSuccess("Git repository detected");

		if (gitStatus.hasRemote && gitStatus.remoteUrl) {
			printSuccess(`Remote configured: ${gitStatus.remoteUrl}`);

			// Create GitHub labels if this is a GitHub repository
			const isGitHub = await isGhRepo();
			if (isGitHub) {
				printSection("🏷️", "Creating GitHub labels...");
				const labelResult = await createGhLabels();

				if (labelResult.epic && labelResult.task) {
					printSuccess("GitHub labels created (epic, task)");
				} else if (labelResult.epic || labelResult.task) {
					printWarning(
						`Some GitHub labels created (epic: ${labelResult.epic}, task: ${labelResult.task})`
					);
				} else {
					printError("Could not create GitHub labels (check repository permissions)");
				}
			} else {
				printInfo("Not a GitHub repository - skipping label creation");
			}
		} else {
			printWarning("No remote configured");
			printStep("Add with: git remote add origin <url>");
		}
	} else {
		printWarning("Not a git repository");
		printStep("Initialize with: git init");
	}

	// Create CLAUDE.md
	const claudeMdCreated = await createClaudeMd();
	if (claudeMdCreated) {
		printSection("📄", "Creating CLAUDE.md...");
		printSuccess("CLAUDE.md created");
	}

	// Print summary
	console.log("");
	printHeader("✅ Initialization Complete!");
	console.log("");
	console.log("📊 System Status:");
	const version = await getGhVersion();
	console.log(version);
	const extensionCount = await getGhExtensionCount();
	console.log(`  Extensions: ${extensionCount} installed`);
	const authStatus = await getGhAuthStatus();
	console.log(`  Auth: ${authStatus}`);
	console.log("");
	console.log("🎯 Next Steps:");
	console.log("  1. Create your first PRD: /pm:prd-new <feature-name>");
	console.log("  2. View help: /pm:help");
	console.log("  3. Check status: /pm:status");
	console.log("");
	console.log("📚 Documentation: README.md");
	console.log("");
}

export const command = buildCommand({
	func: initCommand,
	parameters: {
		positional: {
			kind: "tuple",
			parameters: [],
		},
	},
	docs: {
		brief: "Initialize Claude Code Flow System",
	},
});
