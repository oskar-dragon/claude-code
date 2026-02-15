---
description: This skill should be used when the user asks to "create a goal", "review my goals", "set a new goal", "check goal progress", or wants to ideate, create, or review goals linked to areas of focus.
argument-hint: [create|review]
version: "2.0.0"
---

Manage goals in the vault. Use the productivity-system skill for the Area -> Goal -> Project hierarchy.

Goals live in Obsidian, not Todoist. A goal is achieved through projects. The only exception is recurring/habit goals which need Todoist recurring tasks for daily execution.

## Determine Mode

If argument is "create" or "review", use that mode.

Otherwise, ask Oskar:

- **Create**: Ideate and set up a new goal
- **Review**: Check progress on existing goals

Use AskUserQuestion to determine which mode.

## Create Mode

### Step 1: Ideate — Understand the Goal

Ask Oskar questions **one at a time** to understand the goal. Prefer multiple choice when possible.

1. What is the goal? (short description)
2. Which Area of Focus does it belong to? Present the 6 areas as choices (populates `type` property):
   - Career
   - Finances
   - Health & Fitness
   - Lifestyle & Life Experiences
   - Personal Development
   - Relationship & Close Connections
3. Why is it important? (connect to the Area's motivation)
4. Is this a one-time goal or a recurring/habit goal?
   - **One-time**: "Save £35k", "Learn Rust", "Plan trip to Peru" — achieved through projects
   - **Recurring/habit**: "Exercise 3x/week", "Read daily" — needs Todoist recurring tasks
5. What year and quarter is this for?

### Step 2: Ideate — Think Through the Goal

Help Oskar think through the goal collaboratively:

- What does success look like?
- What's the approach and key milestones?
- What are potential obstacles and mitigations?

Present the proposed plan and get Oskar's approval before creating the note.

### Step 3: Create Goal Note

Read [goal-template.md](goal-template.md) first — it defines the frontmatter structure.

Create the goal note in `Goals/` folder with:

- Descriptive filename (e.g., `Goals/Learn Rust.md`)
- Template frontmatter filled in with Oskar's answers:
  ```yaml
  categories:
    - "[[Goals]]"
  type:
    - "[[Career]]" # Area of Focus as wikilink
  year: 2026
  quarter: 1
  done: false
  ```
- **## What** section: short description
- **## Why** section: motivation, tied to the Area of Focus
- **## How** section: approach, milestones, and obstacle mitigations
- Keep the `![[Projects.base#Topic]]` embed from the template
- Add wikilinks to related area notes and existing projects

### Step 4: Branch Based on Goal Type

**One-time goal:**

- Suggest which project(s) Oskar should create to achieve this goal
- Name each suggested project and briefly explain what it would cover
- Do NOT create the projects — that's `/vault-manager:project`'s job with its own ideation flow
- Do NOT create any Todoist tasks

**Recurring/habit goal:**

- Create recurring Todoist task(s) with:
  - Appropriate recurrence (e.g., `dueString: "every Monday, Wednesday, Friday"`)
  - Deep link to goal note in the task **description** (not the name — these are action items, not reference tasks)
  - Labels based on context (e.g., "Projects" or contextual label)
  - Time Sector bucket if appropriate

### Step 5: Update Memory

Save goal creation to auto memory goals.md topic file.

## Review Mode

### Step 1: Read Goals

Read all goal notes from `Goals/` folder:

- Filter to active goals (`done: false`)
- Group by year/quarter and Area of Focus (`type` property)
- Note current status based on note content

### Step 2: Surface Progress

For each active goal:

- Check related project activity (search `Projects/` folder for notes with `topics` linking to this goal)
- For recurring/habit goals: check Todoist for the recurring task (search for deep links to the goal note)
- Check for recent journal mentions
- Assess whether the goal is on track, stalled, or blocked

### Step 3: Present Summary

Present goal status to Oskar:

- Active goals grouped by Area of Focus
- Progress assessment for each
- Stalled or blocked goals needing attention
- Goals approaching their target quarter/year

### Step 4: Suggest Actions

For goals needing attention:

- **One-time goals**: Suggest projects to create (via `/vault-manager:project`). Do NOT create Todoist tasks.
- **Recurring/habit goals**: Check if the recurring Todoist task still exists and is active. If not, offer to create one.
- Update goal notes with new status information

### Step 5: Update Memory

Save goal status changes and insights to auto memory.
