# Module Steps — Detailed Format and Examples

## CONCEPT Step

### Format Rules

- Maximum 3-5 short paragraphs or bullet points
- Lead with what the concept **does**, not what it **is**
- Always bridge from known knowledge (check `.claude/tutor.local.md` for prior knowledge)
- No analogies — use direct factual comparisons
- Include ASCII diagram only when the concept is spatial (data flow, architecture, relationships)

### Programming Example (bridging from TypeScript)

```markdown
## Decorators

In TypeScript, you might use decorators like `@Injectable()` in NestJS.
Python decorators work similarly but are more fundamental to the language.

**What they do:** Wrap a function to modify its behavior without changing its code.

**Key difference from TS:** Python decorators are just functions — no special
syntax or experimental flags needed. They're everywhere in Python, not just
in frameworks.
```

### Non-Programming Example (music production)

```markdown
## EQ Frequency Bands

Every sound occupies space in the frequency spectrum, from low bass to high treble.
EQ lets you boost or cut specific frequency ranges to shape a sound.

**The key bands:**
- **Sub-bass (20-60 Hz)** — The rumble you feel more than hear
- **Bass (60-250 Hz)** — Kick drums, bass guitar body
- **Mids (250 Hz-4 kHz)** — Where most instruments and vocals live
- **Presence (4-8 kHz)** — Clarity, articulation, bite
- **Air (8-20 kHz)** — Shimmer, sparkle, breathiness

**What matters:** Cutting is usually more useful than boosting.
A muddy mix almost always needs cuts in the 200-400 Hz range.
```

### When to Use ASCII Diagrams

Include a diagram when explaining:
- Data flow between components
- Architecture/system design
- State machines or transitions
- Relationships between concepts
- Memory layout or data structures

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Request  │────▶│  Router  │────▶│  Handler │
└──────────┘     └──────────┘     └──────────┘
                       │
                       ▼
                 ┌──────────┐
                 │Middleware │
                 └──────────┘
```

Do NOT include diagrams for simple concepts that are easily described in text.

## SEE IT Step

### Format Rules

- Complete, working code example in the context of the project being built
- Must be runnable / testable — not pseudocode
- Brief inline comments explaining "why", not "what"
- Short enough to read in 2-3 minutes

### Example

```python
# Adding a decorator to our task manager API
# Why: Django Ninja uses decorators to define endpoints,
# similar to Express route handlers in Node.js

from ninja import Router

router = Router()

@router.get("/tasks")  # This replaces Express's router.get("/tasks", handler)
def list_tasks(request):
    # Django passes the request object automatically — no need to
    # destructure it like in Express (req, res)
    return {"tasks": Task.objects.all()}
```

### Non-Programming Example

For non-code topics, show a concrete worked example:
- A completed EQ setting with before/after description
- A filled-in form/template
- A real-world scenario walked through step by step

## DO IT Step

### Format Rules

- Clear exercise spec: what to build, what the expected behavior is
- The exercise adds real functionality to the project
- Naturally uses concepts from earlier modules (organic review)
- After presenting, **stop and wait** for the learner to complete it
- When learner says "done", launch the exercise-verifier agent

### Example Exercise Spec

```markdown
### Exercise: Add a DELETE endpoint

Add a `DELETE /tasks/{task_id}` endpoint to the task manager that:
- Takes a task ID as a path parameter
- Returns 404 if the task doesn't exist
- Deletes the task and returns `{"success": true}` on success

This builds on the GET endpoint from Module 1 and the path parameters from Module 2.
```

### Waiting for Completion

After presenting the exercise, say something like:
> "Take your time with this. Let me know when you're done, or ask if you get stuck."

Do NOT proceed to CHECK IT or CONNECT until the learner indicates they've finished.

## CHECK IT Step

### When to Include

Include a quiz when:
- The concept is abstract or easily confused with similar concepts
- The learner's confidence on related topics has been low
- The module covered multiple interconnected ideas worth testing
- It's been several modules since the last quiz

Skip the quiz when:
- The DO IT exercise already demonstrated understanding clearly
- The concept is straightforward and mechanical
- The learner completed the exercise quickly and confidently
- Adding a quiz would disrupt flow

### Delivering Quizzes

Use AskUserQuestion to present structured quiz questions where possible (multiple choice, confidence rating). For open-ended formats (teach-back, spot the bug), use regular conversation.

After each answer (right or wrong), always ask for a confidence self-rating using AskUserQuestion with these options:
- **Guessed** — didn't really know, got lucky or took a shot
- **Somewhat sure** — had a reasonable idea but wasn't certain
- **Knew it** — was confident in the answer

Record the format used, result, and confidence in auto memory.

## CONNECT Step

### Format Rules

- One or two sentences maximum
- Link backward (to something already known) AND forward (to what's coming)
- Build anticipation for the next module

### Example

> "Decorators are the foundation of how Django Ninja defines its API — every endpoint you'll write uses them. Next up: path parameters, which let your endpoints handle specific resources like `/tasks/42`."
