# Frontmatter Schema for Location Notes

Complete field definitions and types for location notes in Obsidian.

## Required Fields

### tags (Array)

Hierarchical tags for categorization and Mapview filtering.

**Type:** Array of strings
**Format:** `map/TYPE` where TYPE is location category
**Required:** Yes

```yaml
tags:
  - map/food              # Food/dining locations
  - map/photo-location    # Photography spots  - map/accommodation/campsite  # Campsites
  - map/other             # General locations/POIs
```

**Valid tag structures:**
- `map/food` - Restaurants, cafes, dining
- `map/photo-location` - Photography locations
- `map/accommodation/campsite` - Campsites and lodging
- `map/other` - General points of interest

### Country (Wikilink)

Country where location is situated.

**Type:** Wikilink (quoted string)
**Required:** Yes

```yaml
Country: '[[UK]]'
Country: '[[France]]'
Country: '[[USA]]'
```

**Important:** Must quote wikilinks in frontmatter to preserve syntax.

### Region (Wikilink)

Region, state, or administrative area within country.

**Type:** Wikilink (quoted string)
**Required:** Yes

```yaml
Region: '[[Somerset]]'
Region: '[[Scottish Highlands]]'
Region: '[[California]]'
```

### Source (Array)

URLs of sources used for research and information.

**Type:** Array of URLs
**Required:** Yes (minimum 1, recommended 5+)

```yaml
Source:
  - https://example.com/location
  - https://tripadvisor.com/location
  - https://wikipedia.org/location
  - https://maps.google.com/location
  - https://visitbritain.com/location
```

**Best practices:**
- Include 5+ sources for comprehensive research
- Use authoritative sources (official websites, travel guides)
- List in order of relevance/reliability

## Optional Fields

### location (Array)

GPS coordinates as [latitude, longitude].

**Type:** Array of two numbers
**Format:** `[LATITUDE, LONGITUDE]`
**Required:** No (optional, skip if unavailable)

```yaml
location:
  - 51.4776031    # Latitude (first)
  - -2.6256316    # Longitude (second)
```

**Coordinate format:**
- Latitude: -90 to 90 (negative = South, positive = North)
- Longitude: -180 to 180 (negative = West, positive = East)
- Decimal degrees (not DMS format)
- Minimum 6 decimal places for accuracy

**Do not use:**
- String format: `"51.4776031, -2.6256316"` ❌
- Object format: `{lat: 51.4776031, lon: -2.6256316}` ❌
- DMS format: `51°28'39.4"N 2°37'32.3"W` ❌

### image (String or Wikilink)

Image URL or wikilink to local image file.

**Type:** String (URL) or quoted wikilink
**Required:** No (optional)

```yaml
image: https://example.com/image.jpg
image: '[[local-image.webp]]'
```

**Formats supported:**
- **URL:** `https://example.com/image.jpg`
- **Wikilink:** `'[[image-file.jpg]]'` (must quote)

**Best practices:**
- Use high-quality images (min 800px width)
- Prefer WEBP or JPG formats for file size
- Include image credit in note if required

### visited / Done (Boolean)

Whether location has been visited.

**Type:** Boolean
**Required:** No
**Default:** false

```yaml
visited: false
Done: false
```

**Note:** Use `visited` for general locations, `Done` for other types. Both mean "not yet visited" when false.

### publish (Boolean)

Whether note should be published (for Obsidian Publish).

**Type:** Boolean
**Required:** No
**Default:** true

```yaml
publish: true
```

### color (String)

Marker color for Mapview display.

**Type:** String
**Required:** No
**Default:** blue

```yaml
color: blue
color: red
color: green
```

**Valid colors:** red, orange, yellow, green, blue, purple, pink, brown, gray, black

### icon (String)

Icon name for Mapview marker.

**Type:** String
**Required:** No
**Default:** map-pin

```yaml
icon: map-pin        # General locations
icon: utensils       # Food locations
icon: camera         # Photo locations
icon: tent-tree      # Campsites/accommodation
```

