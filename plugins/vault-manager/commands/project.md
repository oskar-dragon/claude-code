---
description: Create a new project or review existing projects — track status, link to goals, break down next steps
argument-hint: [create|review]
---

Manage projects in the vault. Use the todoist-workflow skill for task creation and the productivity-system skill for the task vs project distinction.

## Determine Mode

If argument is "create" or "review", use that mode.

Otherwise, ask Oskar:

- **Create**: Set up a new project note
- **Review**: Check status of existing projects

Use AskUserQuestion to determine which mode.

## Create Mode

### Step 1: Gather Project Details

Ask Oskar about the project:

- What is the project? (name and brief description)
- What is the goal of this project?
- What type? (personal project, work project, etc.)
- What topics does it relate to?
- Which organization? (if work-related)
- Does it link to any existing goals?

### Step 2: Create Project Note

Read `Templates/Project Template.md` first — it defines the frontmatter structure:

```yaml
categories:
  - "[[Projects]]"
type:
  - "[[Personal Projects]]"
topics: []
organization: []
created: (today's date)
start: (today or specified)
end:
year:
url:
status:
  - "[[Active]]"
```

Create the project note in `Projects/` folder with:

- Descriptive filename (e.g., `Projects/Vault Manager Plugin.md`)
- Template frontmatter filled in with Oskar's answers
- **## Project Goal** section: what success looks like
- **## Tasks** section: initial task breakdown
- **## Resources** section: relevant links, notes, and references
- Add wikilinks to related goal notes, people, and other projects

### Step 3: Create Todoist Tasks

Break the project into actionable next steps:

- Create Todoist tasks for the first batch of work
- Include deep link to the project note in each task description
- Create or assign to a matching Todoist project if appropriate

### Step 4: Update Memory

Save project creation to auto memory projects.md topic file.

## Review Mode

### Step 1: Read Projects

Read project notes from `Projects/` folder:

- Filter to active projects (check `status` property)
- Note last activity based on modification dates

### Step 2: Surface Status

For each active project:

- Read the project note for current state
- Check related meeting notes (search for wikilinks to the project)
- Check Todoist for linked tasks (search for deep links in task descriptions)
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

- Help break down next steps into specific tasks
- Create Todoist tasks with deep links
- Update project notes with new status or tasks

### Step 5: Update Memory

Save project status changes to auto memory.
