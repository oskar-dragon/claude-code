---
name: Obsidian Formatting
description: This skill should be used when "creating Obsidian notes", "formatting frontmatter", "using Dataview syntax", "embedding images in Obsidian", or when working with Obsidian-specific markdown features. Provides expertise in YAML frontmatter, Dataview queries, wikilinks, and Obsidian markdown conventions.
version: 0.1.0
---

# Obsidian Formatting Skill

## Overview

This skill provides expertise in creating properly formatted Obsidian notes with YAML frontmatter, Dataview inline queries, and Obsidian-specific markdown features. Use this skill when creating location notes or any Obsidian vault content.

## When to Use This Skill

Activate this skill when:
- Creating new Obsidian notes
- Formatting YAML frontmatter
- Working with Dataview syntax
- Embedding images or links
- Using Obsidian-specific markdown features
- Troubleshooting note formatting issues

## YAML Frontmatter

### Basic Structure

Frontmatter appears at the top of markdown files, enclosed in triple dashes:

```markdown
---
property1: value1
property2: value2
nested:
  key: value
list:
  - item1
  - item2
---

# Note Content

Body of the note goes here.
```

### Data Types

**String (plain):**
```yaml
Country: France
Region: Île-de-France
```

**String (quoted - required for special characters):**
```yaml
name: "Location: Paris"
description: "It's a beautiful city"
```

**Number:**
```yaml
rating: 4.5
visitors: 10000
```

**Boolean:**
```yaml
Done: false
publish: true
```

**Array (list):**
```yaml
tags:
  - map/photo-location
  - travel
  - europe
```

**Coordinates (array of numbers):**
```yaml
location: [48.858370, 2.294481]
```

**Date:**
```yaml
visited: 2024-03-15
created: 2024-03-15T14:30:00
```

### Location Note Frontmatter

**Required fields for all location types:**
```yaml
---
Country: string
Region: string
location: [latitude, longitude]
publish: boolean
image: string (URL)
---
```

**Template-specific fields:**

**Accommodation/Campsite:**
```yaml
---
tags:
  - map/accommodation/campsite
Country:
Region:
location: [lat, lon]
Source:
publish: true
image:
---
```

**Photo Location:**
```yaml
---
tags:
  - map/photo-location
icon: "camera"
Type:
Country:
Region:
location: [lat, lon]
best_time:
Done: false
Parent: "[[Photo Locations]]"
Source:
publish: true
image:
---
```

**Food/Restaurant:**
```yaml
---
tags:
  - map/food
Country:
Region:
location: [lat, lon]
Done: false
Source:
publish: true
image:
---
```

**General Location:**
```yaml
---
tags:
  - map/other
Country:
Region:
location: [lat, lon]
Done: false
Source:
publish: true
image:
---
```

### Frontmatter Best Practices

