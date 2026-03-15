---
name: drift
description: Compare stated goals against actual behaviour over the past 30-60 days to surface avoidance patterns and misalignment. Use when the user says "drift", "am I on track", "what am I avoiding", "goal alignment", "where is my time going", or "what keeps getting pushed". No vault changes — this is a diagnostic read-only skill.
allowed-tools:
  - Glob
  - Read
  - Grep
  - mcp__claude_ai_Google_Calendar__gcal_list_events
  - mcp__plugin_obsidian-vault_todoist__find-tasks
  - mcp__plugin_obsidian-vault_todoist__find-completed-tasks
  - mcp__qmd__search
---

# Drift — Intention vs Behaviour Analysis

Surface the gap between what the user says matters and what they actually do. Present an honest, evidence-based diagnostic.

**Default scope:** Past 30 days. If user specifies 60 days, use that.

## Phase 1: Gather Stated Intentions

### Active Goals
- Grep vault root for notes with `categories:` containing `[[Goals]]` and `done: false`
- Read each goal's What and Why sections

### Active Projects
- Grep vault root for notes with `categories:` containing `[[Projects]]` and status Active or empty
- Read project name and goal

### Areas of Focus
- Read `Categories/Areas.md` and linked area notes

### Intention Statements from Journal
- Glob Journal/ files from past 30 days
- Scan for: "I need to...", "I should...", "I want to...", "I must...", "I've been meaning to..."
- Extract stated intentions (what the person says matters to them)

## Phase 2: Gather Actual Behaviour

### Todoist Activity
- find-completed-tasks for past 30 days — what actually got done
- find-tasks with filter "overdue" — what keeps not getting done
- find-tasks to look for recurring tasks that keep appearing — recurring push patterns

### Calendar Reality Check
- gcal_list_events for past 30 days
- Categorise: where did the time actually go?

### Journal Topic Frequency
- mcp__qmd__search for each active goal name
- Note: which goals have lots of recent journal activity vs which are absent

### Vault Activity per Goal
- For each goal, how many notes were created or modified that link to it in the past 30 days?
- Use Grep to count `[[Goal Name]]` occurrences in recent Journal/ files

## Phase 3: The Drift Report

Present a structured report (terminal only):

### Alignment Table

```
| Goal | Stated Importance | Actual Activity | Alignment |
|------|------------------|-----------------|-----------|
| [goal] | [why from goal note] | [tasks done, mentions] | 1-10 |
```

Alignment score:
- 8-10: Actions match intentions clearly
- 5-7: Some activity but inconsistent
- 3-4: Stated but rarely acted on
- 1-2: Named as important but no evidence of action

### Unplanned Attention

What got time and energy that isn't in any active goal:
- Calendar categories that don't map to goals
- Completed tasks that don't relate to any stated goal
- Topics appearing frequently in journal without a goal

### Avoidance Patterns

For each goal with low alignment, present:
```
**Avoiding: [goal name]**
- Evidence: mentioned [N] times in journal, [N] tasks completed, last action: [date]
- Possible why: [one of: fear of failure, unclear next step, not actually important, too big/vague, external blocker]
- Classification: Active avoidance (mentioned recently, still not acting) / Passive (not even being thought about)
```

### Recurring Push Patterns

Tasks that appear repeatedly but never get done:
- "These tasks have been rescheduled or missed [N] times: [list]"
- These are the most actionable signal — they show exactly where the gap is

### Honest Assessment

A plain-language summary:
> "Here's where intention and action don't match: [concise statement].
> The biggest gap is [top drift item]. [One sentence why this might be happening]."

### Recommendations

For each significant drift item, recommend ONE of:
- **Drop it**: "You haven't acted on this in [N] days. If it's not important enough to act on, remove it as a goal."
- **Do it now**: "This keeps getting pushed. What would it take to do one thing on it today?"
- **Delegate**: "This requires [something] you don't have bandwidth for. Who could take this?"
- **Reframe**: "The goal might be too vague. Could it be reframed as [more specific]?"

## Output Rules

- Terminal only. No vault changes.
- Present the report all at once — this isn't a conversation, it's a diagnostic.
- Be honest, not kind. The user asked for this because they suspect drift.
- Evidence-based: every claim references specific data (task names, dates, counts).
- After the report, ask: "Want to act on any of these? I can help you update Todoist or your goals."
