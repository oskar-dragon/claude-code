---
description: Create a new goal or review existing goals — track progress, link to projects, create next-action tasks
argument-hint: [create|review]
---

Manage goals in the vault. Use the productivity-system skill for planning methodology and the todoist-workflow skill for task creation.

## Determine Mode

If argument is "create" or "review", use that mode.

Otherwise, ask Oskar:

- **Create**: Set up a new goal note
- **Review**: Check progress on existing goals

Use AskUserQuestion to determine which mode.

## Create Mode

### Step 1: Gather Goal Details

Ask Oskar about the goal:

- What is the goal? (short description)
- Why is it important?
- How will it be achieved? (rough approach)
- What year and quarter is this for?
- What type of goal? (career, financial, health, personal, etc.)

### Step 2: Create Goal Note

Read `Templates/Goal Template.md` first — it defines the frontmatter structure:

```yaml
categories:
  - "[[Goals]]"
type: (wikilink to goal type, e.g., "[[Career]]")
year: (integer)
quarter: (integer)
done: false
```

Create the goal note in `Goals/` folder with:

- Descriptive filename (e.g., `Goals/Learn Rust.md`)
- Template frontmatter filled in with Oskar's answers
- **## What** section: short description
- **## Why** section: motivation
- **## How** section: approach and milestones
- Keep the `![[Projects.base#Topic]]` embed from the template
- Add wikilinks to related project notes and areas

### Step 3: Create Next Actions

Create Todoist tasks for immediate next steps:

- Break the goal into first actionable tasks
- Add deep links to the goal note in task descriptions
- Set appropriate due dates

### Step 4: Update Memory

Save goal creation to auto memory goals.md topic file.

## Review Mode

### Step 1: Read Goals

Read all goal notes from `Goals/` folder:

- Filter to active goals (`done: false`)
- Group by year/quarter
- Note current status based on note content

### Step 2: Surface Progress

For each active goal:

- Check related project activity (linked project notes)
- Review Todoist tasks linked to the goal (search for deep links)
- Check for recent journal mentions
- Assess whether the goal is on track, stalled, or blocked

### Step 3: Present Summary

Present goal status to Oskar:

- Active goals with progress assessment
- Stalled or blocked goals needing attention
- Goals approaching their target quarter/year

### Step 4: Create Actions

For goals needing attention:

- Suggest next steps
- Create Todoist tasks with deep links
- Update goal notes with new status information

### Step 5: Update Memory

Save goal status changes and insights to auto memory.
