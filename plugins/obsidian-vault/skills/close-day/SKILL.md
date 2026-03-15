---
name: close-day
description: End-of-day planning ritual — processes today's journal entries, clears action items, and plans tomorrow with the 2+8 prioritisation method. Use when the user says "close day", "end of day", "plan tomorrow", "daily planning", or "wrap up the day". This skill is collaborative: it surfaces findings, presents recommendations, and waits for approval before making any changes.
allowed-tools:
  - Glob
  - Read
  - Grep
  - Edit
  - Skill
  - AskUserQuestion
  - mcp__claude_ai_Google_Calendar__gcal_list_events
  - mcp__claude_ai_Gmail__gmail_search_messages
  - mcp__plugin_obsidian-vault_todoist__find-tasks
  - mcp__plugin_obsidian-vault_todoist__find-tasks-by-date
  - mcp__plugin_obsidian-vault_todoist__update-tasks
  - mcp__plugin_obsidian-vault_todoist__add-tasks
---

# Close Day — End-of-Day Planning Ritual

Guide the user through a 10-15 minute end-of-day review and planning session. This is a conversation, not an automation. Surface findings, ask for confirmation, wait for approval before every change.

## Phase 1: Process Today

### 1. Read Today's Journal Entries

- Glob Journal/ files matching today's date pattern (YYYY-MM-DD\*.md)
- Read all entries from today

### 2. Extract Action Items

From the journal entries, find:

- **Tasks mentioned or implied**: "I need to...", "TODO", "follow up on...", "should...", "must..."
- **Commitments made**: "I told X I'd...", "promised to...", "said I would..."
- **Ideas worth capturing**: new frameworks, insights, original thoughts worth a standalone note
- **Open questions**: unresolved questions, things still unclear

### 3. Check Email Inbox

- Use gmail_search_messages with query "is:unread newer_than:1d" to find action-required emails from the last 24 hours
- Scan subject lines and senders for anything that needs a response or action
- Note action items from emails

### 4. Present Findings

Present what you found:

```
Here's what I found today:

**From your journal:**
[List extracted tasks, commitments, ideas, open questions]

**From email:**
[List action-required emails]

Anything to add or correct before we process these?
```

Wait for user confirmation before proceeding.

## Phase 2: File Extracted Items (with approval)

### 5. Process Tasks

Present the task list and ask:

```
These look like tasks:
[numbered list]

Want me to add them to Todoist? (You can exclude any or adjust the wording)
```

Wait for approval. Only add tasks that are explicitly approved. When approved, add to Todoist with appropriate project/label if inferable from context.

### 6. Flag Graduate Candidates

If any ideas look like they could become standalone notes, flag them — but don't create them now:

```
These ideas might be worth graduating to standalone notes (we can do that separately with /graduate):
[list with brief why]
```

### 7. Suggest Backlinks

For today's journal entries, identify terms that could link to existing vault notes. Present suggestions and offer to apply:

```
These terms in today's journal could link to existing notes:
- "[[Term A]]" in entry YYYY-MM-DD HHmm — links to [[Existing Note]]
- "[[Term B]]" in entry YYYY-MM-DD HHmm — links to [[Other Note]]

Want me to add these links? (y/n or pick specific ones)
```

Apply only approved links using Edit.

## Phase 3: Plan Tomorrow (2+8 Method)

### 8. Read Tomorrow's State

- gcal_list_events for tomorrow
- find-tasks-by-date with startDate: tomorrow's date
- find-tasks with filter "overdue"

### 9. Present Tomorrow's Plate

Show what's on tomorrow:

```
Tomorrow — [day, date]:

**Calendar:**
[List events with times]

**Tasks due:**
[List Todoist tasks due tomorrow]

**Overdue (carrying forward):**
[List overdue tasks]
```

### 10. Recommend 2+8

Apply the 2+8 method:

- **2 Must-Complete**: tasks that, if not done, block others / have hard deadlines / compound negatively if delayed
- **8 Should-Do**: important but can reschedule if needed

Selection criteria:

- Does missing this block someone else?
- Is there a hard external deadline?
- Does delaying make it harder/worse?
- Is it calendar-constrained (must happen during a specific meeting)?

Present recommendation:

```
Given your calendar tomorrow, here's my recommendation:

**2 Must-Complete:**
1. [Task] — because [reason]
2. [Task] — because [reason]

**8 Should-Do:**
[numbered list]

Does this prioritisation look right? Want to adjust anything?
```

Wait for approval/adjustments.

### 11. Execute Approved Changes

After approval, offer to:

- Reschedule/move tasks in Todoist as agreed (with explicit confirmation per change)
- Note any tasks being deprioritised

## Phase 4: Carry Forward

### 12. Summary

Close with:

```
Tomorrow's focus:
- Must-do: [2 tasks]
- [N] other tasks queued

[Any flags about conflicts or calendar blocks]

Have a good evening.
```

## Critical Rules

- **Never make a Todoist change without explicit approval** — not even obvious ones
- **Never add journal backlinks without showing them first**
- **Graduate candidates are flagged, not created** — creation happens via /graduate
- **The 2+8 method is a recommendation** — the user decides the final priority
- If no journal entries exist for today, say so and proceed to email check
- If no email action items, skip that section silently
