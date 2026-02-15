---
description: Monthly review and planning — reflect, then plan ahead
---

Execute Oskar's monthly review and planning session. Use the productivity-system skill for methodology (Fractal Journaling monthly compilation, Time Sector monthly planning) and the todoist-workflow skill for task management.

This is a comprehensive 3-phase process combining deep reflection and strategic forward planning at the monthly cadence.

## Phase 1: Review

### Step 1: Find or Create Monthly Note

Monthly notes use the format `NNN - Month YYYY.md` (e.g., `122 - February 2026.md`).

Check if a monthly note exists for the current month:

- Search in vault root for the current month's note
- If not found, read `Templates/Monthly Note Template.md` and create the note
- The template uses frontmatter: `aliases` (month + year), `previous`/`next` links, `tags: [monthly-notes]`
- Determine the correct NNN prefix by checking existing monthly notes for the sequence

### Step 2: Compile Weekly Summaries

Find weekly review entries from this month:

- Search `Journal/` for entries containing "Weekly Review" in the filename from this month
- Read each weekly review entry
- Extract key themes, accomplishments, and patterns from each week
- This is the Fractal Journaling monthly compilation level

### Step 3: Review Goal Progress

Read goal notes from `Goals/` folder:

- Check all active goals (where `done: false`)
- Compare month's activity against goal objectives
- Check quarterly goals — is progress on track for the quarter?
- Identify stalled or blocked goals
- Note which goals are on-track vs need attention

### Step 4: Review Project Progress

Read project notes from `Projects/` folder:

- Check `status` property for active projects
- Review related meeting notes and journal entries for project activity
- Note milestones hit and blockers encountered
- Identify projects that need attention, escalation, or completion

### Step 5: Identify Patterns

From the Fractal Journaling monthly compilation:

- Recurring themes across weeks
- Patterns in what gets done vs deferred
- Energy and productivity patterns
- Emerging interests or shifting priorities
- Monthly rhythms and seasonal factors

### Step 6: Suggest Adjustments

Based on the review, suggest:

- Goals that may need revised timelines or approaches
- Projects that should be escalated, paused, or closed
- New goals or projects that have emerged from the month's activity
- Habits or workflows that could improve

### Step 7: Ask for Reflections

Ask Oskar:

- What was the highlight of this month?
- What was the biggest challenge?
- What should change going forward?

Use AskUserQuestion or discuss conversationally based on Oskar's preference.

## Phase 2: Plan

### Step 8: Review Calendar for Next Month

Fetch next month's events:

- Use Google Calendar MCP tools (`list-events` with next month's date range)
- If Google Calendar MCP tools are unavailable, ask Oskar to describe major commitments for next month
- Identify busy periods, key deadlines, and available focus time
- Note this for task and project planning in later steps

### Step 9: Deep Goal Review

Review all goals with strategic lens:

- Are current goals still relevant and aligned with priorities?
- Should any goals be closed (completed or abandoned)?
- Should any goals be paused (still valid but not right timing)?
- Are there new goals that should be created based on month's insights?

Propose changes and get Oskar's approval for:
- Closing goals (update `done: true`)
- Pausing goals (update `status` property)
- Creating new goals (use `/goal` command after this review if needed)

### Step 10: Deep Project Review

Review all projects with strategic lens:

- Propose status changes: activate, pause, complete, or archive projects
- For active projects, identify next actions and **add them to the project note's `## Tasks` section** — the project note is the source of truth
- Check that each active project has a project-reference task in Todoist. If not, offer to create one.

Get Oskar's approval for:
- Status changes (update `status` property in project notes)
- New tasks added to project notes

### Step 11: Promote from NEXT MONTH

Find tasks in NEXT MONTH project (ID: `6Fgfm7x56gQVcJQg`):

- Use `find-tasks` with `projectId: "6Fgfm7x56gQVcJQg"`
- Based on calendar from Step 8 and goals/projects from Steps 9-10, propose which tasks to move to THIS MONTH
- Consider timing, capacity, and strategic priorities
- Get Oskar's approval
- Execute moves using `update-tasks` (change projectId to `6Fgfm7VhJ5W2Wp5c`)

### Step 12: Review THIS MONTH

After promotions from NEXT MONTH, review the full THIS MONTH task list:

- Use `find-tasks` with `projectId: "6Fgfm7VhJ5W2Wp5c"`
- Propose which tasks should move to THIS WEEK for the first week of the month
- Based on calendar availability and priorities, suggest appropriate due dates
- Get Oskar's approval
- Execute moves using `update-tasks` (change projectId to `6Fgfm6g4fC4Rp7Mq` and set dueString)

## Phase 3: Wrap Up

### Step 13: Update Monthly Note

Update the monthly note with review and planning summary:

- Add review summary section: themes, accomplishments, patterns, insights
- Add reflections from Oskar (Step 7)
- Add planning decisions: goal/project changes, task promotions, next month's focus
- Link to relevant weekly review entries, goal notes, and project notes via wikilinks

### Step 14: Update Goal and Project Notes

Update notes with status changes from planning:

- Update `done` property or `status` property on goals as approved
- Update `status` property on projects as approved
- Add next action items to project notes
- Update progress notes with month's achievements

### Step 15: Save Insights to Auto Memory

Update auto memory with:

- Monthly review insights and patterns
- Any new conventions or preferences expressed
- Goal and project status changes
- Planning decisions and rationale
- Strategic priorities for next month
