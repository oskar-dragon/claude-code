---
name: todoist-workflow
description: This skill should be used when the user asks to "create a task", "add a Todoist task", "link task to project", "manage tasks", "connect tasks to notes", discusses Todoist integration, mentions deep links, task-to-note linking, or needs guidance on when to use Todoist vs Obsidian for task management.
---

# Todoist Workflow

## Overview

Todoist serves as the daily task manager. Obsidian holds project-level detail, goals, and reference material. The two connect via deep links. The Todoist MCP server provides task management tools.

**Core principle:** Obsidian is the source of truth for project task breakdowns. Todoist is for daily execution and quick reference only.

## When to Use Todoist vs Obsidian

**Todoist** — daily execution and quick reference:
- Daily tasks and to-dos
- Quick captures from COD Collect phase
- Time-sensitive reminders
- Non-project tasks (one-off actions like "buy groceries")
- Project-reference tasks (ONE per project — a deep link for Time Sector visibility)
- Recurring tasks for habit goals (e.g., "exercise 3x/week")

**Obsidian** — source of truth for planning:
- Project documentation, task breakdowns, and planning (Projects/ folder)
- Goal tracking and progress (Goals/ folder)
- Meeting notes and decisions (via /meeting command)
- Journal entries and reflections (Journal/ folder)

Rule of thumb: if it has a due date and can be checked off, it belongs in Todoist. If it needs more than a sentence to describe, it also needs an Obsidian note.

**What does NOT go in Todoist:**
- Individual tasks from a project's task breakdown — those live in the project note's `## Tasks` section
- Goal action items — goals are achieved through projects, not individual tasks (exception: recurring/habit goals)

## Labels

Apply labels to every task created in Todoist:

| Label | When to use |
|-------|------------|
| Planning | Project in planning phase |
| Projects | Personal project work |
| Work | Work-related tasks |
| Studying | Study-related tasks |
| Admin | Administrative tasks (emails, scheduling, etc.) |
| Chores | Household chores |

## Time Sector Buckets

Tasks are placed in Time Sector projects during planning sessions:

| Bucket | Todoist Project ID | Purpose |
|--------|-------------------|---------|
| THIS WEEK | `6Fgfm6g4fC4Rp7Mq` | Tasks to do this week |
| NEXT WEEK | `6Fgfm72qRmG6Qcw8` | Tasks for next week |
| THIS MONTH | `6Fgfm7VhJ5W2Wp5c` | Tasks for this month |
| NEXT MONTH | `6Fgfm7x56gQVcJQg` | Tasks for next month or later |

## Deep Links

Connect Todoist tasks to Obsidian notes for navigation.

### Format

```
obsidian://open?vault=Vault%20V2&file=<URL-encoded-path>
```

### Generating Deep Links

1. Determine the note's path relative to vault root (e.g., `Projects/My Project.md`)
2. Remove the `.md` extension (e.g., `Projects/My Project`)
3. URL-encode the path: spaces -> `%20`, `/` -> `%2F`, special chars encoded
4. Construct the full URL

### Examples

| Note Path | Deep Link |
|-----------|-----------|
| `Projects/Claude Code Setup.md` | `obsidian://open?vault=Vault%20V2&file=Projects%2FClaude%20Code%20Setup` |
| `Goals/Save £35k.md` | `obsidian://open?vault=Vault%20V2&file=Goals%2FSave%20%C2%A335k` |
| `Notes/2026-01-15 Meeting Notes.md` | `obsidian://open?vault=Vault%20V2&file=Notes%2F2026-01-15%20Meeting%20Notes` |

### Placement Rules

**Project-reference tasks:** Deep link goes IN the task name/content so it's directly clickable from the task list:
```
[Project Name](obsidian://open?vault=Vault%20V2&file=Projects%2FProject%20Name)
```

**Action items (meetings, reviews):** Deep link goes in the task description. The task name is the action itself.

## Task Patterns

### Project-Reference Tasks

Each Obsidian project gets ONE Todoist task — a project-reference task. This is NOT a task from the project's breakdown. It exists so the project appears in the Time Sector view and Oskar can click through to the project note.

1. Task content: `[Project Name](deep-link)` — markdown link with deep link
2. Place in a Time Sector bucket (ask Oskar which one)
3. Apply labels based on context (Projects, Work, Planning, etc.)
4. No due date unless specified

The project note's `## Tasks` section is the source of truth for what needs doing.

### Non-Project Tasks

One-off actions that don't need Obsidian documentation:
- Live only in Todoist
- No deep link needed
- Apply appropriate label
- Examples: errands, routine maintenance, quick calls

### Recurring Tasks for Habit Goals

For recurring/habit goals (e.g., "exercise 3x/week"):
1. Create recurring Todoist task with appropriate recurrence
2. Add deep link to the goal note in the task description
3. Apply appropriate label
4. Place in a Time Sector bucket if appropriate

### Action Items from Meetings

After processing a meeting transcript with /meeting:
1. Extract action items from the meeting note
2. Create a Todoist task for each action item
3. Include deep link to the meeting note in each task description
4. Set due dates based on discussed timelines
5. Apply appropriate labels

### Action Items from Reviews

During weekly/monthly reviews, non-project action items that surface (e.g., "email X about Y") go to Todoist with deep links to relevant notes.

Project-related actions identified during reviews should be added to the project note's `## Tasks` section, NOT created as individual Todoist tasks.

## MCP Tools

Available via the Todoist MCP server. Tool names may vary by MCP version — verify available tools on first connection.

Expected tools:
- **get-overview**: Overview of tasks, projects, and labels
- **find-tasks**: Search tasks by project, section, text, labels, or responsible user
- **find-tasks-by-date**: Get tasks by date range or 'today' (includes overdue)
- **add-tasks**: Create one or more tasks (content, description, dueString, priority, projectId, labels)
- **update-tasks**: Modify existing tasks (move between projects, change dates, etc.)
- **complete-tasks**: Mark tasks as complete
- **find-projects**: Search for Todoist projects
- **add-comments**: Add comments to tasks
- **fetch-object**: Get full details for a specific task, project, comment, or section

### Common Patterns

**Morning planning:**
```
find-tasks-by-date with startDate: "today" -> get today's tasks including overdue
get-overview -> see overall status
```

**After processing a meeting:**
```
add-tasks -> create tasks for each action item with deep links in descriptions and labels
```

**Weekly review:**
```
find-completed-tasks with since/until for this week -> see what got done
find-tasks with projectId for each Time Sector bucket -> see what's pending
```

**Creating a project-reference task:**
```
add-tasks with:
  - content: "[Project Name](obsidian://open?vault=Vault%20V2&file=Projects%2FProject%20Name)"
  - projectId: Time Sector bucket ID
  - labels: ["Projects"]  # or ["Work"], etc.
```
