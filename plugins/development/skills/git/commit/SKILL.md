---
description: Stage and commit current changes with an appropriate commit message. Use when the user says "commit", "commit my changes", "save my work to git", or similar.
---

Review the current state of the repository and create a focused, well-described commit.

## Steps

1. Check `git status` and `git diff HEAD` to understand what has changed
2. Stage the relevant files (prefer specific files over `git add -A` unless all changes belong together)
3. Write a commit message that explains *why* the change was made, not just what changed
4. Commit

## Constraints

- Do not push
- Do not create a PR
- Do not do anything beyond staging and committing
- Commit message should follow conventional commits format where appropriate (`feat:`, `fix:`, `chore:`, etc.)
