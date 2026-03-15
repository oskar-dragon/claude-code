---
name: goal-review
description: Review progress on all active goals — gathers evidence from projects, tasks, and journal entries, presents each goal with an assessment, and prompts reflection. Use when the user says "goal review", "review my goals", "check goals", "how are my goals going", or when invoked from a monthly or yearly review. Collaborative: presents evidence and waits for the user to judge their own progress.
allowed-tools:
  - Glob
  - Read
  - Grep
  - AskUserQuestion
  - mcp__plugin_obsidian-vault_todoist__find-tasks
  - mcp__plugin_obsidian-vault_todoist__find-completed-tasks
  - mcp__plugin_obsidian-vault_todoist__add-tasks
  - mcp__qmd__search
---

# Goal Review — Progress Check on Active Goals

Review every active goal with evidence from the vault and Todoist. The AI presents data and asks questions — the user judges their own progress.

## Process

### 1. Gather Active Goals

- Grep vault root for notes with `categories:` containing `[[Goals]]`
- Filter to notes where `done:` is `false` or absent
- Read each goal note's What, Why, and How sections

### 2. For Each Goal, Gather Evidence

**Related projects:**
- Grep for project notes with `topics:` containing the goal name (wikilink)
- Read their status and Project Goal section

**Todoist tasks:**
- find-tasks with text search for the goal name (to find related tasks)
- find-completed-tasks for past 30 days filtered to related tasks
- Note: recurring tasks indicate habit establishment

**Journal mentions:**
- mcp__qmd__search for the goal name and related terms
- Look for: recency (when last mentioned), energy (enthusiasm vs dread), frequency (how often it comes up)

**Vault activity:**
- Note how much note-taking activity the goal has generated in the past 30 days

### 3. Assess and Present Each Goal

Present each goal with:

```
---
**Goal: [name]**
Why: [from goal note]

**Evidence:**
- Projects: [list with status]
- Recent tasks: [completed in past 30 days]
- Outstanding tasks: [what's still pending]
- Journal mentions: [recent, [N] times in past 30 days]
- Last activity: [date]

**Assessment:** Progressing / Stalled / Drifting / New
- Progressing: clear recent activity, tasks being completed, journal engagement
- Stalled: no activity in 2+ weeks, pending tasks piling up
- Drifting: mentioned in journal but no concrete action
- New: < 2 weeks old, not enough data
---
```

### 4. Prompt Reflection for Each Goal

After presenting each goal's evidence, ask three questions:

1. "Are you making progress on this goal?" (let the user judge — you presented the evidence)
2. "Does the Why still motivate you?" (read their Why back to them if needed)
3. "What needs to happen next to move this forward?"

Wait for user responses before moving to the next goal.

### 5. Handle Stalled Goals

For goals assessed as Stalled:

> "This goal hasn't had activity in [N] weeks. The Why was: [why from goal note]. Is the Why still strong enough? Would you like to:
> - Refocus: recommit and set a specific next action
> - Adjust: change the goal's scope or approach
> - Drop: archive it — it's OK if priorities change"

Wait for user's choice. If they want to refocus, capture the next action.

### 6. Capture Next Actions

After going through all goals, collect any next actions the user identified:

> "You mentioned these next actions:
> [list]
>
> Want me to add them to Todoist?"

Add only with explicit approval.

## Output Rules

- Terminal only. No vault changes (unless user asks to update a goal note — rare).
- This is a conversation, not a report. Surface evidence, then ask.
- Don't rush through goals — one at a time, wait for responses.
- If there are many goals (5+), ask first: "You have [N] active goals. Want to review all of them now, or focus on specific areas?"
