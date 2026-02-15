---
description: This skill should be used when the user asks to "do weekly review", "weekly planning", "review my week", "plan next week", or wants to run the weekly review and planning cycle.
version: "2.0.0"
---

Execute Oskar's weekly review and planning session. Use the productivity-system skill for methodology (Fractal Journaling weekly compilation, Time Sector weekly planning, ZeroInbox) and the todoist-workflow skill for task management.

This is a comprehensive 3-phase process combining reflection and forward planning.

## Execution Rules

**CRITICAL: Sequential Execution Required**

- Each step MUST be fully completed before starting the next step
- Steps that ask questions or request approval are BLOCKING — do not proceed until the user responds
- NEVER say "while you..." or "in the meantime..." to parallelize interactive steps
- **Exception**: Steps 1-4 (data gathering) CAN be executed in parallel since they don't require user input
- After completing Steps 1-4, you MUST stop and wait before proceeding to Step 5

## Phase 1: Review

### Step 1: Compile Journal Entries

Find all journal entries from this week in `Journal/`:

- Use Glob to find files matching `Journal/YYYY-MM-DD*` for each day of the current week
- Read each entry
- Identify recurring themes, key insights, and notable events
- This is the Fractal Journaling weekly compilation level

### Step 2: Summarise Daily Notes

Read this week's daily notes from `Daily/` (YYYY-MM-DD.md format):

- Review priorities set each day (2+8 selections)
- Note which priorities were completed vs carried over
- Identify patterns in what got done vs deferred

### Step 3: Review Todoist Tasks

Use Todoist MCP tools:

- Use `find-completed-tasks` to find tasks completed this week
- Use `find-tasks-by-date` with `startDate: "today"` to find pending and overdue tasks
- Identify any tasks that have been deferred repeatedly (check task history)

### Step 4: Check Goal Progress

Read goal notes from `Goals/` folder:

- Check `done` property status
- Compare weekly activity against goal objectives
- Identify which goals saw progress and which stalled
- Note any goals needing attention

### Step 5: Present Weekly Summary

Present to Oskar:

- **Themes**: Recurring topics from journal entries
- **Accomplishments**: Key things completed
- **Carried over**: Items that kept getting deferred
- **Goal progress**: Status of active goals
- **Patterns**: What went well vs what needs improvement

### Step 6: Ask for Reflections

Ask Oskar:

- What went well this week?
- What could improve?
- What should be the focus for next week?

Use AskUserQuestion or discuss conversationally based on Oskar's preference.

> **⚠️ WAIT FOR RESPONSE BEFORE CONTINUING**

## Phase 2: Plan

### Step 7: Clear Todoist Inbox

Find unassigned inbox tasks:

- Use `find-tasks` with `projectId: "inbox"` and `responsibleUserFiltering: "unassignedOrMe"`
- Apply ZeroInbox methodology: trash, archive, or action
- For actionable items, propose routing to Time Sector projects (THIS WEEK, NEXT WEEK, THIS MONTH, NEXT MONTH) or other projects
- Get Oskar's approval for routing decisions
- Execute moves using `update-tasks` (change projectId)

> **⚠️ WAIT FOR RESPONSE BEFORE CONTINUING**

### Step 8: Review Calendar

Fetch next 7 days of events:

- Use Google Calendar MCP tools (`list-events` with appropriate date range)
- If Google Calendar MCP tools are unavailable, ask Oskar to describe upcoming commitments
- Identify busy days, available time blocks, and major commitments
- Note this for task scheduling in later steps

> **⚠️ WAIT FOR RESPONSE BEFORE CONTINUING** (if asking for calendar info)

### Step 9: Review Master Project List

Read active projects from `Projects/` folder:

- Check `status` property for active projects
- Surface each project's status and next actions
- Flag stalled projects (no activity for 2+ weeks based on modified date or lack of linked tasks)
- **Identify work mentioned in journals/calendar that lacks a project note** (capture context for Step 14)
- Ask Oskar about priorities and focus areas

> **⚠️ WAIT FOR RESPONSE BEFORE CONTINUING**

### Step 10: Review THIS WEEK Incomplete Tasks

Find tasks in THIS WEEK project:

