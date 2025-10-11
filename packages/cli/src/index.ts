#!/usr/bin/env bun
import init from "./scripts/init";

const command = process.argv[2];

async function main() {
  switch (command) {
    case "init":
      await init();
      break;
    default:
      console.log("occ - @oskar-dragon/claude-code");
      console.log("");
      console.log("Usage:");
      console.log("  occ init    Initialize Claude Code PM System");
      console.log("");
      console.log("Available commands:");
      console.log("  init    Install dependencies and configure GitHub");
      process.exit(command ? 1 : 0);
  }
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
