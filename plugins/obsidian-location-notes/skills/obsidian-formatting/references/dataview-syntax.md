# Dataview Syntax Reference

Complete reference for Dataview query syntax used in Obsidian notes.

## Inline Queries

Inline queries use backticks with `=` prefix to display single values.

### Basic Field Access

```markdown
`= this.fieldname`          - Access field from current note
`= this.nested.field`       - Access nested field
`= this.array[0]`           - Access array element
`= this.array[1]`           - Second element (e.g., longitude)
```

### Functions

#### `choice(condition, ifTrue, ifFalse)`

Ternary operator for conditional display.

```markdown
`= choice(this.visited, "✓ Visited", "Not visited")`
`= choice(this.image, "Has image", "No image")`
```

#### `default(value, fallback)`

Provide fallback for missing/null values.

```markdown
`= default(this.image, "")`           - Empty string if no image
`= default(this.location, null)`      - null if no location
```

#### `string(value)`

Convert value to string.

```markdown
`= string(this.location[0])`          - Convert number to string
`= string(default(this.image, ""))`   - Ensure string type
```

#### `startswith(string, prefix)`

Check if string starts with prefix.

```markdown
`= startswith(this.image, "http")`    - Check for URL
`= startswith(this.image, "[[")`      - Check for wikilink
```

### Complex Image Display Query

```markdown
`= choice(startswith(string(default(this.image, "")), "[["), "!" + this.image, choice(this.image, "![Image](" + this.image + ")", "No Image"))`
```

**Breakdown:**
1. `default(this.image, "")` - Get image or empty string
2. `string(...)` - Convert to string (handles null)
3. `startswith(..., "[[")` - Check if wikilink format
4. `choice(...)` - If wikilink:
   - `"!" + this.image` - Prepend `!` to embed wikilink
5. Else: `choice(this.image, ...)` - If image exists:
   - `"![Image](" + this.image + ")"` - Create markdown image
6. Else: `"No Image"` - Show placeholder

## Code Block Queries

Dataview code blocks query multiple notes.

### List Queries

```markdown
```dataview
LIST
FROM #tag
WHERE condition
SORT field ASC
```
```

### Table Queries

```markdown
```dataview
TABLE field1, field2, field3
FROM "folder/path"
WHERE condition
```
```

### Location-Based Queries

```markdown
```dataview
TABLE Country, Region, location
FROM #map
WHERE location != null
SORT Country ASC, Region ASC
```
```

## Field Types

### Strings

```yaml
name: "Location Name"
description: Multi-line string
```

Access: `= this.name`

### Numbers

```yaml
rating: 4.5
visitors: 1000
```

Access: `= this.rating`

### Booleans

```yaml
visited: true
publish: false
```

Access: `= this.visited`

### Arrays

```yaml
tags:
  - map/food
  - location
location:
  - 51.4776031
  - -2.6256316
Source:
  - https://source1.com
  - https://source2.com
```

Access:
- `= this.tags` - Entire array
- `= this.tags[0]` - First element
- `= this.location[0]` - Latitude
- `= this.location[1]` - Longitude

### Objects

```yaml
contact:
  email: info@example.com
  phone: "+44 123 456"
```

Access: `= this.contact.email`

### Wikilinks

```yaml
Country: '[[UK]]'
Parent: '[[Photo Locations]]'
```

Access: `= this.Country` (displays as link)

## Common Patterns

### Display Coordinates

```markdown
**Latitude:** `= this.location[0]`
**Longitude:** `= this.location[1]`
```

### Conditional Content

```markdown
`= choice(this.visited, "✓", "○")` Visited status
`= choice(this.publish, "Public", "Private")`
```

### Format Arrays

```markdown
**Tags:** `= join(this.tags, ", ")`
**Sources:** `= length(this.Source)` sources
```

### Null Handling

```markdown
`= default(this.rating, "Not rated")`
`= choice(this.location, "Coordinates available", "No coordinates")`
```

## Mapview Integration

Mapview uses Dataview query syntax to select notes for display.

### Current Note Only

```json
{"query":"path:\"$filename$\""}
```

### All Notes with Tag

```json
{"query":"#map/food"}
```

### Notes in Folder

```json
{"query":"\"97 - MAPS\""}
```

### Complex Query

```json
{"query":"#map AND Country = [[UK]]"}
```

## Best Practices

1. **Always use `default()`** for optional fields to avoid errors
2. **Convert to string** before string operations: `string(value)`
3. **Quote wikilinks** in frontmatter: `'[[Page]]'`
4. **Access array elements** with index: `array[0]`, not `array.0`
5. **Chain functions** from inside out: `string(default(value, ""))`
6. **Test queries** in Dataview view before embedding inline

## Troubleshooting

**Query shows literal code instead of result:**
- Check Dataview plugin enabled
- Verify backtick syntax: `` `= `` not `` ` = ``
- Ensure no spaces between backtick and `=`

**"Field not found" error:**
- Use `default(this.field, fallback)` for optional fields
- Check field name spelling matches frontmatter
- Verify field exists in current note

**Wikilink not rendering:**
- Quote wikilinks in frontmatter: `'[[Page]]'`
- Check for extra spaces or typos in page name

**Array access fails:**
- Use bracket notation: `[0]` not `.0`
- Verify array exists: `choice(this.array, ...)`
- Check array index in bounds (0-based)
