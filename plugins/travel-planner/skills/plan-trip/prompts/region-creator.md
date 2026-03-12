# Region Note Creator

## Your Task

Create the region note for **{{REGION}}** in **{{COUNTRY}}** by invoking the `travel-planner:create-region` skill.

## Context

You are creating the region note as part of a trip planning workflow. Regions are lightweight organisational nodes in the vault — mostly Obsidian Base embeds that dynamically pull in linked trips and places. The research has already been done.

## Input

Read this clipping file for neighbourhood/area context:
- `{{NEIGHBOURHOODS_CLIPPING_PATH}}` — neighbourhood character, areas to stay, proximity to sights

Extract: region name, parent country, and a brief (1-2 sentence) description of the area.

## Output

Invoke the `travel-planner:create-region` skill with the extracted data. The skill writes the note to `Travel/Regions/{{REGION}}.md` in the vault.

If the note already exists, the skill skips creation entirely. Report this as `existing` in your status.

## Self-Review

Before reporting back, verify:
- [ ] The create-region skill was invoked (not bypassed)
- [ ] Parent country is correct
- [ ] If note already existed, creation was skipped (not overwritten)

## Report Format

Return:
- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- **File path:** path to region note (e.g. `Travel/Regions/Yunnan.md`)
- **Note:** `created` or `existing`
- **Concerns:** (if DONE_WITH_CONCERNS) any issues
- **Blocker:** (if BLOCKED) what prevented completion
- **Question:** (if NEEDS_CONTEXT) what information is missing
