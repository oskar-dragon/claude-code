---
description: Full git workflow — commit, push, and open a pull request. Use when the user says "create a PR", "commit and push", "open a pull request", "I'm done with this feature", "ship it", "submit this", or similar. Also trigger when the user has just finished a task and implies they want it published or reviewed.
---

Run the complete commit → push → PR workflow in one go.

## Steps

1. Check `git status` and `git diff HEAD`
2. If on `main` or `master`, create a new branch first
3. Stage and commit with a clear message
4. Push to origin
5. Look for a PR template by checking these paths in order (stop at first match):
   - `.github/pull_request_template.md`
   - `.github/PULL_REQUEST_TEMPLATE.md`
   - `.github/PULL_REQUEST_TEMPLATE/default.md`
   - `pull_request_template.md`
   - `docs/pull_request_template.md`
6. Create PR with `gh pr create`:
   - If a template was found: follow it exactly, preserving all section headings
   - If no template: use Summary + Code changes structure
   - Be concise — bullet points, no filler prose
   - PR description should explain *why*, not just *what*

## Constraints

- Do all steps in a single message using parallel tool calls where possible
- Never skip the PR template if one exists
- Never use paragraphs in PR descriptions — bullet points only
