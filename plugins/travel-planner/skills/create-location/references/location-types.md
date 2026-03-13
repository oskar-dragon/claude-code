# Location Types Reference

## Color Convention

- **green** — see / do / eat (Photo Locations, Restaurants, Trails, Other)
- **blue** — stay (Hotel, Campsite)

## Type Definitions

| Type | Icon | Color | Extra Section |
|---|---|---|---|
| Photo Locations | `camera` | green | Photography Tips |
| Restaurants | `utensils-crossed` | green | — |
| Hotel | `hotel` | blue | — |
| Campsite | `tent-tree` | blue | — |
| Trails | `footprints` | green | — |
| Other | `map-pin` | green | — |

Note: Attractions and general activities use the "Other" type.

## Frontmatter Fields

These fields apply to all location types:

```yaml
categories:
  - "[[Places]]"
type:
  - "[[Type Name]]"         # Use the exact type name from the table above, e.g. [[Photo Locations]]
location:
  - "[[Region]]"
  - "[[Country]]"
coordinates:
  - "latitude"
  - "longitude"
image: (URL or wikilink to attachment, e.g. [[Attachments/image.jpg]])
source:
  - URL1
  - URL2
icon: (per type from table)
color: (per type from table)
created: YYYY-MM-DD
visited: false
```

Photo Locations also include:

```yaml
best_time:
  - Sunrise  # or: Sunset, Morning, Evening, Anytime, etc.
```

## Content Structure

The following sections apply to all location types, in this order:

1. `![[Map.base#Place Itself]]` — map embed, always the first line after frontmatter
2. `## Description` — what the place is, with practical info (address, hours, highlights)
3. `## Photography Tips` — **Photo Locations only**. Best time, composition advice, equipment, specific viewpoints
4. `## Travel Information` — how to get there, parking, access, practical notes
5. Dataview image expression at end of file (copy exactly):

```
`= choice(startswith(string(default(this.image, "")), "[["), "!" + this.image, choice(this.image, "![Image](" + this.image + ")", ""))`
```

## Minimum Sources

At least 3 sources are required per note. Populate the `source` frontmatter field as a YAML list.