- Use `find-tasks` with the THIS WEEK project ID from the todoist-workflow skill
- For each incomplete task, propose one of:
  - Mark complete (if actually done but not marked)
  - Defer to NEXT WEEK project
  - Reschedule with new due date in next week
- Get Oskar's approval for each decision
- Execute moves using `complete-tasks` or `update-tasks`

> **⚠️ WAIT FOR RESPONSE BEFORE CONTINUING**

### Step 11: Promote from NEXT WEEK

Find tasks in NEXT WEEK project:

- Use `find-tasks` with the NEXT WEEK project ID from the todoist-workflow skill
- Based on calendar availability from Step 8, propose which tasks to move to THIS WEEK
- Suggest appropriate due dates based on available time blocks
- Get Oskar's approval
- Execute moves using `update-tasks` (change to THIS WEEK project ID and set dueString)

> **⚠️ WAIT FOR RESPONSE BEFORE CONTINUING**

### Step 12: Promote from THIS MONTH

Find tasks in THIS MONTH project:

- Use `find-tasks` with the THIS MONTH project ID from the todoist-workflow skill
- Propose any urgent tasks that should move to THIS WEEK based on:
  - Calendar availability from Step 8
  - Goal priorities from Step 4
  - Project priorities from Step 9
- Get Oskar's approval
- Execute moves using `update-tasks` (change to THIS WEEK project ID and set dueString)

> **⚠️ WAIT FOR RESPONSE BEFORE CONTINUING**

## Phase 3: Wrap Up

### Step 13: Create Weekly Review Journal Entry

Create a weekly review journal entry:

- Filename: `Journal/YYYY-MM-DD HHmm - Weekly Review.md` (current timestamp)
- Include:
  - Review summary (themes, accomplishments, carryover, goal progress, patterns)
  - Reflections from Oskar (Step 6)
  - Planning decisions (inbox routing, task promotions, project priorities)
  - **Summary of opportunities identified** (brief mention that tasks were created for project/goal creation)
- Link to relevant daily notes, goal notes, and project notes via wikilinks
- Link to Todoist tasks created for new projects/goals

### Step 14: Update Goal and Project Notes

**For existing goal notes:**

- Update `done` property or progress notes on active goals
- Add weekly progress notes with links to the weekly review journal entry
- Update goal tracking information based on review findings

**For existing project notes:**

- Update `status` property if changed (e.g., Active → Completed, Active → Paused)
- Add brief progress notes referencing the weekly review

**For new projects identified during review:**

- **DO NOT create project notes directly**
- Ask Oskar: "I noticed [project description]. Would you like to create this project now, or should I create a Todoist task to remind you?"

> **⚠️ WAIT FOR RESPONSE BEFORE CONTINUING**

- **If creating now**: Tell Oskar to run `/vault-manager:project` and provide context verbally
- **If creating task**: Use `add-tasks` to create a Todoist task with:
  - **Content**: "Create project: [Project Name]"
  - **Description**: Full context + suggested prompt (see format below)
  - **Project**: THIS WEEK or NEXT WEEK (ask Oskar)
  - **Priority**: p2 (default for planning tasks)
  - **Labels**: ["Planning"] (or ["Work", "Planning"] for work projects)

**For new goals identified during review:**

- Same pattern: ask if now or task

> **⚠️ WAIT FOR RESPONSE BEFORE CONTINUING**

- **If creating task**: Similar Todoist task for goal creation

**Todoist task description format for new projects:**

```
Context:
- Type: [Work Project / Personal Project]
- Organization: [if work - e.g., Qogita]
- Related goal: [goal name]
- Background: [1-2 sentence summary]

Suggested prompt for /vault-manager:project:
"Create a project for [name]. This is a [type] project [at Organization]. It relates to [goal] and [brief why it matters]."
```

**For new goals**, similar format:

```
Context:
- Area: [area name]
- Why: [motivation]
- Related projects: [if any]

Suggested prompt for /vault-manager:goal:
"Create a goal for [name]. This relates to [area] and [brief context]."
```

### Step 15: Save Insights to Auto Memory

Update auto memory with:

- Review patterns and insights
- Any new conventions or preferences expressed
- Goal status changes
- Planning decisions and rationale
- Next week's focus areas
