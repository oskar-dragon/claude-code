---
name: Coordinate Lookup
description: This skill should be used when the user asks to "find coordinates", "get GPS location", "geocode address", "lookup location coordinates", or when creating location notes that require accurate geographic coordinates. Provides geocoding expertise and utility scripts for precise coordinate retrieval.
version: 0.1.0
---

# Coordinate Lookup Skill

## Overview

This skill provides expertise in finding accurate GPS coordinates for locations using various geocoding services. Use this skill when creating location notes, verifying coordinates, or converting addresses to geographic coordinates.

## When to Use This Skill

Activate this skill when:
- Creating location-based notes requiring coordinates
- Converting street addresses to GPS coordinates
- Validating coordinate accuracy
- Choosing between geocoding services
- Troubleshooting coordinate lookup failures

## Coordinate Formats

### Decimal Degrees (Recommended)

The preferred format for Obsidian location notes:

```
location: [40.7128, -74.0060]
```

**Format specification:**
- Array format: `[latitude, longitude]`
- Latitude range: -90 to +90 (negative = South, positive = North)
- Longitude range: -180 to +180 (negative = West, positive = East)
- Precision: 6 decimal places for ~10cm accuracy

**Examples:**
```
Paris, France: [48.856614, 2.352222]
Tokyo, Japan: [35.689487, 139.691706]
Sydney, Australia: [-33.868820, 151.209296]
```

### Alternative Formats

**Degrees, Minutes, Seconds (DMS):**
```
40°42'46.0"N 74°00'21.6"W
```

**Degrees and Decimal Minutes:**
```
40°42.767'N 74°00.360'W
```

**Note:** Always convert to decimal degrees for Obsidian frontmatter.

## Geocoding Services

### Priority Order

Follow this priority when looking up coordinates:

1. **Web Search** (Primary) - Extract coordinates from search results
2. **OpenStreetMap Nominatim** (Free, no API key) - Reliable open-source geocoding
3. **Google Maps API** (Optional, requires API key) - Most accurate for commercial locations

### OpenStreetMap Nominatim

**Endpoint:**
```
https://nominatim.openstreetmap.org/search
```

**Usage:**
```bash
curl "https://nominatim.openstreetmap.org/search?q=Eiffel+Tower+Paris&format=json&limit=1"
```

**Response format:**
```json
[{
  "lat": "48.8583701",
  "lon": "2.2944813",
  "display_name": "Tour Eiffel, 5, Avenue Anatole France, ..."
}]
```

**Best practices:**
- Include city and country in query for accuracy
- Use `format=json` for structured data
- Add `limit=1` for single best result
- Respect usage policy (max 1 request/second)

### Google Maps Geocoding API

**Endpoint:**
```
https://maps.googleapis.com/maps/api/geocode/json
```

**Usage:**
```bash
curl "https://maps.googleapis.com/maps/api/geocode/json?address=Eiffel+Tower+Paris&key=YOUR_API_KEY"
```

**Response format:**
```json
{
  "results": [{
    "geometry": {
      "location": {
        "lat": 48.8583701,
        "lng": 2.2944813
      }
    }
  }]
}
```

**Best practices:**
- Configure API key in plugin settings
- Check API key is available before use
- Handle rate limits gracefully
- Note: `lng` not `lon` in response

### Web Search Extraction

**Strategy:**
Search for location name and extract coordinates from results:

```
"Eiffel Tower Paris coordinates"
```

**Common patterns to extract:**
- Wikipedia info boxes
- Google Maps links
- Location-specific websites
- Travel guides

**Validation:**
- Verify coordinates match expected region
- Check coordinate pairs are complete
- Confirm latitude/longitude order

## Coordinate Validation

### Range Validation

Ensure coordinates fall within valid ranges:

```python
def validate_coordinates(lat, lon):
    if not (-90 <= lat <= 90):
        return False, "Latitude must be between -90 and 90"
    if not (-180 <= lon <= 180):
        return False, "Longitude must be between -180 and 180"
    return True, "Valid coordinates"
```

### Sanity Checks

**Geographic region verification:**
- Check country matches expected hemisphere
- Verify city coordinates are near expected region
- Confirm landmark coordinates align with known location

**Example sanity checks:**
```python
# Paris should be in Northern Hemisphere, Eastern Hemisphere
# Latitude: positive (North), Longitude: positive (East of Prime Meridian)
paris_coords = [48.856614, 2.352222]  # ✓ Valid

# Sydney should be in Southern Hemisphere, Eastern Hemisphere
# Latitude: negative (South), Longitude: positive (East)
sydney_coords = [-33.868820, 151.209296]  # ✓ Valid
```

### Precision Guidelines

**Decimal places and accuracy:**
- 1 decimal place: ~11km precision
- 2 decimal places: ~1.1km precision
- 3 decimal places: ~110m precision
- 4 decimal places: ~11m precision
- 5 decimal places: ~1.1m precision
- 6 decimal places: ~0.11m precision (recommended)

