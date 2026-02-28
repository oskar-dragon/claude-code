---
description: Create a course outline from source material or from scratch via interview
argument-hint: "[source-url-or-path]"
version: 0.1.0
author: Oskar Dragon
allowed-tools: Read(*), Write(*), Edit(*), WebFetch(*), WebSearch(*), AskUserQuestion, Bash(*)
---

## Context

Learner profile: !`cat .claude/tutor.local.md 2>/dev/null || echo "NO_PROFILE — run /tutor:init first"`
Existing course: !`cat course-outline.md 2>/dev/null || echo "NO_COURSE_YET"`

## Your Task

Create a structured course outline and save it to `course-outline.md`. The learner may provide source material or want to create a course from scratch.

### If Source Material is Provided ($ARGUMENTS)

If the learner provided a URL or file path as an argument:

1. Fetch/read the source material
2. Extract the topic structure, key concepts, and learning progression
3. Adapt it into the course outline format below
4. Present the outline to the learner for review before saving
5. Ask if they want to adjust anything (add/remove/reorder modules)

### If No Source Material

Interview the learner thoroughly to understand what they need. Ask about:

1. **What do you want to learn?** — The subject area (be specific)
2. **What's your goal?** — What do you want to be able to DO after the course? (Build something? Pass an exam? Produce music?)
3. **What do you already know about this topic?** — Even basics count
4. **What project should we build?** — If it's a practical skill, what real project should anchor the learning? If the learner doesn't have one in mind, suggest 2-3 options based on the topic.
5. **How deep do you want to go?** — Beginner foundations? Intermediate practical? Advanced?
6. **Any specific subtopics you want to cover or skip?**

Be thorough — the better the interview, the better the course. Ask follow-up questions if answers are vague. Don't rush this.

### Course Outline Format

Generate a `course-outline.md` with this structure:

```markdown
# [Course Title]

## Goal
[One sentence: what the learner will be able to do after completing this course]

## Project
[Description of the real project that anchors the course. What it is, what it does, why it's a good learning vehicle.]

## Prerequisites
[What the learner should already know — reference their prior knowledge from tutor.local.md]

## Modules

### Module 1: [Title]
- **Concepts:** [List of concepts covered]
- **Exercise:** [What the learner will build/do — adds to the project]
- **Builds on:** Nothing (first module)

### Module 2: [Title]
- **Concepts:** [List of concepts covered]
- **Exercise:** [What the learner will build/do]
- **Builds on:** Module 1

### Module 3: [Title]
- **Concepts:** [List of concepts covered]
- **Exercise:** [What the learner will build/do]
- **Builds on:** Modules 1-2

[... continue for all modules ...]
```

### Guidelines for Module Design

- **Linear progression** — each module builds directly on the previous ones
- **Project-anchored** — every exercise adds real functionality to the project
- **Reasonable scope** — each module should take ~12-15 minutes (concept + example + exercise)
- **Organic review** — later exercises naturally require earlier concepts
- **Concept density** — 1-3 new concepts per module, not more
- **Practical first** — prioritize skills the learner will use over theoretical knowledge
- **Adapt to the subject** — for non-programming topics, exercises become hands-on tasks appropriate to the domain

### After Generating

1. Present the full outline to the learner
2. Ask: "Does this outline look good? Want to add, remove, or reorder anything?"
3. Make adjustments based on feedback
4. Save the final version to `course-outline.md`
5. Tell the learner: "Course is ready. Run `/tutor:learn` to start your first session."
