---
description: View learning progress, confidence map, and readiness
version: 0.1.0
author: Oskar Dragon
allowed-tools: Read(*), Grep(*), Glob(*)
---

## Context

Course outline: !`cat course-outline.md 2>/dev/null || echo "NO_COURSE — run /tutor:create-course first"`

## Your Task

Read the learner's progress from auto memory and present a clear, concise progress report.

### What to Show

**1. Course Overview**
- Course title and project
- Total modules and how many are completed
- Simple progress indicator (e.g., "Module 7 of 20")

**2. Completed Modules**
- List completed modules with their titles
- For each, note if a quiz was done and the confidence rating

**3. Concept Confidence Map**
- List concepts that have been covered
- Group by confidence level:
  - **Solid** — answered correctly with "Knew it" confidence
  - **Getting there** — answered correctly with "Somewhat sure" or tested multiple times with improving results
  - **Needs reinforcement** — answered incorrectly, or "Guessed" confidence
- If no quizzes have been done yet, note that confidence data will build as modules progress

**4. Next Up**
- What the next module is (title and concepts)
- Any concepts from "Needs reinforcement" that will be organically reviewed in upcoming modules

### Format

Keep the report clean and scannable. Use tables or bullet lists — no walls of text. Example structure:

```
## Progress: [Course Title]

**Module 7 of 20** — [Project Name]

### Completed
| # | Module | Quiz | Confidence |
|---|--------|------|------------|
| 1 | Python Basics | Predict output | Knew it |
| 2 | Data Structures | Multiple choice | Somewhat sure |
| 3 | Functions | — (skipped) | — |
...

### Confidence Map

**Solid:** variables, f-strings, list comprehensions, dict access
**Getting there:** function arguments, return types
**Needs reinforcement:** decorators, error handling

### Next Up
Module 8: Error Handling with try/except
- Will naturally revisit: decorators (used in exercise)
```

### If No Progress Exists

If there's no progress data in auto memory:
- Check if a course outline exists
- If yes: "No modules completed yet. Run `/tutor:learn` to start your first session."
- If no: "No course set up yet. Run `/tutor:create-course` first."
