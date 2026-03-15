---
name: context
description: Load full context about the user's vault, goals, projects, tasks, and calendar for any conversation. Use when the user says "context", "load context", "what's going on", "catch me up", or at the start of a conversation where understanding the user's current situation would help. This skill ensures you have the complete picture before working on anything.
allowed-tools:
  - Glob
  - Read
  - Grep
  - mcp__claude_ai_Google_Calendar__gcal_list_events
  - mcp__plugin_obsidian-vault_todoist__find-tasks-by-date
  - mcp__plugin_obsidian-vault_todoist__find-tasks
---

# Context — Load Full Context

Build a comprehensive picture of the user's current state before beginning any work. The vault's CLAUDE.md is already loaded as project instructions — don't re-read it.

## Process

### 1. Read Vault Structure (parallel)

**Areas of Focus:**

- Read `Categories/Areas.md` and any linked area notes
- These are the high-level life categories: Family/Relationships, Career, Finances, Health & Fitness, Spirituality, Lifestyle, Personal Development

**Active Goals:**

- Grep vault root for notes where frontmatter contains `categories:` with `[[Goals]]`
- Filter to `done: false` or empty `done:`
- Read each goal's What/Why sections (skip How for brevity)
- Note which Area of Focus each connects to via `topics` property

**Active Projects:**

- Grep vault root for notes where frontmatter contains `categories:` with `[[Projects]]`
- Include: status empty, missing, or `[[Active]]`
- Exclude: `[[Completed]]`, `[[On Hold]]`, Archived
- Read each project's Project Goal section

### 2. Read Current State (parallel)

**Todoist tasks:**

- find-tasks-by-date with startDate "today", daysCount 3 (today + next 2 days)
- Also find-tasks with filter "overdue"

**Calendar:**

- gcal_list_events for today + next 3 days

**Recent journal entries:**

- Glob Journal/ files from past 5-7 days
- Read each entry
- Extract: themes, current focus, recent decisions, open questions

### 3. Synthesise

Present a structured summary:

**Current Priorities** — what matters most right now (derived from goals + recent journal activity)

**Active Projects** — one line each: name, goal, current state

**Active Goals** — grouped by Area of Focus, one line each with progress signal

**This Week** — calendar highlights + key tasks due

**Recent Themes** — what's been on the user's mind (from journal entries)

**Open Questions** — unresolved items from journal or projects

End with: "Context loaded. What would you like to work on?"

## Output Rules

- Terminal only. No vault changes.
- Keep synthesis concise — this is orientation, not a report.
- Lead with priorities, not exhaustive lists.
- If a section has nothing noteworthy, skip it rather than saying "nothing here".

## Reference

Vault structure, property system, and naming conventions are in the vault's CLAUDE.md (already loaded as project instructions).
