---
name: review-monthly
description: Monthly review and planning session — creates a monthly review note and guides through clearing inbox, reviewing the coming month's calendar, all projects (active, on-hold, and recently completed), incomplete tasks, and a monthly reflection. Use when the user says "monthly review", "monthly planning", "review the month", or "plan the month". Includes all weekly review steps plus goal-review suggestion and full project audit. Collaborative, approval-gated.
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
  - mcp__plugin_obsidian-vault_todoist__complete-tasks
---

# Review Monthly — Monthly Planning Session

Guide the user through a monthly review and planning session (30-60 minutes). This extends the weekly review with broader scope: full month calendar, all projects (including on-hold), goal-review suggestion, and Areas of Focus check. This is a conversation: surface data, ask questions, wait for decisions, then execute only what was approved.

## Phase 1: Create the Review Note

1. Use the `obsidian:obsidian-cli` skill to create a new note from the Monthly Review Template:
   - Name: `YYYY-MM Monthly Review.md` (e.g., `2026-03 Monthly Review.md`)
   - The template auto-fills frontmatter and embeds `![[Reviews.base#Monthly]]`
   - Place in vault root

## Phase 2: Weekly Planning Steps (scoped to the month)

Work through each step collaboratively. These are the same steps as review-weekly but with monthly scope.

### Step 1: Clear Todoist Inbox

Find tasks with no project (inbox items):

- find-tasks with filter "no project"

Present inbox items and for each, ask: "What is it? What do you have to do? When are you going to do it?"

Process in batches of 5-10 items. Wait for user to triage each batch before continuing.

### Step 2: Review Next Month's Calendar

- gcal_list_events for the full coming month (next 4-5 weeks)
- Present events grouped by week
- Flag: busy periods, back-to-back days, long gaps, weeks with no events
- Ask: "Any conflicts? Anything to cancel or move? Any important dates to plan around?"

Wait for user response.

### Step 3: Review Incomplete Tasks from This Month

- find-tasks-by-date for tasks due in the past month (today - 30 days to today)
- Show tasks that weren't completed
- Ask: "These didn't get done this month. Move to next month, reschedule to a specific date, or drop?"
- Collect all decisions before applying

### Step 4: Review Upcoming Tasks for Next Month

- find-tasks-by-date with startDate today, daysCount 35 (full next month)
- Show what's coming up in the next month
- Ask: "Any adjustments needed? Tasks to move, delete, or prioritise?"

Collect all decisions before applying.

## Phase 3: Monthly Additions

### Step 5: Goal Review Suggestion

Suggest invoking the goal-review skill:

> "Now's a good time to review your goals. Would you like me to run /goal-review? It will review each active goal with evidence from projects, tasks, and journal entries."

If yes, say: "Use `/goal-review` to review your goals, or continue the monthly review and circle back later."

### Step 6: Review ALL Projects

Audit all projects regardless of status (Active, On Hold, Completed are all relevant — only exclude Archived):

- Grep vault root for notes with `categories:` containing `[[Projects]]`
- Read each project's name, status, and Project Goal section
- For each project, ask:
  - **Active projects:** "Any changes? On track? Any blockers?"
  - **On Hold projects:** "Still on hold? Any reason to re-activate or drop?"
  - **Completed projects:** "Completed this month — any loose ends to tidy up?"

After reviewing all, ask: "Any projects that should become active? Any that should be shelved or archived?"

Collect all decisions before applying.

### Step 7: Areas of Focus Check (conditional)

Check when the last yearly review was:

- Glob for `*Yearly Review.md` files in vault root
- Find the most recent one
- If more than 3 months ago (or none found), prompt:

> "It's been a while since you reviewed your Areas of Focus. Want to check if they're still balanced and getting attention? (This is a quick reflection, not a full yearly review.)"

If user says yes:

- Read `Categories/Areas.md` and any linked notes
- For each area, ask: "Is this area getting the attention it deserves?"

Collect feedback and present summary: "Your areas seem [balanced | unbalanced]. Want to adjust any priorities or create new goals?"

## Phase 4: Monthly Reflection

Append these section headers to the monthly review note, then guide the user through each:

### Append sections to note

Use Edit to append to the monthly review note file:

```
## Monthly Focus Areas

## What went well this month

## What didn't go well

## Patterns and Observations
```

### Guide reflection with data

For each section, prompt with relevant data:

**Monthly Focus Areas:**
"Based on the projects and goals we just reviewed, what are your 3 focus areas for next month? (Consider your Areas of Focus and any goals that are progressing.)"

Wait for user input, append to note.

**What went well this month:**

- Glob Journal/ files from this past month (past 30 days)
- Scan for positive patterns, completed goals, things that clicked
- Prompt: "Looking at what you completed this month and your journal entries, what stands out as going well?"

Wait for user input, append to note.

**What didn't go well:**
Present the incomplete tasks from Step 3:
"The [N] tasks that didn't get done this month plus any friction you noticed — what didn't work? What got in the way?"

Wait for user input, append to note.

**Patterns and Observations:**

- Glob `*Weekly Review.md` files from this month in vault root
- Read "Observations" sections from each weekly review
- Extract recurring themes
- Prompt: "Looking at your weekly reviews this month, I notice these recurring themes: [X, Y, Z]. Any patterns or observations about the month overall?"

Wait for user input, append to note.

For each reflection, suggest linking to relevant Goals or Areas with `[[Name]]` where appropriate.

## Phase 5: Propose and Execute Changes

1. Collect all pending Todoist changes from Steps 1, 3, and 4:

   ```
   Proposed changes:
   - Move [task] to next month (due: [date])
   - Reschedule [task] to [date]
   - Drop [task]
   - Complete [task]
   ```

2. Present summary and ask: "Confirm these changes?"

3. Apply confirmed changes only.

## Phase 6: Wrap Up

1. Confirm review note is saved with all sections complete
2. Summary:

   ```
   Month reviewed. Note saved: [note name].

   Todoist changes: [N] rescheduled, [N] dropped, [N] moved to next month.

   Next month focus: [X, Y, Z].
   ```

## Critical Rules

- **Never make Todoist changes without explicit approval** — collect all decisions, present summary, get one confirmation
- **Goal-review is suggested, not automatic** — let the user choose whether to invoke it
- **Areas of Focus check is optional** — only prompt if it's been 3+ months since last yearly review
- **Reflection sections are user-written** — the AI prompts with data and asks questions, never writes the reflection for the user
- **Vault note is created at the start** — it's the container for the session, not just an output at the end
