# Quiz System — Format Rotation and Metacognitive Rating

## Quiz Format Rotation

Never use the same format twice in a row. Check auto memory for the last format used and pick a different one.

### Available Formats

| Format | When to Use | Implementation |
|---|---|---|
| **Multiple choice** | Testing conceptual understanding | Use AskUserQuestion with 3-4 plausible options |
| **Predict the output** | Testing mental model of execution | Show code, ask what it produces |
| **Spot the bug** | Testing debugging skills | Show broken code, ask to find and describe the issue |
| **Compare and contrast** | Testing differentiation between similar concepts | Ask about differences between two related concepts |
| **Teach-back** | Testing deep understanding | "Explain this concept in 2 sentences" |
| **Code completion** | Testing practical application | Show code with a gap, ask to fill it in |

### Format Selection Logic

1. Check auto memory for the last quiz format used
2. Exclude that format from options
3. Choose a format appropriate to the concept:
   - Factual knowledge → multiple choice or compare-and-contrast
   - Procedural knowledge → predict the output or code completion
   - Debugging skills → spot the bug
   - Deep understanding → teach-back
4. If learner confidence has been low on this topic area, prefer formats that give more feedback (multiple choice, spot the bug) over open-ended ones (teach-back)

### Multiple Choice Example

Use AskUserQuestion:

```
Question: "What happens when you apply two decorators to a function?"

Options:
- "Both run — outer decorator wraps the result of the inner one"
- "Only the first decorator runs"
- "Only the last decorator runs"
- "Python raises a SyntaxError"
```

### Predict the Output Example

```
What does this code print?

def add_greeting(func):
    def wrapper(name):
        return f"Hello, {func(name)}!"
    return wrapper

@add_greeting
def get_title(name):
    return f"Dr. {name}"

print(get_title("Smith"))
```

### Spot the Bug Example

```
This endpoint should return a single task by ID, but it has a bug. What's wrong?

@router.get("/tasks/{task_id}")
def get_task(request, task_id: str):
    task = Task.objects.get(id=task_id)
    return task

(Hint: think about what happens when the task doesn't exist)
```

### Compare and Contrast Example

> "What's the key difference between Python's `dict.get(key, default)` and direct access `dict[key]`? When would you use each?"

### Teach-Back Example

> "Explain Python decorators in 2 sentences, as if describing them to a colleague who knows TypeScript but not Python."

### Code Completion Example

```
Complete the missing line to make this endpoint return a 404 when the task isn't found:

@router.get("/tasks/{task_id}")
def get_task(request, task_id: int):
    task = Task.objects.filter(id=task_id).first()
    ___________________________________
    return task
```

## Metacognitive Self-Rating

After EVERY quiz answer (right or wrong), ask the learner to rate their confidence. Use AskUserQuestion with exactly these options:

- **Guessed** — "I didn't really know, took a shot"
- **Somewhat sure** — "I had a reasonable idea but wasn't certain"
- **Knew it** — "I was confident in my answer"

### How Ratings Drive Spacing

| Rating | Effect on Future Modules |
|---|---|
| **Guessed** | Concept gets woven into exercises in the next 1-2 modules more heavily |
| **Somewhat sure** | Concept appears embedded in exercises 2-3 modules later |
| **Knew it** | Concept appears later, in a harder or more combined context |

### Recording in Auto Memory

After each quiz, record in auto memory:

```
## Quiz: Module [N] — [Topic]
- **Format:** [format used]
- **Question:** [brief summary]
- **Correct:** [yes/no]
- **Confidence:** [guessed/somewhat-sure/knew-it]
- **Concept:** [concept being tested]
- **Needs reinforcement:** [yes/no — based on combination of correctness and confidence]
```

A concept needs reinforcement when:
- Answer was wrong (regardless of confidence)
- Answer was right but confidence was "Guessed"
- Answer was right but confidence was "Somewhat sure" AND the concept hasn't been tested before

A concept is solid when:
- Answer was right AND confidence was "Knew it"
- Answer was right AND confidence was "Somewhat sure" AND it's been tested before with improving scores
