# Travel Planner: YAML Strictness & Image Extraction Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix location notes adding extra YAML fields (e.g. `tags`) and enable image URL extraction from research clippings.

**Architecture:** Four prompt/markdown files are edited — no new files, no code changes. Two root causes are fixed: (1) ambiguous "tag" language in prompts that causes LLMs to invent YAML fields; (2) researcher agents not capturing image URLs from pages they already visit.

**Tech Stack:** Markdown prompt files, YAML frontmatter, Obsidian

**Spec:** `docs/superpowers/specs/2026-03-13-travel-planner-yaml-images-design.md`

---

## Chunk 1: Fix YAML tag triggers

### Task 1: Remove Tag column from location-types.md and fix SKILL.md

**Files:**
- Modify: `plugins/travel-planner/skills/create-location/references/location-types.md`
- Modify: `plugins/travel-planner/skills/create-location/SKILL.md`

These are prompt files, not code — there are no automated tests. Verification is done by reading the edited file and confirming the change is correct before committing.

- [ ] **Step 1: Edit `location-types.md` — remove the Tag column from the type table**

  The current table and trailing note look like:

  ```
  | Type | Tag | Icon | Color | Extra Section |
  |---|---|---|---|---|
  | Photo Locations | `map/photo-location` | `camera` | green | Photography Tips |
  | Restaurants | `map/food` | `utensils-crossed` | green | — |
  | Hotel | `map/accommodation` | `hotel` | blue | — |
  | Campsite | `map/accommodation/campsite` | `tent-tree` | blue | — |
  | Trails | `map/trails` | `footprints` | green | — |
  | Other | `map/other` | `map-pin` | green | — |

  Note: Attractions and general activities use the "Other" type.
  ```

  Replace with (Tag column removed; trailing Note line unchanged):

  ```
  | Type | Icon | Color | Extra Section |
  |---|---|---|---|
  | Photo Locations | `camera` | green | Photography Tips |
  | Restaurants | `utensils-crossed` | green | — |
  | Hotel | `hotel` | blue | — |
  | Campsite | `tent-tree` | blue | — |
  | Trails | `footprints` | green | — |
  | Other | `map-pin` | green | — |

  Note: Attractions and general activities use the "Other" type.
  ```

- [ ] **Step 2: Verify the edit — read the file and confirm Tag column is gone, Note line is preserved, and no other content changed**

- [ ] **Step 3: Edit `SKILL.md` — four changes**

  **Change A — Step 6 paragraph:**

  Find the full paragraph (both sentences together):

  > Build the note using the template structure. Apply type-specific icon, color, tag, and sections from `references/location-types.md`.

  Replace with:

  > Build the note using the template structure. Apply type-specific icon and color from `references/location-types.md`. Do NOT add a `tags` field — it is not part of the frontmatter template.

  **Change B — Field rules in Step 6:** The last existing bullet in the "Field rules:" list is:

  > - Set `visited: false`

  After that bullet, add a new bullet:

  > - Only include frontmatter fields listed in `references/location-types.md`. Do NOT add `tags`, `aliases`, or any other fields not in the template.

  **Change C — `## Reference` section:** Find the line:

  > See `references/location-types.md` for the full mapping of location type → icon, color, tag, and optional sections.

  Replace with:

  > See `references/location-types.md` for the full mapping of location type → icon, color, and optional sections.

  **Change D — `## Notes` section:** The last existing note bullet is:

  > - Leave `image` empty if no image URL is found; do not invent images

  After that bullet, add:

  > - Only include frontmatter fields listed in `references/location-types.md` — do not add `tags`, `aliases`, or other fields

- [ ] **Step 4: Verify the edit — read SKILL.md and confirm all four changes are correct and no unintended lines were changed**

- [ ] **Step 5: Commit**

  ```bash
  git add plugins/travel-planner/skills/create-location/references/location-types.md \
          plugins/travel-planner/skills/create-location/SKILL.md
  git commit -m "fix(travel-planner): remove tag triggers causing spurious YAML fields in location notes"
  ```

---

## Chunk 2: Image extraction

### Task 2: Add Location Images section to researcher.md

**File:**
- Modify: `plugins/travel-planner/skills/plan-trip/prompts/researcher.md`

- [ ] **Step 1: Add `### Location Images` instruction to the output format**

  In `researcher.md`, after the `### Sources` section (the line `- [Repeat source URLs from frontmatter for easy reading]`) and before `## Self-Review`, insert the following block. Note: the outer fence uses four backticks to avoid conflict with the inner triple-backtick example.

  ````
  ### Location Images

  If your category involves specific named places (hotels, restaurants, viewpoints, trails, attractions) and you encountered image URLs on pages you visited during your research, record one representative image URL per place here. Only include images found on pages you already visited — do not fetch additional pages to find images. Omit this section entirely if no image URLs were encountered.

  Format:

  ```
  ## Location Images
  - Place Name: https://example.com/image.jpg
  - Another Place: https://example.com/other.jpg
  ```
  ````

