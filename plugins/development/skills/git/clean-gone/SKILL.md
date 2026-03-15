---
description: Remove local git branches whose remote tracking branch has been deleted. Use when the user says "clean up branches", "remove stale branches", "tidy local branches", "delete gone branches", or similar.
---

Clean up local branches that no longer exist on the remote.

## Steps

1. Run `git fetch --prune` to sync remote tracking refs
2. Run `git branch -v` to identify branches with `[gone]` status
3. If none found, report "No stale branches to clean up" and stop
4. Run `git worktree list` to check for associated worktrees
5. For each `[gone]` branch:
   - If a worktree is associated (branch appears in `git worktree list`): `git worktree remove --force <path>`
   - Delete the branch: `git branch -D <branch-name>`
6. Report each branch and worktree removed

## Notes

- Branches with `+` prefix in `git branch -v` output have associated worktrees
- Do not touch the current branch or main/master
- This is irreversible — confirm with the user if there are many branches to delete
