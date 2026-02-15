---
name: todoist-workflow
description: This skill should be used when the user asks to "create a task", "add a Todoist task", "link task to project", "manage tasks", "connect tasks to notes", discusses Todoist integration, mentions deep links, task-to-note linking, or needs guidance on when to use Todoist vs Obsidian for task management.
---

# Todoist Workflow

## Overview

Todoist serves as the daily task manager. Obsidian holds project-level detail and reference material. Tasks flow between them via deep links. The @doist/todoist-ai MCP server provides task management tools.

## When to Use Todoist vs Obsidian

**Todoist** — actionable items with dates and priorities:
- Daily tasks and to-dos
- Quick captures from COD Collect phase
- Time-sensitive reminders
- Non-project tasks (one-off actions like "buy groceries")

**Obsidian** — reference, planning, and long-form content:
- Project documentation and planning (Projects/ folder)
- Goal tracking and progress (Goals/ folder)
- Meeting notes and decisions (via /meeting command)
- Journal entries and reflections (Journal/ folder)

Rule of thumb: if it has a due date and can be checked off, it belongs in Todoist. If it needs more than a sentence to describe, it also needs an Obsidian note with a deep link from the Todoist task.

## Deep Links

Connect Todoist tasks to Obsidian notes for bidirectional navigation.

### Format

```
obsidian://open?vault=Vault%20V2&file=<URL-encoded-path>
```

### Generating Deep Links

1. Determine the note's path relative to vault root (e.g., `Projects/My Project.md`)
2. Remove the `.md` extension (e.g., `Projects/My Project`)
3. URL-encode the path: spaces → `%20`, `/` → `%2F`, special chars encoded
4. Construct the full URL

### Examples

| Note Path | Deep Link |
|-----------|-----------|
| `Projects/Claude Code Setup.md` | `obsidian://open?vault=Vault%20V2&file=Projects%2FClaude%20Code%20Setup` |
| `Goals/Save £35k.md` | `obsidian://open?vault=Vault%20V2&file=Goals%2FSave%20%C2%A335k` |
| `Notes/2026-01-15 Meeting Notes.md` | `obsidian://open?vault=Vault%20V2&file=Notes%2F2026-01-15%20Meeting%20Notes` |

### Placement

Add deep links to Todoist task descriptions (not the task name). The link appears as clickable in Todoist's UI.

## Task Patterns

### Project Tasks

For tasks related to an Obsidian project:
1. Create the task in Todoist with an actionable name
2. Add deep link to the project note in the task description
3. Assign to the matching Todoist project (if one exists)
4. Set due date and priority

### Non-Project Tasks

One-off actions that don't need Obsidian documentation:
- Live only in Todoist
- No deep link needed
- Examples: errands, routine maintenance, quick calls

### Action Items from Meetings

After processing a meeting transcript with /meeting:
1. Extract action items from the meeting note
2. Create a Todoist task for each action item
3. Include deep link to the meeting note in each task description
4. Set due dates based on discussed timelines

### Action Items from Reviews

Same pattern as meetings — extract actionable items from weekly/monthly reviews and create Todoist tasks with deep links to relevant notes.

## MCP Tools

Available via the Todoist MCP server. Tool names may vary by MCP version — verify available tools on first connection.

Expected tools:
- **get-overview / todoist_get_overview**: Overview of tasks, projects, and labels
- **find-tasks / todoist_find_tasks**: Search tasks by filter query
- **add-tasks / todoist_add_tasks**: Create one or more tasks (name, description, due date, priority, project, labels)
- **complete-tasks / todoist_complete_tasks**: Mark tasks as complete
- **find-projects / todoist_find_projects**: Search for projects
- **add-comments / todoist_add_comments**: Add comments to tasks
- **get-task-details / todoist_get_task_details**: Get full details for specific tasks

### Common Patterns

**Morning planning:**
```
get-overview → see today's tasks and overall status
find-tasks with "today | overdue" filter → get actionable items for 2+8 selection
```

**After processing a meeting:**
```
add-tasks → create tasks for each action item with deep links in descriptions
```

**Weekly review:**
```
find-tasks with "completed: last 7 days" filter → see what got done
get-overview → see what's pending
```

**Creating a project task:**
```
add-tasks with:
  - name: actionable next step
  - description: deep link to Obsidian project note
  - project: matching Todoist project
  - due_date: when it should be done
```
