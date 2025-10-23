#!/usr/bin/env bun

import { saveSessionData } from "../session";
import type { PostToolUseHandler } from "../utils";
import { runHook } from "../utils";

// PostToolUse handler - called after Claude uses a tool
const postToolUse: PostToolUseHandler = async (payload) => {
	// Save session data (optional - remove if not needed)
	await saveSessionData("PostToolUse", {
		...payload,
		hook_type: "PostToolUse",
	} as const);

	// Example: React to successful file writes
	if (payload.tool_name === "Write" && payload.tool_response) {
		console.log(`✅ File written successfully!`);
	}

	// Add your custom post-processing logic here

	return {}; // Return empty object to continue normally
};

// Run the hook with our handlers
runHook({
	postToolUse,
});
