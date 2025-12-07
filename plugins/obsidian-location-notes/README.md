# Obsidian Location Notes Plugin

Create location-based notes in Obsidian with automated research, accurate coordinates, and rich contextual information.

## Overview

This Claude Code plugin helps you create detailed location notes for your Obsidian PKM vault. It supports four different location types with specialized research for each:

- **Accommodation/Campsite** - Places to stay with travel information and amenities
- **Photo Location** - Photography spots with best times and composition tips
- **Food/Restaurant** - Dining locations with cuisine details and ratings
- **General Location** - Other points of interest

## Features

- 🗺️ **Accurate Coordinates** - Automated GPS coordinate lookup with manual fallback
- 🔍 **Automated Research** - Gathers comprehensive information from web sources
- 📝 **Template-Based** - Four specialized templates for different location types
- 🖼️ **Image Integration** - Finds and includes relevant images
- ⚙️ **Configurable** - Customize vault path, note location, and preferences

## Installation

```bash
/plugin marketplace add oskar-dragon/claude-code
/plugin install obsidian-location-notes@claude-code
```

## Configuration

Create a settings file at `.claude/obsidian-location-notes.local.md`:

```markdown
---
vault_path: /Users/yourname/path/to/obsidian/vault
notes_folder: Locations
google_maps_api_key: YOUR_API_KEY_HERE (optional)
---

# Obsidian Location Notes Configuration

Configure your Obsidian vault integration here.
```

### Required Settings

- `vault_path` - Absolute path to your Obsidian vault
- `notes_folder` - Subfolder within vault for location notes (relative path)

### Optional Settings

- `google_maps_api_key` - Google Maps API key for enhanced location data

## Usage

### Create a Location Note

```bash
/obsidian-loc:create "Paris Eiffel Tower"
```

The plugin will:
1. Ask you to select the location type (Accommodation, Photo, Food, or General)
2. Research comprehensive information about the location
3. Find accurate GPS coordinates
4. Gather relevant images
5. Create a formatted note in your Obsidian vault

### Command Reference

- `/obsidian-loc:create [location-name]` - Create a new location note with interactive template selection

## Templates

The plugin includes four built-in templates:

### Accommodation/Campsite
- Country, Region, Location coordinates
- Description and amenities
- Travel information and parking

### Photo Location
- Country, Region, Location coordinates
- Photography tips and best times
- Scene description
- Travel and access information

### Food/Restaurant
- Country, Region, Location coordinates
- Cuisine type and description
- Travel and parking information

### General Location
- Country, Region, Location coordinates
- General description
- Travel information

## How It Works

1. **Command Execution** - Run `/obsidian-loc:create "Location Name"`
2. **Template Selection** - Choose location type via interactive prompt
3. **Research Phase** - Specialized agent researches location information
4. **Coordinate Lookup** - Accurate GPS coordinates retrieved (with manual fallback)
5. **Note Generation** - Formatted markdown file created in your vault

## Research Agents

The plugin uses specialized research agents for each location type:

- `accommodation-researcher` - Campsite and accommodation details
- `photo-location-researcher` - Photography-specific information
- `food-location-researcher` - Restaurant and dining details
- `general-location-researcher` - General points of interest
- `coordinate-finder` - Accurate GPS coordinate lookup

## Skills

- `coordinate-lookup` - Geocoding and coordinate validation with utility scripts
- `obsidian-formatting` - Proper Obsidian markdown and frontmatter formatting

## Data Sources

The plugin prioritizes web search for information gathering, with optional API integration:

- Web search (primary source)
- OpenStreetMap (coordinates)
- Google Maps API (optional, enhanced data)
- Wikipedia/Wikidata (structured information)

## Troubleshooting

### Notes Not Creating

- Verify `vault_path` in settings points to valid Obsidian vault
- Check `notes_folder` exists in your vault
- Ensure you have write permissions

### Coordinate Lookup Failing

- Plugin will prompt for manual coordinate input
- Verify internet connection for geocoding services
- Check Google Maps API key if configured

### Missing Information

- Web search results vary by location popularity
- Less known locations may have limited information
- You can manually edit notes after creation

## Examples

### Create a Photo Location Note

```bash
/obsidian-loc:create "Yosemite Valley Tunnel View"
```

Select "Photo Location" template, and the plugin will research:
- Best times for photography
- Composition tips
- Access and parking information
- Accurate GPS coordinates

### Create a Restaurant Note

```bash
/obsidian-loc:create "Osteria Francescana Modena"
```

Select "Food/Restaurant" template for:
- Cuisine type and style
- Location details
- Travel information

## License

MIT

## Support

Report issues at: https://github.com/oskar-dragon/claude-code/issues
