---
name: review-yearly
description: Yearly review and reflection — creates a yearly review note, surfaces themes from monthly reviews, guides a goal review, reviews Areas of Focus, and sets direction for the coming year. Use when the user says "yearly review", "annual review", "year in review", "review the year", or "year end review". Collaborative and reflective.
allowed-tools:
  - Glob
  - Read
  - Grep
  - Edit
  - Skill
  - AskUserQuestion
---

# Review Yearly — Annual Reflection and Direction Setting

Guide the user through a yearly review. If monthly reviews have been consistent, this is a broader directional check rather than a dramatic reckoning.

## Phase 1: Create the Review Note

Use the `obsidian:obsidian-cli` skill to create the yearly review note:

- Name: `YYYY Yearly Review.md` (e.g., `2026 Yearly Review.md`)
- Template: Yearly Review Template
- The template embeds `![[Reviews.base#Yearly]]` which pulls in that year's monthly reviews

## Phase 2: Review the Year

### 1. Read Monthly Reviews

- Glob for `*Monthly Review.md` files in vault root (all monthly reviews)
- Filter to the current or specified year (e.g., `2026-*Monthly Review.md`)
- Read each monthly review's reflection sections (What went well, What didn't, Observations, Patterns)

### 2. Surface Recurring Themes

Synthesise across monthly reviews and present:

```
Looking at your [N] monthly reviews from this year:

**Recurring themes (came up in 3+ months):**
[list with month references]

**Goals that progressed:**
[list with evidence]

**Goals that stalled:**
[list with evidence]

**Patterns in "What went well":**
[synthesis]

**Patterns in "What didn't go well":**
[synthesis]
```

Ask: "Does this capture how the year felt? Anything you'd add or push back on?"

### 3. Suggest Goal Review

> "Before we look forward, it's worth reviewing how your goals did this year. Want to run goal-review now? (It will review each active goal with evidence.)"

If yes: ask user to run `/goal-review` in a separate session or continue with a quick manual check.

### 4. Areas of Focus Check

- Read `Categories/Areas.md` and linked area notes
- For each Area of Focus, present evidence of attention (or neglect) from the year:
  - Goals in that area (active, completed, stalled)
  - Projects in that area
  - Journal themes relating to the area
  - Calendar/Todoist signals from monthly reviews

Present:

```
**[Area Name]:**
- Goals this year: [list]
- Projects: [list]
- Journal themes: [what came up]
- Signal: Active (lots of attention) / Balanced / Neglected

```

Ask: "Are these still the right Areas of Focus? Has anything shifted?"

Wait for user response. Note any areas to add, remove, or rebalance.

## Phase 3: Forward-Looking

Work through these questions collaboratively, one at a time. Wait for responses.

### New Goals

"Based on this year, what goals do you want to set for next year? (Think about each Area of Focus — which ones need new direction?)"

### Projects

"Any projects to start, stop, or continue?

- **Start**: new projects you're committing to
- **Stop**: projects to drop or archive
- **Continue**: projects carrying over"

### Areas of Focus Rebalancing

If any areas were flagged as neglected or over-attended:

"You flagged [area] as [neglected/over-attended]. Do you want to adjust how much attention it gets next year?"

## Phase 4: Append Reflection to Note

Use Edit to append to the yearly review note:

```
## Year in Review

## Areas of Focus Summary

## Looking Forward: Goals for Next Year

## Looking Forward: Projects

## Key Lessons from This Year
```

Guide the user through each section. For "Year in Review" and "Key Lessons", prompt with the recurring themes and patterns you surfaced. For the forward-looking sections, use the decisions from Phase 3.

Wait for user input for each section before appending.

## Phase 5: Wrap Up

1. Confirm review note is saved with all sections complete
2. If user decided on new goals, remind them to create goal notes: "Don't forget to create notes for your new goals."
3. Summary:
   ```
   Year reviewed. Note saved: [note name].
   [N] areas reviewed, [N] carried forward, [N] new goals planned.
   ```

## Critical Rules

- Reflection is user-written — AI surfaces data and asks questions, never writes the reflection
- Goal review is suggested, not automatic
- Areas of Focus changes are noted but not executed (user creates/archives notes themselves)
- If there are no monthly reviews for the year, note this and work from journal entries instead
