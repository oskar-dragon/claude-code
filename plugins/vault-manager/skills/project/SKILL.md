---
description: This skill should be used when the user asks to "create a project", "review my projects", "start a new project", "check project status", or wants to ideate, create, or review projects in the vault.
argument-hint: [create|review]
version: "2.0.0"
---

Manage projects in the vault. Use the todoist-workflow skill for Todoist integration and the productivity-system skill for the Area -> Goal -> Project hierarchy.

## Determine Mode

If argument is "create" or "review", use that mode.

Otherwise, ask Oskar:

- **Create**: Ideate and set up a new project
- **Review**: Check status of existing projects

Use AskUserQuestion to determine which mode.

## Create Mode

### Step 1: Ideate — Understand the Project

Ask Oskar questions **one at a time** to understand the project. Prefer multiple choice when possible.

1. What is the project? (name and brief description)
2. Which goal or area of focus does it serve? (read `Goals/` folder for active goals — populates `topics` property)
3. What type? (populates `type` property)
   - Personal Project → `["[[Personal Projects]]"]`
   - Work Project → `["[[Work Projects]]"]`
4. If work: which organization? (populates `organization` property)

### Step 2: Ideate — Think Through the Project

Help Oskar think through the project collaboratively:

- Propose approaches and discuss trade-offs
- Refine scope — apply YAGNI ruthlessly
- Arrive at:
  - A clear **project goal** (what success looks like)
  - A **task breakdown** (concrete steps as checkboxes)
  - **Resources and references** (relevant links, notes)

Present the proposed plan and get Oskar's approval before creating the note.

### Step 3: Create Project Note

Read [project-template.md](project-template.md) first — it defines the frontmatter structure.

Create the project note in `Projects/` folder with:

- Descriptive filename (e.g., `Projects/Vault Manager Plugin Update.md`)
- Template frontmatter filled in with Oskar's answers:
  ```yaml
  categories:
    - "[[Projects]]"
  type:
    - "[[Personal Projects]]" # or "[[Work Projects]]"
  topics:
    - "[[Goal Name]]" # or "[[Area Name]]" if no goal
  organization: [] # e.g., ["[[Qogita]]"] if work
  created: (today's date)
  start: (today or specified)
  end:
  year:
  url:
  status:
    - "[[Active]]"
  ```
- **## Project Goal** section: what success looks like
- **## Tasks** section: the agreed task breakdown as markdown checkboxes — this is the **source of truth** for what needs doing
- **## Resources** section: relevant links, notes, and references
- Add wikilinks to related goal notes and other projects

### Step 4: Create Todoist Project-Reference Task

Create **ONE** Todoist task that represents this project. This is NOT a task from the project's breakdown — it is a reference so Oskar can see the project in his Time Sector view and click through to the Obsidian note.

- **Task content**: `[Project Name](obsidian://open?vault=Vault%20V2&file=Projects%2F<URL-encoded-name>)` — deep link in the task name so it's clickable
- **Time Sector bucket**: Ask Oskar which one (use the todoist-workflow skill for project IDs):
  - THIS WEEK
  - NEXT WEEK
  - THIS MONTH
  - LONG TERM
- **Labels**: Based on context:
  - "Projects" for personal projects
  - "Work" for work-related projects
  - "Planning" if the project is in a planning phase
  - "Studying" if study-related
- **No due date** unless Oskar specifies one

Use `add-tasks` with content, projectId, and labels parameters.

### Step 5: Update Memory

Save project creation to auto memory projects.md topic file.

## Review Mode

### Step 1: Read Projects

Read project notes from `Projects/` folder:

- Filter to active projects (check `status` property)
- Note last activity based on modification dates

### Step 2: Surface Status

For each active project:

- Read the project note for current state and `## Tasks` section
- Check related meeting notes (search for wikilinks to the project)
- Check Todoist for the project-reference task (search for deep links containing the project name)
- Review recent journal entries mentioning the project
- Identify stalled projects (no activity for 2+ weeks)

### Step 3: Present Summary

Present project status to Oskar:

- Active projects with current status
- Stalled projects needing attention
- Recently completed projects
- Projects with upcoming deadlines

### Step 4: Plan Next Steps

For projects needing action:

- Help break down next steps and **add them to the project note's `## Tasks` section** — the project note is the source of truth
- If a project-reference task doesn't exist in Todoist (legacy project), offer to create one
- Update project notes with new status

Do NOT create individual Todoist tasks for project work items.

### Step 5: Update Memory

Save project status changes to auto memory.
