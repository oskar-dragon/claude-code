# Obsidian Location Notes Plugin

Automated location research and note creation for Obsidian with intelligent geolocation and multi-source research.

## Overview

This Claude Code plugin automatically creates comprehensive, well-researched location notes in your Obsidian vault. It combines web research, OpenStreetMap geocoding, and template-based note generation to produce structured location documentation.

## Features

- **Multi-input support**: Accepts location names, website URLs, or PDF file paths
- **Specialized research**: Four location types with domain-specific agents:
  - General locations (POIs, landmarks, attractions)
  - Food & dining locations (restaurants, cafes, food spots)
  - Photography locations (scenic spots, best times, equipment tips)
  - Accommodation (campsites, hotels, lodging)
- **Parallel data gathering**: Research and geocoding happen simultaneously for speed
- **Accurate geolocation**: OpenStreetMap Nominatim API integration
- **Multi-source research**: Minimum 5 sources with citations
- **Quality validation**: Automatic validation of created notes
- **Template-based**: Uses your Obsidian templates for consistent formatting

## Installation

```bash
/plugin install obsidian-location-notes@claude-code
```

## Prerequisites

1. **Obsidian vault**: You must have an Obsidian vault set up
2. **Configuration file**: Create `.claude/obsidian-location-notes.local.md` with your vault path

## Configuration

Create a configuration file at `.claude/obsidian-location-notes.local.md`:

```markdown
---
vault_path: "/Users/yourusername/path/to/obsidian/vault"
save_location: "97 - MAPS"
---

# Obsidian Location Notes Configuration

This file configures the obsidian-location-notes plugin.

## Settings

- **vault_path**: Absolute path to your Obsidian vault
- **save_location**: Directory within vault where notes should be saved (relative to vault root)
```

## Usage

### Basic Usage

Create a location note by name:
```bash
/obsidian-location-notes:create "Old Man of Storr"
```

The plugin will:
1. Ask you to select location type (General/Food/Photo/Accommodation)
2. Research the location from multiple sources
3. Find accurate GPS coordinates via OpenStreetMap
4. Create a formatted note in your vault
5. Validate the note for completeness

### With URL

Provide a website URL as source:
```bash
/obsidian-location-notes:create "https://example.com/restaurant"
```

### With PDF

Provide a PDF file path:
```bash
/obsidian-location-notes:create "/path/to/location-info.pdf"
```

### With Type Flag

Skip the interactive question by specifying type:
```bash
/obsidian-location-notes:create "Dishoom" --type food
/obsidian-location-notes:create "Fairy Pools" --type photo
/obsidian-location-notes:create "Glencoe Campsite" --type accommodation
```

## Components

### Commands

- **`/obsidian-location-notes:create`**: Main command for creating location notes

### Agents

- **general-location-researcher**: Research general POIs and landmarks
- **food-location-researcher**: Research restaurants and dining locations
- **photo-location-researcher**: Research photography spots with seasonal/timing advice
- **accommodation-researcher**: Research campsites and accommodation
- **coordinate-finder**: Find accurate GPS coordinates using OpenStreetMap
- **note-validator**: Validate created notes for completeness and format

### Skills

- **obsidian-formatting**: Obsidian-specific markdown, frontmatter, and Dataview syntax
- **coordinate-lookup**: OpenStreetMap geocoding expertise and utilities

## Templates

The plugin includes four Obsidian note templates:
- General Location Template
- Food Template
- Photo Location Template
- Accommodation/Campsite Template

Templates are stored in the plugin and used automatically based on location type.

## Note Structure

Created notes include:
- **YAML frontmatter**: Country, Region, location (coordinates), tags, image URL, source URLs
- **Mapview block**: Interactive map showing the location
- **Description**: Detailed information about the location
- **Type-specific sections**:
  - Food: cuisine, prices, general info
  - Photo: best time, seasonal info, equipment recommendations
  - Accommodation: amenities, booking info
- **Travel Information**: Directions, parking, accessibility

## Research Process

1. **Source analysis**: If URL/PDF provided, extracts information first
2. **Deep research**: Searches minimum 5 sources for comprehensive information
3. **Geocoding**: Uses OpenStreetMap Nominatim API for accurate coordinates
4. **Parallel execution**: Research and geocoding run simultaneously
5. **Citation**: All sources recorded in frontmatter `Source:` field

## Validation

The note validator checks:
- ✅ Country field populated
- ✅ Region field populated
- ✅ Source URLs provided in frontmatter
- ✅ Correct tag for location type
- ✅ Description section complete
- ✅ Travel Information section complete
- ⚠️ Image URL (optional)
- ⚠️ Geolocation coordinates (optional, skipped if not found)

If issues are found, the validator asks if you want them fixed.

## Troubleshooting

**"Configuration not found"**
- Create `.claude/obsidian-location-notes.local.md` with `vault_path` setting

**"Note already exists"**
- A note with this location name already exists in your vault
- Choose a different name or manually handle the existing note

**"Coordinates not found"**
- OpenStreetMap couldn't geocode the location
- The note will be created without coordinates (location field left empty)

**"Validation failed"**
- Some required fields are missing or incorrectly formatted
- The validator will ask if you want issues fixed automatically

## Examples

### Example 1: Research a landmark
```bash
/obsidian-location-notes:create "University of Bristol Botanic Gardens"
```
→ Prompts for type → Select "General" → Creates comprehensive note with hours, admission, features

### Example 2: Food location with URL
```bash
/obsidian-location-notes:create "https://dishoom.com/edinburgh/" --type food
```
→ Reads website → Researches additional sources → Creates food note with cuisine, prices, info

### Example 3: Photography location
```bash
/obsidian-location-notes:create "Fairy Pools, Isle of Skye" --type photo
```
→ Researches → Includes best time of day, seasonal advice, equipment tips, directions

## Contributing

This plugin is part of the claude-code plugin marketplace.

## License

MIT

## Version History

- **0.1.0**: Initial release
