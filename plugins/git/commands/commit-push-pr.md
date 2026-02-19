---
version: "1.0.2"
author: "Oskar Dragon"
allowed-tools: Bash(git checkout --branch:*), Bash(git add:*), Bash(git status:*), Bash(git push:*), Bash(git commit:*), Bash(gh pr create:*), Bash(test:*), Bash(cat:*), Bash(echo:*), Bash(git branch:*), Bash(test:*)
description: Commit, push, and open a PR
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- PR template (if exists): !`for f in .github/pull_request_template.md .github/PULL_REQUEST_TEMPLATE.md .github/PULL_REQUEST_TEMPLATE/default.md pull_request_template.md docs/pull_request_template.md; do [ -f "$f" ] && cat "$f" && exit 0; done; echo "Template not found"`

## Your task

Based on the above changes:

1. Create a new branch if on main
2. Create a single commit with an appropriate message.
3. Push the branch to origin
4. Create a pull request using `gh pr create`. If a PR template was found in the context above, you MUST follow it exactly — preserve every section heading and structure from the template. Do NOT use the default_template below when a repo template exists. The default_template is ONLY a fallback for when no repo template was found. Be concise: no filler prose, no restating the obvious. Each section should be a few short bullet points or a single sentence, never paragraphs.
5. You have the capability to call multiple tools in a single response. You MUST do all of the above in a single message. Do not use any other tools or do anything else. Do not send any other text or messages besides these tool calls.

<default_template>

## Summary

A high-level summary of the changes proposed in this PR that can be understood by everyone.

## Code changes

- A bullet point list of the _key_ code changes that have been made.
- Try to communicate _how_ and _why_, not just _what_ has changed.

Analyze the git changes and fill in the template sections with actual content based on the changes you're committing.

</default_template>
