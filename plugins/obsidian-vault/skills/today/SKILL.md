---
name: today
description: Morning orientation — shows today's calendar events and tasks in a concise glance. Use when the user says "today", "what's on today", "morning briefing", "what am I doing today", or asks about their day. Even if the request seems simple, this skill ensures calendar and tasks are checked together with carry-forward items from yesterday.
allowed-tools:
  - Glob
  - Read
  - Grep
  - mcp__claude_ai_Google_Calendar__gcal_list_events
  - mcp__plugin_obsidian-vault_todoist__find-tasks-by-date
  - mcp__plugin_obsidian-vault_todoist__find-tasks
---

# Today — Morning Orientation

Give the user a 30-second glance at what's ahead today. Short, scannable, no fluff.

## Process

### 1. Gather Data (parallel where possible)

**Calendar:** Fetch today's events.
- Use gcal_list_events with timeMin and timeMax set to today's date boundaries (00:00:00 to 23:59:59)
- Extract: event summary, start time, end time, location if any

**Tasks:** Fetch today's tasks and overdue items.
- Use find-tasks-by-date with startDate "today" (this includes overdue by default)
- Limit: 30 tasks to catch everything

**Yesterday's journal:** Check for carry-forward items.
- Glob for Journal/ files matching yesterday's date pattern (YYYY-MM-DD*.md)
- Read each entry, scan for:
  - Unfinished thoughts or open questions
  - Mentioned tasks that might not be in Todoist ("I need to...", "TODO", "follow up")
  - Commitments to others

### 2. Present

Structure the output as:

**Calendar**
List today's events chronologically with times. If no events, say "No calendar events today."

**Tasks**
Group tasks:
- 🔴 **Overdue** — tasks past their due date (flag prominently)
- 📋 **Due today** — tasks due today
- If there are many, keep it to the top 10 most important

**Carry-forward** (only if items found)
Brief list of anything from yesterday's journal that looks unfinished or needs attention.

**Heads up** (only if relevant)
Flag any conflicts (back-to-back meetings, task due during a meeting block, etc.)

## Output Rules
- Terminal only. No vault changes. No file creation.
- Keep it SHORT. This is a glance, not a report.
- Use markdown formatting for scannability.
- If calendar is empty and no tasks are due, say so in one line.