**Recommendation:** Use 6 decimal places for location notes.

## Using the Geocoding Utility Script

The skill provides a Python utility script for coordinate lookup.

### Script Location

```
${CLAUDE_PLUGIN_ROOT}/skills/coordinate-lookup/scripts/geocode.py
```

### Basic Usage

```bash
python ${CLAUDE_PLUGIN_ROOT}/skills/coordinate-lookup/scripts/geocode.py "Eiffel Tower, Paris"
```

**Output:**
```json
{
  "location": "Eiffel Tower, Paris",
  "coordinates": [48.858370, 2.294481],
  "source": "nominatim",
  "display_name": "Tour Eiffel, 5, Avenue Anatole France, Gros-Caillou, 7th Arrondissement, Paris, Île-de-France, Metropolitan France, 75007, France"
}
```

### With Google Maps API

```bash
export GOOGLE_MAPS_API_KEY="your-api-key"
python ${CLAUDE_PLUGIN_ROOT}/skills/coordinate-lookup/scripts/geocode.py "Eiffel Tower, Paris" --use-google
```

### Error Handling

**Location not found:**
```json
{
  "error": "Location not found",
  "location": "Nonexistent Place XYZ",
  "suggestion": "Try more specific query with city and country"
}
```

**API rate limit:**
```json
{
  "error": "Rate limit exceeded",
  "source": "nominatim",
  "suggestion": "Wait 1 second before retrying"
}
```

### Integration in Agents

When creating location notes, use the geocoding script:

```python
import subprocess
import json

def get_coordinates(location_name):
    """Get coordinates for a location."""
    result = subprocess.run(
        ["python", f"{os.environ['CLAUDE_PLUGIN_ROOT']}/skills/coordinate-lookup/scripts/geocode.py", location_name],
        capture_output=True,
        text=True
    )

    if result.returncode == 0:
        data = json.loads(result.stdout)
        return data.get("coordinates")
    return None
```

## Manual Coordinate Input

When automated lookup fails, prompt user for manual input:

**User prompt template:**
```
I couldn't find coordinates for "{location_name}" automatically.

Please provide coordinates in one of these formats:
1. Decimal degrees: 48.8584, 2.2945
2. Array format: [48.8584, 2.2945]
3. DMS: 48°51'30.2"N 2°17'40.2"E

You can find coordinates using Google Maps (right-click location → coordinates).
```

**Parse user input:**
- Handle comma-separated decimals
- Parse array format
- Convert DMS to decimal if provided
- Validate ranges after parsing

## Common Issues and Solutions

### Issue: Ambiguous Location Names

**Problem:** Generic names like "Central Park" without city context

**Solution:**
- Always include city and country in geocoding query
- Example: "Central Park, New York City, USA" not "Central Park"
- Verify result matches intended location

### Issue: Coordinates in Wrong Order

**Problem:** Longitude, latitude instead of latitude, longitude

**Solution:**
- Always use [latitude, longitude] order
- Latitude is Y-axis (North/South): -90 to +90
- Longitude is X-axis (East/West): -180 to +180
- Sanity check: Latitude typically has smaller absolute value for non-polar locations

### Issue: Insufficient Precision

**Problem:** Coordinates like [48.86, 2.29] too imprecise

**Solution:**
- Request 6 decimal places minimum
- Example: [48.858370, 2.294481] not [48.86, 2.29]
- Check geocoding service returns full precision

### Issue: Coordinates for Large Areas

**Problem:** User requests coordinates for "France" or "California"

**Solution:**
- Ask for clarification: specific city or landmark
- If area coordinates needed, use geographic center
- Consider creating multiple location notes for regions

## Additional Resources

### Reference Files

For detailed information on geocoding APIs and advanced techniques:
- **`references/apis.md`** - Comprehensive API documentation for Nominatim and Google Maps
- **`references/troubleshooting.md`** - Advanced troubleshooting scenarios

### Example Files

Working examples demonstrating coordinate lookup:
- **`examples/geocode-example.sh`** - Shell script examples
- **`examples/test-locations.txt`** - Sample locations for testing

### Utility Scripts

- **`scripts/geocode.py`** - Primary geocoding utility with multiple provider support

## Quick Reference

**OpenStreetMap Nominatim (Free):**
```bash
curl "https://nominatim.openstreetmap.org/search?q=LOCATION&format=json&limit=1"
```

**Extract coordinates from JSON:**
```bash
| jq -r '.[0] | [.lat, .lon]'
```

**Google Maps (Requires API Key):**
```bash
curl "https://maps.googleapis.com/maps/api/geocode/json?address=LOCATION&key=KEY"
```

**Extract coordinates from JSON:**
```bash
| jq -r '.results[0].geometry.location | [.lat, .lng]'
```

**Validate coordinates in Python:**
```python
-90 <= lat <= 90 and -180 <= lon <= 180
```

---

Use this skill when creating location notes to ensure accurate, validated GPS coordinates in the correct format for Obsidian.
