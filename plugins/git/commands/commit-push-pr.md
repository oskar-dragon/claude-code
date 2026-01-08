---
version: "1.0.0"
author: "Oskar Dragon"
allowed-tools: Bash(git checkout --branch:*), Bash(git add:*), Bash(git status:*), Bash(git push:*), Bash(git commit:*), Bash(gh pr create:*), Bash(test:*), Bash(cat:*), Bash(echo:*), Bash(git branch:*), Bash(test:*)
description: Commit, push, and open a PR
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- PR template (if exists): !`cat .github/pull_request_template.md 2>/dev/null || echo "Template not found"`

## Your task

Based on the above changes:

1. Create a new branch if on main
2. Create a single commit with an appropriate message.
3. Push the branch to origin
4. Create a pull request using `gh pr create`. If a PR template was found in the context above, use that template structure. If no template exists, use default template structure provided in default_template XML tag below.
5. You have the capability to call multiple tools in a single response. You MUST do all of the above in a single message. Do not use any other tools or do anything else. Do not send any other text or messages besides these tool calls.

<default_template>

## Summary

A high-level summary of the changes proposed in this PR that can be understood by everyone.

## Code changes

- A bullet point list of the _key_ code changes that have been made.
- Try to communicate _how_ and _why_, not just _what_ has changed.

Analyze the git changes and fill in the template sections with actual content based on the changes you're committing.

<default_template>
