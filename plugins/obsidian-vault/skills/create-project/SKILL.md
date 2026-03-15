---
name: create-project
description: "Use this when the user wants to brainstorm, plan, or scope a new project or process. Triggers on phrases like 'I want to start a project', 'I have a project idea', 'new project about...', 'let me plan a project', or 'I want to brainstorm a project'. Also use this when the user describes something that sounds like a multi-step initiative they haven't done before. Do NOT use this for code brainstorming or software design — that's the brainstorming skill."
---

# Plan Project

Turn a vague project idea into a scoped, actionable project note (or process checklist) through focused conversation. Inspired by Carl Pullein's project planning philosophy: lean planning, no over-engineering, bias toward doing.

## Hard Gate

Do NOT create any notes or Todoist tasks until the conversation is complete and the user has approved the draft. The whole point is to think before acting.

## Anti-Pattern: Over-Planning

Excessive planning is procrastination in disguise. The goal is a clarifying sentence, a task breakdown of what's visible right now, and a first action. Not a detailed project timeline. If you catch yourself (or the user) spiralling into contingency planning, flag it and move on.

## Conversation Rules

- **One question at a time.** Never overwhelm with multiple questions in a single message.
- **Multiple choice when possible.** Easier to answer than open-ended questions.
- **Lead with your recommendation** when presenting options, then briefly list alternatives.
- **Keep it moving.** If the user gives a clear answer, don't rephrase or summarise — ask the next question.

## The Flow

Work through these steps in order. Each step is one exchange (question → answer), though some may need a follow-up if the answer is unclear.

### Step 1: Project or Process?

Ask whether the user has done something like this before.

- If **yes** → this is a **process**, not a project. Switch to the process path (see below).
- If **no** or **not sure** → continue as a project.

The question matters because projects need scoping while processes just need a checklist. Don't skip it — it catches the case where someone thinks they need a project but actually has a repeatable workflow.

### Step 2: Clarifying Sentence

The single most important output. Push the user to state:
- **The desired outcome** — what does "done" look like?
- **The deadline** — when does it need to be done by? (If no hard deadline, ask for a target.)

JFK's moon speech is the gold standard: clear, deadline-bound, no ambiguity. If the user's first attempt is vague, push back once. If it's still vague after that, accept it and move on — you can refine later.

### Step 3: Deadline

If the clarifying sentence didn't include a concrete deadline, ask for one now. Accept "no deadline" but note it — projects without deadlines tend to drift.

### Step 4: Goal Alignment

Search the vault for existing goals (notes with `categories: ["[[Goals]]"]`). Present them as a list and ask which one this project supports.

If no goal fits:
- Flag it: "This doesn't seem to align with any of your current goals. That's either a sign this project shouldn't exist right now, or that you need a new goal. Which is it?"
- If new goal needed, note it but don't create it now — stay focused on the project.

Link the matching goal via the `topics` property in frontmatter.

### Step 5: Task Breakdown

Ask: "What are the major steps you can see right now?"

Build the task list collaboratively:
- Use the user's language, not your rewording
- Nest subtasks under parent tasks where natural
- Mark uncertain or conditional tasks (things that depend on earlier steps resolving)
- Order tasks sequentially
- Keep tasks as concrete actions, not vague phases

Don't push for exhaustive coverage. Pullein's principle: identify what you can see now, let the rest reveal itself as you progress.

### Step 6: First Action

Confirm which task is the very first thing to do. This becomes the Todoist task.

### Step 7: Draft and Approve

Present the complete project note draft (frontmatter + content) for the user's approval. Include:
- Filled frontmatter (categories, type, topics, organization, status, dates)
- Clarifying sentence under `## Project Goal`
- Task breakdown under `## Tasks` (as a nested checklist)
- Empty `## Resources` section

Ask: "Does this look right?" Wait for approval before creating anything.

### Step 8: Create

Once approved:
1. **Create the project note** in the vault root using the obsidian-cli (to get template integration and link awareness)
2. **Create the first task** in Todoist inbox — simple, actionable, referencing the project name

## Process Path

If Step 1 identifies this as a process:

1. **Ask what the steps are** — build the checklist collaboratively, same principles as the task breakdown (one question at a time, use their language)
2. **Determine where the trigger task goes:**
   - Maintenance/life admin → Routines folder in Todoist (recurring)
   - Tied to an area of focus → Recurring Areas of Focus folder in Todoist (recurring)
   - Other → Todoist inbox
3. **Draft the process note** — frontmatter with `categories: ["[[Processes]]"]` + the checklist as the note body
4. **Get approval**, then create the note and the trigger task in Todoist

## Frontmatter Reference

### Project Note
```yaml
categories:
  - "[[Projects]]"
type:
  - "[[Personal Projects]]"  # or "[[Work Projects]]" based on context
topics:
  - "[[Goal Name]]"  # linked goal from Step 4
organization: []
created: YYYY-MM-DD
start: YYYY-MM-DD
end:  # deadline from clarifying sentence
year: YYYY
url:
status:
  - "[[Active]]"
```

### Process Note
```yaml
categories:
  - "[[Processes]]"
created: YYYY-MM-DD
```

## Key Principles

- **Lean planning** — clarifying sentence → tasks you can see → first action → go
- **One question at a time** — respect the user's attention
- **Flag drift** — if the conversation goes off-track, name it and return
- **Don't invent tasks** — only include what the user identifies
- **Bias toward action** — the note is a launchpad, not a comprehensive plan
