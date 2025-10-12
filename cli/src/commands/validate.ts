import { buildCommand } from "@stricli/core";
import {
  printHeader,
  printSection,
  printSuccess,
  printError,
  printWarning,
  printInfo,
} from "../utils/output.ts";
import { validatePmSystem } from "../utils/validation.ts";

async function validateCommand(): Promise<void> {
  console.log("Validating PM System...");
  console.log("");
  console.log("");

  printHeader("🔍 Validating PM System");
  console.log("");

  const result = await validatePmSystem();

  // Group messages by section
  const directoryMessages = result.messages.filter((m) =>
    m.message.includes("directory")
  );
  const integrityMessages = result.messages.filter(
    (m) =>
      m.message.includes("epic.md") || m.message.includes("orphaned")
  );
  const referenceMessages = result.messages.filter(
    (m) =>
      m.message.includes("references") || m.message.includes("All references")
  );
  const frontmatterMessages = result.messages.filter(
    (m) =>
      m.message.includes("frontmatter") || m.message.includes("All files have")
  );

  // Print directory structure
  printSection("📁", "Directory Structure:");
  for (const msg of directoryMessages) {
    if (msg.type === "success") printSuccess(msg.message);
    else if (msg.type === "error") printError(msg.message);
    else if (msg.type === "warning") printWarning(msg.message);
    else printInfo(msg.message);
  }
  console.log("");

  // Print data integrity
  if (integrityMessages.length > 0) {
    printSection("🗂️", "Data Integrity:");
    for (const msg of integrityMessages) {
      if (msg.type === "warning") printWarning(msg.message);
    }
    console.log("");
  }

  // Print reference check
  printSection("🔗", "Reference Check:");
  if (referenceMessages.length === 0) {
    printSuccess("All references valid");
  } else {
    for (const msg of referenceMessages) {
      if (msg.type === "success") printSuccess(msg.message);
      else if (msg.type === "warning") printWarning(msg.message);
    }
  }
  console.log("");

  // Print frontmatter validation
  printSection("📝", "Frontmatter Validation:");
  if (frontmatterMessages.length === 0) {
    printSuccess("All files have frontmatter");
  } else {
    for (const msg of frontmatterMessages) {
      if (msg.type === "success") printSuccess(msg.message);
      else if (msg.type === "warning") printWarning(msg.message);
    }
  }

  // Print summary
  console.log("");
  printHeader("📊 Validation Summary:");
  console.log(`  Errors: ${result.errors}`);
  console.log(`  Warnings: ${result.warnings}`);
  console.log(`  Invalid files: ${result.invalid}`);

  if (result.errors === 0 && result.warnings === 0 && result.invalid === 0) {
    console.log("");
    console.log("✅ System is healthy!");
  } else {
    console.log("");
    console.log("💡 Run /pm:clean to fix some issues automatically");
  }
}

export const command = buildCommand({
  func: validateCommand,
  parameters: {
    positional: {
      kind: "tuple",
      parameters: [],
    },
  },
  docs: {
    brief: "Validate PM System integrity",
  },
});
