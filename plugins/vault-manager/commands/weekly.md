---
description: Weekly review and planning — reflect, then plan next week
---

Execute Oskar's weekly review and planning session. Use the productivity-system skill for methodology (Fractal Journaling weekly compilation, Time Sector weekly planning, ZeroInbox) and the todoist-workflow skill for task management.

This is a comprehensive 3-phase process combining reflection and forward planning.

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

## Phase 2: Plan

### Step 7: Clear Todoist Inbox

Find unassigned inbox tasks:

- Use `find-tasks` with `projectId: "inbox"` and `responsibleUserFiltering: "unassignedOrMe"`
- Apply ZeroInbox methodology: trash, archive, or action
- For actionable items, propose routing to Time Sector projects (THIS WEEK, NEXT WEEK, THIS MONTH, NEXT MONTH) or other projects
- Get Oskar's approval for routing decisions
- Execute moves using `update-tasks` (change projectId)

### Step 8: Review Calendar

Fetch next 7 days of events:

- Use Google Calendar MCP tools (`list-events` with appropriate date range)
- If Google Calendar MCP tools are unavailable, ask Oskar to describe upcoming commitments
- Identify busy days, available time blocks, and major commitments
- Note this for task scheduling in later steps

### Step 9: Review Master Project List

Read active projects from `Projects/` folder:

- Check `status` property for active projects
- Surface each project's status and next actions
- Flag stalled projects (no activity for 2+ weeks based on modified date or lack of linked tasks)
- Ask Oskar about priorities and focus areas

### Step 10: Review THIS WEEK Incomplete Tasks

Find tasks in THIS WEEK project (ID: `6Fgfm6g4fC4Rp7Mq`):

- Use `find-tasks` with `projectId: "6Fgfm6g4fC4Rp7Mq"`
- For each incomplete task, propose one of:
  - Mark complete (if actually done but not marked)
  - Defer to NEXT WEEK project (ID: `6Fgfm72qRmG6Qcw8`)
  - Reschedule with new due date in next week
- Get Oskar's approval for each decision
- Execute moves using `complete-tasks` or `update-tasks`

### Step 11: Promote from NEXT WEEK

Find tasks in NEXT WEEK project (ID: `6Fgfm72qRmG6Qcw8`):

- Use `find-tasks` with `projectId: "6Fgfm72qRmG6Qcw8"`
- Based on calendar availability from Step 8, propose which tasks to move to THIS WEEK
- Suggest appropriate due dates based on available time blocks
- Get Oskar's approval
- Execute moves using `update-tasks` (change projectId to `6Fgfm6g4fC4Rp7Mq` and set dueString)

### Step 12: Promote from THIS MONTH

Find tasks in THIS MONTH project (ID: `6Fgfm7VhJ5W2Wp5c`):

- Use `find-tasks` with `projectId: "6Fgfm7VhJ5W2Wp5c"`
- Propose any urgent tasks that should move to THIS WEEK based on:
  - Calendar availability from Step 8
  - Goal priorities from Step 4
  - Project priorities from Step 9
- Get Oskar's approval
- Execute moves using `update-tasks` (change projectId to `6Fgfm6g4fC4Rp7Mq` and set dueString)

## Phase 3: Wrap Up

### Step 13: Create Journal Entry

Create a weekly review journal entry:

- Filename: `Journal/YYYY-MM-DD HHmm - Weekly Review.md` (current timestamp)
- Include:
  - Review summary (themes, accomplishments, carryover, goal progress, patterns)
  - Reflections from Oskar (Step 6)
  - Planning decisions (inbox routing, task promotions, project priorities)
- Link to relevant daily notes, goal notes, and project notes via wikilinks

### Step 14: Update Goal and Project Notes

Update any goal or project notes that need status changes:

- Update `done` property or progress notes on goals
- Add next action items to project notes
- Update `status` property on projects if needed

### Step 15: Save Insights to Auto Memory

Update auto memory with:

- Review patterns and insights
- Any new conventions or preferences expressed
- Goal status changes
- Planning decisions and rationale
- Next week's focus areas
