import { buildCommand } from "@stricli/core";
import {
	printError,
	printHeader,
	printInfo,
	printSection,
	printSuccess,
	printWarning,
} from "../utils/output.ts";
import type { ValidationResult } from "../utils/validation.ts";
import { validatePmSystem } from "../utils/validation.ts";

type ValidationMessage = {
	type: "error" | "warning" | "info" | "success";
	message: string;
};

type GroupedMessages = {
	directory: ValidationMessage[];
	integrity: ValidationMessage[];
	references: ValidationMessage[];
	frontmatter: ValidationMessage[];
};

function printMessage(msg: ValidationMessage): void {
	switch (msg.type) {
		case "success":
			printSuccess(msg.message);
			break;
		case "error":
			printError(msg.message);
			break;
		case "warning":
			printWarning(msg.message);
			break;
		default:
			printInfo(msg.message);
	}
}

function groupValidationMessages(messages: ValidationMessage[]): GroupedMessages {
	return {
		directory: messages.filter((m) => m.message.includes("directory")),
		integrity: messages.filter(
			(m) => m.message.includes("epic.md") || m.message.includes("orphaned")
		),
		references: messages.filter(
			(m) => m.message.includes("references") || m.message.includes("All references")
		),
		frontmatter: messages.filter(
			(m) => m.message.includes("frontmatter") || m.message.includes("All files have")
		),
	};
}

function printMessagesSection(
	icon: string,
	title: string,
	messages: ValidationMessage[],
	defaultMessage?: string
): void {
	printSection(icon, title);
	if (messages.length === 0 && defaultMessage) {
		printSuccess(defaultMessage);
	} else {
		for (const msg of messages) {
			printMessage(msg);
		}
	}
	console.log("");
}

function printValidationSummary(result: ValidationResult): void {
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

async function validateCommand(): Promise<void> {
	console.log("Validating PM System...");
	console.log("");
	console.log("");
	printHeader("🔍 Validating PM System");
	console.log("");

	const result = await validatePmSystem();
	const grouped = groupValidationMessages(result.messages);

	printMessagesSection("📁", "Directory Structure:", grouped.directory);
	if (grouped.integrity.length > 0) {
		printMessagesSection("🗂️", "Data Integrity:", grouped.integrity);
	}
	printMessagesSection("🔗", "Reference Check:", grouped.references, "All references valid");
	printMessagesSection(
		"📝",
		"Frontmatter Validation:",
		grouped.frontmatter,
		"All files have frontmatter"
	);

	printValidationSummary(result);
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
