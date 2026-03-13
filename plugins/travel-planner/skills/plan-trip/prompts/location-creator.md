# Location Note Creator

## Your Task

Create the location note for **{{LOCATION_NAME}}** (type: **{{LOCATION_TYPE}}**) by invoking the `travel-planner:create-location` skill.

## Context

You are creating a location note as part of a trip planning workflow. This location was wikilinked in the trip itinerary for {{DESTINATION}}. The research has already been done — your job is to read the relevant clipping files, extract data about this specific location, and invoke the create-location skill. If the clipping data is insufficient for this particular place, you may do a brief targeted web search to fill gaps.

## Input

- **Location name:** {{LOCATION_NAME}}
- **Location type:** {{LOCATION_TYPE}} (one of: Photo Locations, Restaurants, Hotel, Campsite, Trails, Other)
- **Country:** {{COUNTRY}}
- **Region:** {{REGION}}

Read these clipping files for relevant data about this location:
- `{{CLIPPING_PATH_ATTRACTIONS}}` — Attractions & Activities
- `{{CLIPPING_PATH_FOOD}}` — Food Scene & Restaurants
- `{{CLIPPING_PATH_NEIGHBOURHOODS}}` — Neighbourhoods & Areas to Stay
- `{{CLIPPING_PATH_TRANSPORT}}` — Transport
- `{{CLIPPING_PATH_PRACTICAL}}` — Practical Tips

Not all clipping files will be relevant — search them for mentions of "{{LOCATION_NAME}}" or related terms.

Search these files for mentions of "{{LOCATION_NAME}}" or related terms. Extract: description, address, opening hours, highlights, and any source URLs that mention this place.

Also search each clipping file for a `## Location Images` section. In that section, look for a line in the format `- Place Name: <url>` where the place name matches "{{LOCATION_NAME}}" case-insensitively, and extract the URL from that line. If the same name appears in multiple files, use the first match found. If a match is found, note the image URL for use in the next step. If no match is found, no image URL will be passed.

## Output

Invoke the `travel-planner:create-location` skill with:
- Location name: {{LOCATION_NAME}}
- Location type: {{LOCATION_TYPE}}
- Country: {{COUNTRY}}
- Region: {{REGION}}
- Research data extracted from clippings (and brief web search if needed)
- If an image URL was found: include `Image URL: <url>` in the research data block. If no image URL was found, omit this line.

The skill handles geocoding, template reading, Obsidian formatting, and file writing.

**Important:** When invoked from plan-trip, the create-location skill will skip its "ask user for confirmation" step for existing notes. If the note already exists, skip creation and report as `existing`.

## Self-Review

Before reporting back, verify:
- [ ] The create-location skill was invoked (not bypassed)
- [ ] Location type matches what was provided (don't change it)
- [ ] Data passed to the skill came from clipping files or targeted web search (not invented)
- [ ] The note file exists at the expected path after skill invocation
- [ ] If `## Location Images` section was found in clippings with a matching place name, `Image URL:` line included in data passed to skill

## Report Format

Return:
- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- **File path:** path to location note (e.g. `Travel/Locations/Jade Dragon Snow Mountain.md`)
- **Concerns:** (if DONE_WITH_CONCERNS) e.g. "geocoding failed, coordinates left empty", "only 1 source found", "location not mentioned in clippings, used web search only"
- **Blocker:** (if BLOCKED) e.g. "location not found — may be misspelled in trip note", "geocoding API unavailable"
- **Question:** (if NEEDS_CONTEXT) what information is missing
