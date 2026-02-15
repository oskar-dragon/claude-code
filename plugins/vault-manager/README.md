# Vault Manager

Claude Code plugin for managing Oskar's Obsidian vault — daily planning, inbox processing, meeting transcription, reviews, goals, and project planning.

## Prerequisites

- **kepano/obsidian-skills** — installed via Claude Code plugin marketplace. Provides obsidian-markdown, obsidian-bases, obsidian-cli, json-canvas, and defuddle skills.
- **Todoist MCP** — configured in this plugin's `.mcp.json`. Requires either Todoist OAuth (hosted) or API key (local).

## Skills

| Skill | Triggers on |
|-------|------------|
| **productivity-system** | Planning, reviewing, organising tasks, COD/Time Sector/Fractal Journaling methodology |
| **todoist-workflow** | Creating tasks, Todoist integration, deep links, task-to-note linking |

Vault conventions (folder structure, frontmatter, naming, properties) are documented in the vault's `CLAUDE.md` rather than a skill, since they apply to every interaction.

## Commands

| Command | Purpose |
|---------|---------|
| `/daily-plan` | Morning planning — review yesterday, compile journal fragments, set 2+8 priorities |
| `/inbox` | COD Organise — scan unprocessed items, route to proper locations, create tasks |
| `/meeting` | Process SuperWhisper transcript — create meeting note, extract action items |
| `/weekly-review` | Weekly review — compile entries, summarise, review goals, plan next week |
| `/monthly-review` | Monthly review — compile weekly summaries, review goals/projects, identify patterns |
| `/goal` | Create or review goals — track progress, link to projects, create next actions |
| `/project` | Create or review projects — track status, break down tasks, link to goals |

## Productivity System

This plugin implements Oskar's integrated productivity system:

- **COD (Collect, Organise, Do)** — three-phase workflow
- **Time Sector System** — plan when to work, daily/weekly cycles
- **2+8 Prioritisation** — 2 must-do + 8 important per day
- **ZeroInbox 2.0** — trash/archive/action this day
- **Fractal Journaling** — multi-scale compilation (daily → weekly → monthly → yearly)
- **Time Blocking** — calendar allocation for execution
