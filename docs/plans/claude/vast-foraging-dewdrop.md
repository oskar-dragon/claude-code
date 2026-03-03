# Fix: commit-push-pr dynamic context permission error

## Context

The `!` backtick dynamic context on line 13 of `plugins/git/commands/commit-push-pr.md` uses a complex `for` loop with `;`, `&&`, and `exit` to find PR templates. Claude Code's permission checker rejects this as "ambiguous syntax with command separators." All other commands in the repo use only simple, single-command dynamic context (e.g., `!`git status``).

## Change

**File:** `plugins/git/commands/commit-push-pr.md`

1. **Remove line 13** — the complex `for` loop dynamic context line for PR template detection
2. **Add a new step before step 4** instructing Claude to check for a PR template at runtime using `test -f` and `cat` (both already in `allowed-tools`). The paths to check:
   - `.github/pull_request_template.md`
   - `.github/PULL_REQUEST_TEMPLATE.md`
   - `.github/PULL_REQUEST_TEMPLATE/default.md`
   - `pull_request_template.md`
   - `docs/pull_request_template.md`
3. **Bump version** in `plugins/git/.claude-plugin/plugin.json`

## Why this approach

- Matches the pattern used by `clean_gone.md` (complex bash in instructions, not dynamic context)
- No new files needed (no helper scripts with path resolution issues)
- `test` and `cat` are already in `allowed-tools` — no frontmatter changes needed
- Keeps the same behavior: find template, use it if present, fall back to default

## Verification

1. Run `/git:commit-push-pr` in a repo with a PR template — should find and use it
2. Run `/git:commit-push-pr` in a repo without a PR template — should fall back to default template
3. Confirm no permission errors on load
