---
name: review-weekly
description: Weekly review and planning session — creates a weekly review note and guides through clearing your inbox, reviewing calendar, projects, and tasks for the coming week. Use when the user says "weekly review", "weekly planning", "plan the week", "week ahead", or "review the week". Collaborative: surfaces data, asks questions, waits for approval before Todoist changes.
allowed-tools:
  - Glob
  - Read
  - Grep
  - Edit
  - Skill
  - AskUserQuestion
  - mcp__claude_ai_Google_Calendar__gcal_list_events
  - mcp__plugin_obsidian-vault_todoist__find-tasks
  - mcp__plugin_obsidian-vault_todoist__find-tasks-by-date
  - mcp__plugin_obsidian-vault_todoist__update-tasks
  - mcp__plugin_obsidian-vault_todoist__add-tasks
  - mcp__plugin_obsidian-vault_todoist__complete-tasks
---

# Review Weekly — Weekly Planning Session

Guide the user through a 20-40 minute weekly review. This is a conversation: surface data, ask questions, wait for decisions, then execute only what was approved.

## Phase 1: Create the Review Note

1. Use the `obsidian:obsidian-cli` skill to create a new note from the Weekly Review Template:
   - Name: `YYYY-[W]WW Weekly Review.md` where WW is zero-padded (e.g., `2026-W12 Weekly Review.md`)
   - The template auto-fills frontmatter and embeds `![[Journal.base#Weekly]]`
   - Place in vault root

## Phase 2: Guided Review (collaborative)

Work through each step. Wait for user responses before moving on.

### Step 1: Clear Todoist Inbox

Find tasks with no project (inbox items):
- find-tasks with filter "no project"

Present inbox items and for each, ask: "What is it? What do you have to do? When are you going to do it?"

Process in batches of 5-10 items. Wait for user to triage each batch before continuing.

### Step 2: Review Next Week's Calendar

- gcal_list_events for next 7 days (from Monday of next week to Sunday)
- Present the week's events chronologically
- Ask: "Any conflicts? Anything to cancel or move?"

Wait for user response.

### Step 3: Review Active Projects

- Grep vault root for notes with `categories:` containing `[[Projects]]` and status not Completed/On Hold/Archived
- Read up to 5 most recently modified active project notes
- For each project, present: name + current status + last activity
- Ask for each: "What needs to happen on this project this week?"

Wait for user response per project.

### Step 4: Review Incomplete Tasks

- find-tasks-by-date for the past 7 days (tasks that were due but not completed)
- Present the list

Ask: "These didn't get done. For each: move to next week, reschedule later, or drop?"

Collect all decisions before making any changes.

### Step 5: Move Tasks

Present proposed Todoist changes based on decisions above:

```
Proposed changes:
- Move [task] to next week (due: [date])
- Reschedule [task] to [date]
- Drop [task]
```

Ask: "Confirm these changes?" Apply only after confirmation.

### Step 6: Review Upcoming Month

- find-tasks-by-date with startDate today, daysCount 30
- Show tasks due in the next month that aren't already in next week
- Ask: "Any of these should move to next week?"

## Phase 3: Reflection (user writes, AI prompts)

Append these section headers to the weekly review note, then guide the user through each:

### Append sections to note

Use Edit to append to the weekly review note file:

```
## 3 Focus Areas for this week

## What's gone well

## What didn't go well

## Observations
```

### Guide reflection

For each section, prompt with relevant data:

**3 Focus Areas:**
"What are the 3 most important things you want to accomplish this week? (Based on the projects and tasks we just reviewed, consider: [top priorities from Step 3/4])"

Wait for user input, then append their answer to the note section.

**What's gone well:**
Present highlights from the past week (completed tasks, journal entries from past 7 days):
"Looking at what you completed this week and your journal entries, what stands out as going well?"

Wait for user input, append to note.

**What didn't go well:**
Present the incomplete tasks from Step 4:
"The incomplete tasks suggest some friction. What didn't go as planned?"

Wait for user input, append to note.

**Observations:**
Glob Journal/ files from the past 7 days, scan for recurring themes:
"From your journal this week, I notice themes around [X, Y, Z]. Any observations about this week more broadly?"

Wait for user input, append to note.

For each reflection, suggest linking to relevant Goals with `[[Goal Name]]` where appropriate. (Existing reviews use pattern "GOAL: [[Goal Name]]" — follow this if the user mentions goals.)

## Phase 4: Wrap Up

1. Execute any remaining approved Todoist changes
2. Confirm review note is saved with all sections filled
3. Summary:
   ```
   Week planned. Focus areas: [X, Y, Z].
   Tasks: [N] scheduled, [N] rescheduled, [N] dropped.
   ```

## Critical Rules

- **Never make Todoist changes without explicit approval** — collect all decisions, present summary, get one confirmation
- **Reflection sections are user-written** — the AI prompts with data and asks questions, never writes the reflection for the user
- **Goal links are suggestions** — present them, let the user decide whether to include
- **Vault note** is created at the start — it's the container for the session, not just an output at the end
