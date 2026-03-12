# Country Note Creator

## Your Task

Create the country note for **{{COUNTRY}}** by invoking the `travel-planner:create-country` skill.

## Context

You are creating the country note as part of a trip planning workflow. The research has already been done — your job is to read the relevant research clippings, extract the data the create-country skill needs, and invoke it. Do not do additional web research unless the clipping data has clear gaps.

## Input

Read these clipping files to extract country-level data:
- `{{VISA_CLIPPING_PATH}}` — visa requirements, passport validity
- `{{PRACTICAL_TIPS_CLIPPING_PATH}}` — currency, safety, emergency numbers
- `{{TRANSPORT_CLIPPING_PATH}}` — main airports
- `{{WEATHER_CLIPPING_PATH}}` — best time to visit

Extract from these clippings:
- Visa data (requirements for UK/EU/US, cost, duration, application process)
- Currency and price information
- Safety overview
- Main airport names and codes
- Best time to visit summary

## Output

Invoke the `travel-planner:create-country` skill with the extracted data. The skill writes the note to `Travel/Countries/{{COUNTRY}}.md` in the vault.

If the note already exists, the skill will update only the Travel Information sections. Report this as `existing` in your status.

## Self-Review

Before reporting back, verify:
- [ ] The create-country skill was invoked (not bypassed)
- [ ] Data passed to the skill came from the clipping files (not invented)
- [ ] If note already existed, it was updated not overwritten

## Report Format

Return:
- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- **File path:** path to country note (e.g. `Travel/Countries/China.md`)
- **Note:** `created` or `existing`
- **Concerns:** (if DONE_WITH_CONCERNS) e.g. "visa clipping had limited data, supplemented with web search"
- **Blocker:** (if BLOCKED) what prevented completion
- **Question:** (if NEEDS_CONTEXT) what information is missing
