#!/usr/bin/env bun
import { $ } from "bun";

const CLAUDE_MD_TEMPLATE = `# CLAUDE.md

> Think carefully and implement the most concise solution that changes as little code as possible.

## Project-Specific Instructions

Add your project-specific instructions here.

## Testing

Always run tests before committing:
- \`npm test\` or equivalent for your stack

## Code Style

Follow existing patterns in the codebase.
`;

async function init() {
  console.log("Initializing...");
  console.log("");
  console.log("");

  console.log(" ██████╗ ██████╗██████╗ ███╗   ███╗");
  console.log("██╔════╝██╔════╝██╔══██╗████╗ ████║");
  console.log("██║     ██║     ██████╔╝██╔████╔██║");
  console.log("╚██████╗╚██████╗██║     ██║ ╚═╝ ██║");
  console.log(" ╚═════╝ ╚═════╝╚═╝     ╚═╝     ╚═╝");

  console.log("┌─────────────────────────────────┐");
  console.log("│ Claude Code Project Management  │");
  console.log("│ by https://x.com/aroussi        │");
  console.log("└─────────────────────────────────┘");
  console.log("https://github.com/automazeio/ccpm");
  console.log("");
  console.log("");

  console.log("🚀 Initializing Claude Code PM System");
  console.log("======================================");
  console.log("");

  // Check for required tools
  console.log("🔍 Checking dependencies...");

  // Check gh CLI
  const hasGh = await $`command -v gh`.quiet().nothrow();
  if (hasGh.exitCode === 0) {
    console.log("  ✅ GitHub CLI (gh) installed");
  } else {
    console.log("  ❌ GitHub CLI (gh) not found");
    console.log("");
    console.log("  Installing gh...");

    const hasBrew = await $`command -v brew`.quiet().nothrow();
    const hasApt = await $`command -v apt-get`.quiet().nothrow();

    if (hasBrew.exitCode === 0) {
      await $`brew install gh`;
    } else if (hasApt.exitCode === 0) {
      await $`sudo apt-get update && sudo apt-get install gh`;
    } else {
      console.log("  Please install GitHub CLI manually: https://cli.github.com/");
      process.exit(1);
    }
  }

  // Check gh auth status
  console.log("");
  console.log("🔐 Checking GitHub authentication...");
  const isAuthenticated = await $`gh auth status`.quiet().nothrow();
  if (isAuthenticated.exitCode === 0) {
    console.log("  ✅ GitHub authenticated");
  } else {
    console.log("  ⚠️ GitHub not authenticated");
    console.log("  Running: gh auth login");
    await $`gh auth login`;
  }

  // Check for gh-sub-issue extension
  console.log("");
  console.log("📦 Checking gh extensions...");
  const extensionList = await $`gh extension list`.text();
  if (extensionList.includes("yahsan2/gh-sub-issue")) {
    console.log("  ✅ gh-sub-issue extension installed");
  } else {
    console.log("  📥 Installing gh-sub-issue extension...");
    await $`gh extension install yahsan2/gh-sub-issue`;
  }

  // Create directory structure
  console.log("");
  console.log("📁 Creating directory structure...");
  await $`mkdir -p .claude/prds`;
  await $`mkdir -p .claude/epics`;
  await $`mkdir -p .claude/rules`;
  await $`mkdir -p .claude/agents`;
  await $`mkdir -p .claude/scripts/pm`;
  console.log("  ✅ Directories created");

  // Copy scripts if in main repo
  const pwd = await $`pwd`.text();
  const hasScripts = await $`test -d scripts/pm`.quiet().nothrow();
  if (hasScripts.exitCode === 0 && !pwd.includes("/.claude")) {
    console.log("");
    console.log("📝 Copying PM scripts...");
    await $`cp -r scripts/pm/* .claude/scripts/pm/`;
    await $`chmod +x .claude/scripts/pm/*.sh`;
    console.log("  ✅ Scripts copied and made executable");
  }

  // Check for git
  console.log("");
  console.log("🔗 Checking Git configuration...");
  const isGitRepo = await $`git rev-parse --git-dir`.quiet().nothrow();
  if (isGitRepo.exitCode === 0) {
    console.log("  ✅ Git repository detected");

    // Check remote
    const hasRemote = await $`git remote -v`.quiet().nothrow();
    if (hasRemote.exitCode === 0 && hasRemote.stdout.toString().includes("origin")) {
      const remoteUrl = await $`git remote get-url origin`.text();
      console.log(`  ✅ Remote configured: ${remoteUrl.trim()}`);

      // Check if remote is the CCPM template repository
      if (remoteUrl.includes("automazeio/ccpm")) {
        console.log("");
        console.log("  ⚠️ WARNING: Your remote origin points to the CCPM template repository!");
        console.log("  This means any issues you create will go to the template repo, not your project.");
        console.log("");
        console.log("  To fix this:");
        console.log("  1. Fork the repository or create your own on GitHub");
        console.log("  2. Update your remote:");
        console.log("     git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git");
        console.log("");
      } else {
        // Create GitHub labels if this is a GitHub repository
        const isGhRepo = await $`gh repo view`.quiet().nothrow();
        if (isGhRepo.exitCode === 0) {
          console.log("");
          console.log("🏷️ Creating GitHub labels...");

          let epicCreated = false;
          let taskCreated = false;

          const epicResult = await $`gh label create "epic" --color "0E8A16" --description "Epic issue containing multiple related tasks" --force`.quiet().nothrow();
          if (epicResult.exitCode === 0) {
            epicCreated = true;
          } else {
            const labelList = await $`gh label list`.quiet().nothrow();
            if (labelList.stdout.toString().includes("epic")) {
              epicCreated = true;
            }
          }

          const taskResult = await $`gh label create "task" --color "1D76DB" --description "Individual task within an epic" --force`.quiet().nothrow();
          if (taskResult.exitCode === 0) {
            taskCreated = true;
          } else {
            const labelList = await $`gh label list`.quiet().nothrow();
            if (labelList.stdout.toString().includes("task")) {
              taskCreated = true;
            }
          }

          if (epicCreated && taskCreated) {
            console.log("  ✅ GitHub labels created (epic, task)");
          } else if (epicCreated || taskCreated) {
            console.log(`  ⚠️ Some GitHub labels created (epic: ${epicCreated}, task: ${taskCreated})`);
          } else {
            console.log("  ❌ Could not create GitHub labels (check repository permissions)");
          }
        } else {
          console.log("  ℹ️ Not a GitHub repository - skipping label creation");
        }
      }
    } else {
      console.log("  ⚠️ No remote configured");
      console.log("  Add with: git remote add origin <url>");
    }
  } else {
    console.log("  ⚠️ Not a git repository");
    console.log("  Initialize with: git init");
  }

  // Create CLAUDE.md if it doesn't exist
  const hasClaude = await $`test -f CLAUDE.md`.quiet().nothrow();
  if (hasClaude.exitCode !== 0) {
    console.log("");
    console.log("📄 Creating CLAUDE.md...");
    await Bun.write("CLAUDE.md", CLAUDE_MD_TEMPLATE);
    console.log("  ✅ CLAUDE.md created");
  }

  // Summary
  console.log("");
  console.log("✅ Initialization Complete!");
  console.log("==========================");
  console.log("");
  console.log("📊 System Status:");
  const ghVersion = await $`gh --version`.text();
  console.log(ghVersion.split('\n')[0]);
  const extensionCount = (await $`gh extension list`.text()).split('\n').filter(Boolean).length;
  console.log(`  Extensions: ${extensionCount} installed`);
  const authStatus = await $`gh auth status 2>&1`.text();
  const authMatch = authStatus.match(/Logged in to [^ ]*/);
  console.log(`  Auth: ${authMatch ? authMatch[0] : 'Not authenticated'}`);
  console.log("");
  console.log("🎯 Next Steps:");
  console.log("  1. Create your first PRD: /pm:prd-new <feature-name>");
  console.log("  2. View help: /pm:help");
  console.log("  3. Check status: /pm:status");
  console.log("");
  console.log("📚 Documentation: README.md");
}

export default init;
