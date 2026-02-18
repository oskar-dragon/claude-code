# Delivery Diagram Command — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a `/delivery-diagram` slash command that reads a plan's `tasks.json` and generates a Mermaid delivery diagram saved alongside the plan artifacts.

**Architecture:** A single command file (`plugins/superpowers/commands/delivery-diagram.md`) that instructs Claude to read the given plan directory, load the delivery-diagrams skill for conventions, infer swimlanes and safe/risky status from task names, and write the diagram to `delivery-diagram.md` in the same directory.

**Tech Stack:** Markdown command file with YAML frontmatter — no build step, no dependencies.

---

### Task 1: Create the `/delivery-diagram` command file

**Files:**

- Create: `plugins/superpowers/commands/delivery-diagram.md`

**Step 1: Create the file**

```markdown
---
description: "Generate a Mermaid delivery diagram from a plan's tasks.json and save it alongside the plan artifacts."
disable-model-invocation: true
---

Invoke the `superpowers:delivery-diagrams` skill first to load the diagramming conventions, then follow these steps exactly:

## Your task

The user has provided a plan directory path as the argument: `$ARGUMENTS`

1. **Read** `$ARGUMENTS/tasks.json` — this contains the task list with `id`, `subject`, `status`, and `blockedBy` fields.
2. **Read** `$ARGUMENTS/plan.md` — use this for additional context about each task (description, area).

3. **Infer swimlane** for each task from its `subject` field using these keyword rules (first match wins):
   - Keywords `db`, `database`, `migration`, `schema`, `column`, `table`, `model` → swimlane `DB`, style `safe`
   - Keywords `api`, `endpoint`, `route`, `controller`, `serializer`, `service`, `backend` → swimlane `API`, style `safe`
   - Keywords `frontend`, `ui`, `page`, `component`, `display`, `view`, `email`, `visible` → swimlane `Frontend`, style `risky`
   - Keywords `test`, `spec` → swimlane `Tests`, style `safe`
   - Keywords `config`, `deploy`, `env`, `setup`, `infra` → swimlane `Config`, style `safe`
   - No match → swimlane `Other`, style `safe`
   - Keyword matching is case-insensitive.

4. **Generate** a `flowchart LR` Mermaid diagram following the delivery-diagrams skill conventions:
   - One node per task: `id[subject]:::safe` or `id[subject]:::risky`
   - Node IDs: use `t0`, `t1`, `t2` etc. matching the `id` field in tasks.json
   - Arrows from blockedBy: if task B has `blockedBy: [A]`, write `tA --> tB`
   - Group nodes into `subgraph` blocks by swimlane
   - Include the three `classDef` declarations at the top

5. **Write** the diagram to `$ARGUMENTS/delivery-diagram.md` with this structure:

```markdown
# Delivery Diagram

> Generated from `tasks.json`. Re-run `/delivery-diagram $ARGUMENTS` to regenerate.

\`\`\`mermaid
flowchart LR

    classDef safe fill:#d0d0d0,color:#333,stroke:#999
    classDef risky fill:#ffb3b3,color:#333,stroke:#cc3333
    classDef gate fill:#fff,color:#333,stroke:#333,stroke-width:3px

    [generated subgraphs and arrows here]
\`\`\`
```

6. **Confirm** to the user: "Delivery diagram written to `$ARGUMENTS/delivery-diagram.md`."
```

**Step 2: Verify the file was created correctly**

```bash
cat plugins/superpowers/commands/delivery-diagram.md
```

Expected: file exists with the frontmatter and instructions above.

**Step 3: Commit**

```bash
git add plugins/superpowers/commands/delivery-diagram.md
git commit -m "feat: add /delivery-diagram command"
```

---

### Task 2: Smoke test against this plan's tasks.json

Once tasks.json exists for this plan (written after this plan is complete), run:

```
/delivery-diagram docs/plans/delivery-diagram-command
```

Expected output: `docs/plans/delivery-diagram-command/delivery-diagram.md` is created with a valid Mermaid `flowchart LR` diagram showing Task 1 and Task 2 with the correct dependency arrow (`t1 --> t2` — Task 2 blocked by Task 1) and appropriate swimlanes.

**Verify:**

```bash
cat docs/plans/delivery-diagram-command/delivery-diagram.md
```

Expected: Contains a Mermaid codeblock with `flowchart LR`, `classDef` lines, at least one `subgraph`, and the arrow `t0 --> t1`.
