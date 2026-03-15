# Development Plugin Design

**Date**: 2026-03-15
**Status**: Approved

## Goal

Consolidate the existing `git` and `utils` plugins into a single `development` plugin composed entirely of skills. The plugin includes a `dev-setup` skill that the user runs once to install superpowers, since the Claude Code plugin API has no native dependency mechanism.

## Context

The current marketplace (`oskar-dragon/claude-code`) has `git` and `utils` as separate flat plugins with commands. This design consolidates them into a single `development` plugin using skills, which are richer and support examples and references. The old plugin directories are deleted.

## Plugin Structure

```
plugins/development/
├── .claude-plugin/
│   └── plugin.json
└── skills/
    ├── dev-setup/
    │   └── SKILL.md          # disable-model-invocation: true
    ├── git/
    │   ├── commit/
    │   │   └── SKILL.md
    │   ├── commit-push-pr/
    │   │   └── SKILL.md
    │   └── clean-gone/
    │       └── SKILL.md
    └── zed/
        └── task/
            └── SKILL.md
```

### Skills

| Skill | Invocation | Description | Notes |
|---|---|---|---|
| `dev-setup` | `/dev:setup` | Installs superpowers from `claude-plugins-official` | `disable-model-invocation: true` |
| `git/commit` | `/git:commit` | Stage and commit changes | Converted from `plugins/git/commands/commit.md` |
| `git/commit-push-pr` | `/git:commit-push-pr` | Full workflow: branch, commit, push, PR | Converted from `plugins/git/commands/commit-push-pr.md` |
| `git/clean-gone` | `/git:clean-gone` | Remove local branches deleted on remote | Converted from `plugins/git/commands/clean_gone.md` |
| `zed/task` | `/zed:task` | Generate Zed task configuration | Converted from `plugins/utils/commands/zed/task.md` |

### `dev-setup` behaviour

`disable-model-invocation: true` prevents Claude from calling this automatically. The skill body instructs the user to run:

```
/plugin install superpowers@claude-plugins-official
```

This is the closest approximation to plugin dependencies that the current API supports.

## Marketplace Changes

Remove `git` and `utils` entries. Add:

```json
{
  "name": "development",
  "version": "1.0.0",
  "source": "./plugins/development",
  "description": "Core development skills — git workflows, Zed tasks, and dev environment setup",
  "category": "development",
  "author": { "name": "Oskar Dragon" }
}
```

Directories `plugins/git/` and `plugins/utils/` are deleted.

## Implementation Plan

Each skill is created using the skill-creator full eval/test loop:

1. Create `plugins/development/` structure and `plugin.json`
2. For each skill (5 total): capture intent from existing command content → write SKILL.md draft → run test prompts with/without skill → evaluate via eval viewer → iterate until approved
3. Update `marketplace.json`
4. Delete `plugins/git/` and `plugins/utils/`

Skill-creator is invoked separately for each skill. Order: `dev-setup` → `git/commit` → `git/commit-push-pr` → `git/clean-gone` → `zed/task`.

## Constraints

- Claude Code has no native plugin dependency mechanism — `dev-setup` is the workaround
- `dev-setup` must have `disable-model-invocation: true` so Claude doesn't trigger it automatically
- Qogita-specific plugins (`canary-update`, `notion-doc`) are unchanged for now
- `chezmoi`, `tutor`, `travel-planner`, `obsidian-vault` are unchanged
