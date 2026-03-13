# Travel Planner: YAML Strictness & Image Extraction

**Date:** 2026-03-13
**Status:** Approved

## Problem Statement

Two issues in the `travel-planner` plugin's location note generation:

1. **Extra YAML fields** — Location notes are being created with extra frontmatter fields (e.g. `tags`) not present in the template.
2. **Missing images** — The `image` frontmatter field in location notes is always empty because no part of the workflow actively captures image URLs.

---

## Root Cause Analysis

### YAML Strictness

Two triggers combine to cause the agent to invent a `tags` YAML field — either one alone is sufficient:

1. `create-location/SKILL.md` step 6 instructs the agent to "Apply type-specific icon, color, **tag**, and sections from `references/location-types.md`." The word "tag" signals the agent to add a tag somewhere.

2. `location-types.md` contains a "Tag" column in its type table (e.g. `map/photo-location`, `map/food`). These values were intended as internal reference only and are not part of any frontmatter field.

The frontmatter template (also in `location-types.md`) does NOT include a `tags` field. Both triggers must be removed: the word "tag" from step 6, and the Tag column from the table.

### Image Extraction

Researcher agents visit source pages that contain images for specific places (hotels, restaurants, viewpoints, etc.) but are not instructed to capture image URLs. The `image` field is defined in the location note template but is consistently left empty because no upstream step collects image URLs.

---

## Solution Design

### Change 1: Fix YAML Strictness

**File:** `skills/create-location/SKILL.md`

- Remove "tag" from step 6 instruction — icon and color are the only type-specific YAML fields
- Add explicit frontmatter strictness rule: only include fields listed in the template; do not add `tags`, `aliases`, or any other fields

**File:** `skills/create-location/references/location-types.md`

- Remove the Tag column from the type table entirely (it is not used in frontmatter and its presence causes hallucination)

### Change 2: Image Extraction

**File:** `skills/plan-trip/prompts/researcher.md`

Add a `## Location Images` section to the required output format. When the researcher encounters an image URL on a page it visits as part of its normal research (not fetching extra pages), it records one representative image URL per specific named place it mentions:

```markdown
## Location Images
- Place Name: https://example.com/image.jpg
- Another Place: https://another.com/photo.png
```

This section is only written when image URLs are found on pages already visited — it must be omitted if no images are encountered (e.g. Visa, Weather categories often won't have any). The researcher must not fetch additional pages solely to find images.

**File:** `skills/plan-trip/prompts/location-creator.md`

Add instruction to search the `## Location Images` section across all clipping files for the location name using a case-insensitive exact match. If a match is found, include the image URL in the research data block passed to the `create-location` skill in this format:

```
Image URL: https://example.com/image.jpg
```

If no match is found, omit the `Image URL` line — the `image` field will remain empty, as it is today.

**File:** `skills/create-location/SKILL.md`

Clarify in step 4 (plan-trip invocation path) that research data may include an `Image URL:` line. When present, use that URL to populate the `image` frontmatter field. When absent, leave `image` empty.

---

## Files Changed

| File | Change |
|------|--------|
| `skills/create-location/SKILL.md` | Remove "tag" from step 6; add YAML strictness rule; clarify image handling in step 4 |
| `skills/create-location/references/location-types.md` | Remove Tag column from type table |
| `skills/plan-trip/prompts/researcher.md` | Add `## Location Images` section to output format |
| `skills/plan-trip/prompts/location-creator.md` | Extract image URL from clippings and pass to create-location |

---

## Constraints

- No new files created
- No changes to the data flow, orchestration order, or agent count
- YAML template in `location-types.md` remains the single source of truth for frontmatter structure
- Image URLs must come from source pages already visited — no invented URLs, no additional web searches beyond what researchers already do
- If no image URL is found for a location, `image` field remains empty — no fallback invented
