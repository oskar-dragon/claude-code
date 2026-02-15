---
description: This skill should be used when the user asks to "plan my day", "do daily planning", "process my inbox", "review my week", "review my month", "set priorities", "organize tasks", discusses productivity methodology, mentions COD, Time Sector, Fractal Journaling, 2+8 priorities, ZeroInbox, or needs guidance on planning, reviewing, or organizing work within the vault.
---

# Oskar's Productivity System

## Overview

This vault operates on an integrated productivity system combining several frameworks into a unified daily, weekly, and monthly cycle. Understanding these frameworks and their interrelationships enables effective planning, inbox processing, reviews, and task management.

## COD Framework (Collect, Organise, Do)

The overarching three-phase workflow governing all productivity. Never mix phases — complete one before starting the next.

### Collect

Capture without organizing. Speed matters, not structure.

- Quick thoughts → Todoist inbox or journal entry (YYYY-MM-DD HHmm in Journal/)
- Meeting notes → SuperWhisper transcript → /meeting command
- Ideas → Journal/ folder with timestamp prefix
- Tasks → Todoist quick add

Never stop to categorize, file, or link during collection. Capture and move on.

### Organise

Route captured items to proper locations with correct metadata. This is a separate session from collection.

- Process Todoist inbox → assign projects, dates, priorities
- Process journal fragments → file to correct folders with frontmatter
- Route notes → apply templates, set categories property, add wikilinks
- The inbox skill automates this phase
- Apply ZeroInbox 2.0 method (see below)

### Do

Execute using Time Sector planning and Time Blocking.

- Work from the daily plan, not from scattered sources
- Follow time blocks — once planned, stick to it
- Use 2+8 priorities to decide what gets done today

## Time Sector System

Plan _when_ to work, not just _what_ to work on. Two planning cycles:

### Daily Planning (Morning)

Run every morning using /daily-plan:

1. Review yesterday's unfinished items
2. Check today's Todoist tasks
3. Review recent journal fragments (Fractal Journaling daily compilation)
4. Set 2+8 priorities for the day
5. Allocate time blocks on calendar

### Time Sector Task Movement

Tasks flow forward through Todoist Time Sector projects during planning sessions:

```
NEXT MONTH → THIS MONTH → NEXT WEEK → THIS WEEK
```

**Weekly planning promotes:**

- NEXT WEEK → THIS WEEK (based on calendar availability)
- THIS MONTH → THIS WEEK (urgent items only)

**Monthly planning promotes:**

- NEXT MONTH → THIS MONTH (based on calendar and strategic priorities)
- THIS MONTH → THIS WEEK (for first week of new month)

Tasks move forward during planning sessions, never backward. If a task in THIS WEEK doesn't get done, it's either:

- Completed late (mark as done)
- Deferred to NEXT WEEK (move during next weekly planning)
- Dropped (no longer relevant)

This forward-flow system prevents task accumulation and forces regular review of whether tasks remain relevant.

## 2+8 Prioritisation

Daily priority structure applied during morning planning:

- **2 Must-Do Objectives**: Non-negotiable. These get done today regardless of what else happens.
- **8 Important Tasks**: Important but reschedulable. Work through these after the 2 must-dos are complete.

Selection process:

1. Review today's Todoist tasks and any carryover
2. Select 2 tasks that absolutely must be completed today
3. Select 8 tasks that are important but can move to tomorrow if needed
4. Anything beyond 10 items gets deferred

If a must-do doesn't get done, it automatically becomes tomorrow's must-do.

## ZeroInbox 2.0

Inbox processing method used during the Organise phase:

1. **Trash**: Delete anything irrelevant or outdated
2. **Archive**: File reference items to proper locations without actioning
3. **Action This Day**: Move genuinely actionable items to today's task list

Critical rule: Sort first, act later. Process the entire inbox in one morning session without actioning anything — just categorize. Respond and execute during allocated time blocks later in the day.

## Fractal Journaling

Multi-scale review and compilation system. Each level zooms out further, tracing how individual thoughts become bigger themes.

1. **Capture**: Timestamped journal fragments throughout the day (YYYY-MM-DD HHmm in Journal/)
2. **Daily Compilation**: Salient thoughts from fragments → daily note (during /daily-plan)
3. **Weekly Compilation**: Themes from daily notes → weekly review (during /weekly)
4. **Monthly Compilation**: Patterns from weekly reviews → monthly note (during /monthly)
5. **Yearly Compilation**: Major themes → yearly review

## Time Blocking

Calendar allocation for execution (the Do phase):

- Block time for non-negotiables and 2 must-do objectives first
- Then block time for 8 important tasks
- Include buffer time between blocks
- Once planned, stick to the plan — do not reorganize mid-day

## How the Systems Interrelate

```
Morning:  Collect (overnight items) → Organise (inbox/ZeroInbox) → Plan (2+8 + time blocks)
Day:      Do (follow time blocks) → Collect (capture as needed)
Evening:  Collect (capture reflections as journal fragments)
Weekly:   Review (compile + reflect) → Plan (inbox, calendar, projects, task promotion) → Journal entry
Monthly:  Review (compile + reflect) → Plan (calendar, goals, projects, task promotion) → Monthly note
```

## Area -> Goal -> Project Hierarchy

The vault uses a top-down hierarchy from Areas of Focus through Goals to Projects:

```
Area of Focus -> Goal -> Project -> Tasks (in project note)
```

**Areas of Focus** (6 evergreen notes — not created by the plugin):

- Career
- Finances
- Health & Fitness
- Lifestyle & Life Experiences
- Personal Development
- Relationship & Close Connections

**Property mapping:**

| Note type | Property | Maps to                                                               |
| --------- | -------- | --------------------------------------------------------------------- |
| Goal      | `type`   | Area of Focus (e.g., `["[[Career]]"]`)                                |
| Project   | `type`   | Project kind (`["[[Personal Projects]]"]` or `["[[Work Projects]]"]`) |
| Project   | `topics` | Goal or Area it serves (e.g., `["[[Learn Rust]]"]`)                   |

- A goal is achieved through one or more projects
- A project usually serves a goal, but can exist standalone
- Projects sometimes link directly to an Area if no specific goal exists
- Tasks within a project live in the project note's `## Tasks` section (source of truth), NOT in Todoist
- Each project gets ONE Todoist project-reference task for Time Sector visibility

## Key Distinctions

- **Area vs Goal**: An area of focus is an ongoing life domain (Career, Health). A goal is a specific desired outcome within an area, with a target timeframe.
- **Goal vs Project**: A goal describes what you want to achieve. A project describes how — the concrete work to get there. Goals are achieved through projects.
- **Task vs Project**: A project requires multiple tasks to complete. A single actionable item is a task. Do not confuse with Process (ongoing, never-ending activity like "stay fit").
- **Project tasks vs Todoist tasks**: A project's task breakdown lives in the Obsidian project note. Todoist only gets ONE project-reference task (a deep link for Time Sector visibility).
- **Collecting vs Organising**: Never do both at once. Capture fast during collection, organise methodically later.
- **Planning vs Doing**: Plan in the morning, execute during the day. Do not replan mid-execution unless genuinely urgent.