1. **Always use consistent indentation** - 2 spaces for YAML
2. **Quote strings with special characters** - Colons, quotes, brackets
3. **Use lowercase for boolean values** - `true`/`false`, not `True`/`False`
4. **Arrays use dash syntax** - Each item on new line with `-` prefix
5. **Coordinates as arrays** - `[lat, lon]`, not separate fields
6. **Empty values** - Leave blank or omit (don't use `null`)

## Dataview Inline Queries

Dataview provides inline queries using backtick syntax.

### Basic Inline Query

```markdown
`= this.property`
```

Renders the value of `property` from current note's frontmatter.

**Example:**
```markdown
Country: `= this.Country`
```
Renders as: `Country: France`

### Conditional Expressions

**choice() function:**
```markdown
`= choice(condition, value_if_true, value_if_false)`
```

**Example from templates:**
```markdown
`= choice(startswith(string(default(this.image, "")), "[["), "!" + this.image, choice(this.image, "![Image](" + this.image + ")", "No Image"))`
```

**Logic breakdown:**
1. Check if `image` field starts with `[[` (wikilink)
2. If yes: Render as `![[wikilink]]` (embedded wikilink)
3. If no: Check if `image` exists
4. If exists: Render as `![Image](url)` (markdown image)
5. If not exists: Render text "No Image"

### Common Dataview Functions

**String functions:**
- `string(value)` - Convert to string
- `default(value, fallback)` - Use fallback if value is null
- `startswith(text, prefix)` - Check if text starts with prefix
- `contains(text, substring)` - Check if text contains substring

**Conditional:**
- `choice(condition, true_value, false_value)` - Ternary operator

**Example usage:**
```markdown
Best time: `= choice(this.best_time, this.best_time, "Not specified")`
```

### Image Embedding

**Wikilink format (internal images):**
```markdown
![[image-name.jpg]]
```

**URL format (external images):**
```markdown
![Alt text](https://example.com/image.jpg)
```

**Conditional image from frontmatter:**
```markdown
`= choice(this.image, "![Image](" + this.image + ")", "No image available")`
```

## Mapview Plugin Integration

Location notes use the Mapview plugin to display locations on a map.

### Basic Mapview Block

```markdown
```mapview
{"name":"Current Note","query":"path:\"$filename$\"","chosenMapSource":0,"autoFit":true,"lock":true,"showLinks":true,"linkColor":"red","markerLabels":"off"}
```
```

### Configuration Options

- `name`: Display name for the map view
- `query`: Dataview query to select notes (use `path:"$filename$"` for current note)
- `chosenMapSource`: Map provider (0 = default)
- `autoFit`: Auto-zoom to fit markers
- `lock`: Prevent map interaction
- `showLinks`: Display links between markers
- `linkColor`: Color for links
- `markerLabels`: Show/hide marker labels

### Query Patterns

**Current note only:**
```json
"query":"path:\"$filename$\""
```

**All notes in folder:**
```json
"query":"path:\"Locations/\""
```

**All notes with tag:**
```json
"query":"#map/photo-location"
```

## Wikilinks

Obsidian uses double-bracket syntax for internal links.

### Basic Wikilink

```markdown
[[Note Name]]
```

Links to "Note Name.md" in the vault.

### Wikilink with Display Text

```markdown
[[Note Name|Display Text]]
```

Links to "Note Name.md" but shows "Display Text".

### Wikilink to Heading

```markdown
[[Note Name#Heading]]
```

Links to specific heading within note.

### Wikilink to Block

```markdown
[[Note Name#^block-id]]
```

Links to specific block (requires block ID).

### Embedded Wikilink

```markdown
![[Note Name]]
```

Embeds the entire note content.

**Embedded image:**
```markdown
![[image.jpg]]
```

**Embedded heading:**
```markdown
![[Note Name#Heading]]
```

## Markdown Extensions

Obsidian supports standard markdown plus extensions.

### Callouts

```markdown
> [!note]
> This is a note callout

> [!warning]
> This is a warning

> [!tip]
> This is a tip
```

**Callout types:**
- `note`, `info`, `abstract`, `summary`
- `tip`, `hint`, `important`
- `success`, `check`, `done`
- `question`, `help`, `faq`
- `warning`, `caution`, `attention`
- `failure`, `fail`, `missing`
- `danger`, `error`, `bug`
- `example`
- `quote`, `cite`

### Comments

Comments in frontmatter (using %%):**
```markdown
## Description
%%What is this spot about%%
```

These are visible in edit mode but hidden in preview/reading mode.

### Tags

**In content:**
```markdown
This location is tagged #travel #europe
```

**In frontmatter:**
```yaml
tags:
  - travel
  - europe
  - map/photo-location
```

**Nested tags:**
Use `/` for hierarchy: `map/photo-location` creates `map` with child `photo-location`

## Common Formatting Issues

### Issue: Frontmatter Not Recognized

**Symptoms:** Properties don't appear in Obsidian properties panel

**Solutions:**
- Ensure `---` delimiters are on their own lines
- Check YAML syntax (indentation, colons, quotes)
- Verify no text before opening `---`
- Use YAML validator if needed

### Issue: Dataview Query Not Rendering

**Symptoms:** Inline query shows as code, not rendered value

**Solutions:**
- Verify Dataview plugin is installed and enabled
- Check backtick syntax: `` `= expression` ``
- Ensure property exists in frontmatter
- Use `default()` for potentially missing values

### Issue: Image Not Displaying

**Symptoms:** Image link visible but image not shown

**Solutions:**
- For wikilinks: Verify image file exists in vault
- For URLs: Check URL is accessible
- For embedded wikilinks: Use `![[image.jpg]]` not `[[image.jpg]]`
- For markdown images: Use `![](url)` not `!(url)`

### Issue: Mapview Not Showing Location

**Symptoms:** Map appears but no marker

**Solutions:**
- Verify `location` field in frontmatter is array: `[lat, lon]`
- Check coordinates are numbers, not strings
- Ensure coordinates are valid (-90 to 90 for lat, -180 to 180 for lon)
- Verify Mapview plugin is installed

## Quick Reference

### Frontmatter Template

```yaml
---
tags:
  - tag1
  - tag2
property: value
list:
  - item1
  - item2
coordinates: [lat, lon]
date: 2024-03-15
boolean: true
---
```

### Dataview Inline

```markdown
`= this.property`
`= choice(condition, true_value, false_value)`
`= default(this.property, "fallback")`
```

### Links

```markdown
[[Note Name]]                    # Link
[[Note Name|Display]]            # Link with display text
![[Note Name]]                   # Embed note
![[image.jpg]]                   # Embed image
```

### Mapview

```markdown
```mapview
{"name":"Map","query":"path:\"$filename$\"","autoFit":true}
```
```

## Additional Resources

### Reference Files

For detailed formatting specifications:
- **`references/dataview-reference.md`** - Complete Dataview syntax and functions
- **`references/frontmatter-fields.md`** - All frontmatter field types and conventions

### Example Files

Working examples of formatted notes:
- **`examples/accommodation-example.md`** - Fully formatted accommodation note
- **`examples/photo-location-example.md`** - Photo location with all fields

---

Use this skill when creating Obsidian notes to ensure proper formatting, valid frontmatter, and correct Dataview syntax for location-based notes.