- [ ] **Step 2: Add checklist item to Self-Review**

  The last existing bullet in `## Self-Review` is:

  > - [ ] Preferred sources checked first

  After that bullet, add:

  > - [ ] If image URLs were encountered on visited pages, `## Location Images` section written with correct format

- [ ] **Step 3: Verify — read the file and confirm the new section is correctly placed between `### Sources` and `## Self-Review`, and the format block uses the correct heading level (`## Location Images`)**

- [ ] **Step 4: Commit**

  ```bash
  git add plugins/travel-planner/skills/plan-trip/prompts/researcher.md
  git commit -m "feat(travel-planner): capture image URLs in researcher clipping output"
  ```

### Task 3: Extract image URL in location-creator.md and update create-location SKILL.md

**Files:**
- Modify: `plugins/travel-planner/skills/plan-trip/prompts/location-creator.md`
- Modify: `plugins/travel-planner/skills/create-location/SKILL.md`

- [ ] **Step 1: Append image extraction instruction to location-creator.md**

  Find the paragraph (line 27):

  > Search these files for mentions of "{{LOCATION_NAME}}" or related terms. Extract: description, address, opening hours, highlights, and any source URLs that mention this place.

  Keep this paragraph unchanged. Append a new paragraph directly after it:

  > Also search each clipping file for a `## Location Images` section. Look for a line matching "{{LOCATION_NAME}}" using a case-insensitive exact match on the place name. If the same name appears in multiple files, use the first match found. If a match is found, note the image URL for use in the next step. If no match is found, no image URL will be passed.

- [ ] **Step 2: Update the Output section to pass image URL**

  Find the bullet list in `## Output`:

  ```
  Invoke the `travel-planner:create-location` skill with:
  - Location name: {{LOCATION_NAME}}
  - Location type: {{LOCATION_TYPE}}
  - Country: {{COUNTRY}}
  - Region: {{REGION}}
  - Research data extracted from clippings (and brief web search if needed)
  ```

  Replace with:

  ```
  Invoke the `travel-planner:create-location` skill with:
  - Location name: {{LOCATION_NAME}}
  - Location type: {{LOCATION_TYPE}}
  - Country: {{COUNTRY}}
  - Region: {{REGION}}
  - Research data extracted from clippings (and brief web search if needed)
  - If an image URL was found: include `Image URL: <url>` in the research data block. If no image URL was found, omit this line.
  ```

- [ ] **Step 3: Add image check to Self-Review in location-creator.md**

  The last existing bullet in `## Self-Review` is:

  > - [ ] Data passed to the skill came from clipping files or targeted web search (not invented)

  After that bullet, add:

  > - [ ] If `## Location Images` section was found in clippings with a matching place name, `Image URL:` line included in data passed to skill

- [ ] **Step 4: Verify location-creator.md — read and confirm all three changes are correct**

- [ ] **Step 5: Update create-location SKILL.md — clarify step 4 image handling**

  Find in Step 4:

  > **If invoked by `plan-trip`:** research data may already be provided in the prompt. Use that data and skip web search.

  Replace with:

  > **If invoked by `plan-trip`:** research data is provided in the prompt. Use that data and skip web search. If an `Image URL:` line is present in the research data, use that URL to populate the `image` frontmatter field. If absent, leave `image` empty.

- [ ] **Step 6: Verify SKILL.md — read and confirm step 4 change is correct**

- [ ] **Step 7: Commit**

  ```bash
  git add plugins/travel-planner/skills/plan-trip/prompts/location-creator.md \
          plugins/travel-planner/skills/create-location/SKILL.md
  git commit -m "feat(travel-planner): extract image URL from clippings and pass to create-location skill"
  ```

---

## Chunk 3: Version bump

### Task 4: Bump version in marketplace.json

**File:**
- Modify: `.claude-plugin/marketplace.json`

Current version: `0.3.1` → New version: `0.4.0` (minor bump — new feature added)

- [ ] **Step 1: Update version in marketplace.json**

  Find the travel-planner entry and change `"version": "0.3.1"` to `"version": "0.4.0"`.

- [ ] **Step 2: Verify the edit**

  ```bash
  grep -A3 '"travel-planner"' .claude-plugin/marketplace.json
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add .claude-plugin/marketplace.json
  git commit -m "chore(travel-planner): bump version to 0.4.0"
  ```