**Common icons:**
- `map-pin` - General POI marker
- `utensils` - Restaurants/food
- `camera` - Photography spots
- `tent-tree` - Campsites
- `hotel` - Hotels/accommodation
- `mountain` - Natural landmarks
- `building` - Buildings/structures

Refer to Font Awesome or Lucide icon sets for full list.

## Type-Specific Fields

### Photo Location Fields

**best_time (String)**
Best time of day or season for photography.

```yaml
best_time: "Golden hour (sunrise/sunset)"
best_time: "Autumn for foliage"
best_time: "Blue hour"
```

**Type (String)**
Type of photography location.

```yaml
Type: "Landscape"
Type: "Architectural"
Type: "Wildlife"
```

**Parent (Wikilink)**
Parent page or category.

```yaml
Parent: "[[Photo Locations]]"
```

## Complete Examples

### General Location

```yaml
---
tags:
  - map/other
Country: '[[UK]]'
Region: '[[Somerset]]'
location:
  - 51.4776031
  - -2.6256316
Source:
  - https://botanic-garden.bristol.ac.uk/
  - https://visitbristol.co.uk/things-to-do/botanic-garden
image: '[[botanic-garden.webp]]'
visited: false
publish: true
color: blue
icon: map-pin
---
```

### Food Location

```yaml
---
tags:
  - map/food
Country: '[[UK]]'
Region: '[[London]]'
location:
  - 51.5074
  - -0.1278
Source:
  - https://dishoom.com/
  - https://tripadvisor.com/dishoom
  - https://timeout.com/london/restaurants/dishoom
image: https://example.com/dishoom.jpg
Done: false
publish: true
color: blue
icon: utensils
---
```

### Photo Location

```yaml
---
tags:
  - map/photo-location
icon: camera
Type: "Landscape"
Country: '[[UK]]'
Region: '[[Scottish Highlands]]'
location:
  - 57.2730
  - -6.1871
best_time: "Sunrise for best light"
Done: false
Parent: "[[Photo Locations]]"
Source:
  - https://visitscotland.com/
  - https://photographyspots.com/
image: '[[fairy-pools.webp]]'
publish: true
color: blue
---
```

### Accommodation

```yaml
---
tags:
  - map/accommodation/campsite
Country: '[[UK]]'
Region: '[[Lake District]]'
location:
  - 54.4609
  - -3.0886
Source:
  - https://campsite-website.com/
  - https://pitchup.com/campsites/uk
image: https://example.com/campsite.jpg
publish: true
color: blue
icon: tent-tree
---
```

## Validation Rules

Valid location note frontmatter must have:
- ✅ `tags` array with at least one `map/*` tag
- ✅ `Country` field as quoted wikilink
- ✅ `Region` field as quoted wikilink
- ✅ `Source` array with at least one URL
- ⚠️ `location` array with exactly 2 numbers (optional)
- ⚠️ `image` as URL or quoted wikilink (optional)
- ✅ `publish` as boolean (defaults to true)
- ✅ `Done`/`visited` as boolean (defaults to false)
- ⚠️ `color` as valid color string (optional, defaults to blue)
- ⚠️ `icon` as valid icon name (optional, defaults by type)

## Common Mistakes

**Missing quotes on wikilinks:**
```yaml
Country: [[UK]]  # ❌ Invalid YAML
Country: '[[UK]]'  # ✅ Correct
```

**Wrong location format:**
```yaml
location: "51.4776031, -2.6256316"  # ❌ String
location:  # ✅ Array
  - 51.4776031
  - -2.6256316
```

**Single source:**
```yaml
Source: https://example.com  # ❌ Should be array
Source:  # ✅ Correct
  - https://example.com
```

**Wrong tag format:**
```yaml
tags: map/food  # ❌ Should be array
tags:  # ✅ Correct
  - map/food
```

**Boolean as string:**
```yaml
publish: "true"  # ❌ String
publish: true  # ✅ Boolean
```
