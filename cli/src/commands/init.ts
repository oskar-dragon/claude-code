import { buildCommand } from "@stricli/core";
import {
	copyRulesFromGithub,
	createClaudeMd,
	createDirectoryStructure,
} from "../utils/filesystem.ts";
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

async function checkAndInstallGhCli(): Promise<void> {
	printSection("🔍", "Checking dependencies...");
	const hasGh = await hasGhCli();
	if (hasGh) {
		printSuccess("GitHub CLI (gh) installed");
		return;
	}
	printError("GitHub CLI (gh) not found");
	console.log("");
	printStep("Installing gh...");
	const installed = await installGhCli();
	if (!installed) {
		printStep("Please install GitHub CLI manually: https://cli.github.com/");
		process.exit(1);
	}
}

async function checkAndAuthenticateGh(): Promise<void> {
	printSection("🔐", "Checking GitHub authentication...");
	const isAuthenticated = await isGhAuthenticated();
	if (isAuthenticated) {
		printSuccess("GitHub authenticated");
		return;
	}
	printWarning("GitHub not authenticated");
	printStep("Running: gh auth login");
	await authenticateGh();
}

async function checkAndInstallGhExtensions(): Promise<void> {
	printSection("📦", "Checking gh extensions...");
	const hasExtension = await hasGhSubIssueExtension();
	if (hasExtension) {
		printSuccess("gh-sub-issue extension installed");
		return;
	}
	printStep("📥 Installing gh-sub-issue extension...");
	await installGhSubIssueExtension();
}

async function handleGitHubLabels(): Promise<void> {
	const isGitHub = await isGhRepo();
	if (!isGitHub) {
		printInfo("Not a GitHub repository - skipping label creation");
		return;
	}
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
}

async function setupGitAndLabels(): Promise<void> {
	printSection("🔗", "Checking Git configuration...");
	const gitStatus = await checkGitStatus();

	if (!gitStatus.isRepository) {
		printWarning("Not a git repository");
		printStep("Initialize with: git init");
		return;
	}

	printSuccess("Git repository detected");

	if (!(gitStatus.hasRemote && gitStatus.remoteUrl)) {
		printWarning("No remote configured");
		printStep("Add with: git remote add origin <url>");
		return;
	}

	printSuccess(`Remote configured: ${gitStatus.remoteUrl}`);
	await handleGitHubLabels();
}

async function printSystemSummary(): Promise<void> {
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
	console.log("🔌 Plugin Setup:");
	console.log(
		"  1. Add marketplace: /plugin marketplace add https://github.com/oskar-dragon/claude-code.git"
	);
	console.log("  2. Install plugin: /plugin install flow@claude-code");
	console.log("  3. Quit and re-enter Claude Code to activate the plugin");
	console.log("");
	console.log("🎯 Next Steps:");
	console.log("  1. Create your first PRD: /pm:prd-new <feature-name>");
	console.log("  2. View help: /pm:help");
	console.log("  3. Check status: /pm:status");
	console.log("");
	console.log("📚 Documentation: README.md");
	console.log("");
}

async function initCommand(): Promise<void> {
	console.log("Initializing...");
	printBanner();
	printHeader("🚀 Initializing Claude Code Flow System");

	await checkAndInstallGhCli();
	await checkAndAuthenticateGh();
	await checkAndInstallGhExtensions();

	printSection("📁", "Creating directory structure...");
	await createDirectoryStructure();
	printSuccess("Directories created");

	printSection("📥", "Copying rules from GitHub...");
	const rulesResult = await copyRulesFromGithub();
	if (rulesResult.success) {
		printSuccess(
			`Rules copied (${rulesResult.count}/${rulesResult.count + rulesResult.errors.length})`
		);
		if (rulesResult.errors.length > 0) {
			printWarning(`Failed to copy ${rulesResult.errors.length} rules:`);
			for (const error of rulesResult.errors) {
				console.log(`  ${error}`);
			}
		}
	} else {
		printError("Failed to copy rules from GitHub");
		printStep("Check your internet connection and try again");
	}

	await setupGitAndLabels();

	const claudeMdCreated = await createClaudeMd();
	if (claudeMdCreated) {
		printSection("📄", "Creating CLAUDE.md...");
		printSuccess("CLAUDE.md created");
	}

	await printSystemSummary();
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
