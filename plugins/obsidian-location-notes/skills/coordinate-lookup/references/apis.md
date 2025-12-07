# Geocoding API Reference

Comprehensive reference for geocoding APIs used in coordinate lookup.

## OpenStreetMap Nominatim API

### Overview

Free, open-source geocoding service based on OpenStreetMap data.

**Base URL:** `https://nominatim.openstreetmap.org`

**Rate Limit:** 1 request per second
**API Key:** Not required
**Cost:** Free

### Search Endpoint

**URL:** `GET /search`

**Parameters:**
- `q` (string, required) - Free-form query string
- `format` (string) - Response format (`json`, `jsonv2`, `xml`, `geojson`)
- `limit` (integer) - Max number of results (default: 10)
- `countrycodes` (string) - Limit to specific countries (ISO 3166-1alpha2 codes)
- `viewbox` (string) - Preferred area to search (min_lon,min_lat,max_lon,max_lat)
- `bounded` (0|1) - Restrict results to viewbox
- `addressdetails` (0|1) - Include address breakdown
- `extratags` (0|1) - Include additional OSM tags
- `namedetails` (0|1) - Include name translations

**Example Request:**
```bash
curl "https://nominatim.openstreetmap.org/search?q=Eiffel+Tower+Paris&format=json&limit=1" \
  -H "User-Agent: ObsidianLocationNotes/0.1.0"
```

**Example Response:**
```json
[
  {
    "place_id": 85681634,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    "osm_type": "way",
    "osm_id": 5013364,
    "boundingbox": ["48.8573802", "48.8591923", "2.2933273", "2.295657"],
    "lat": "48.8583701",
    "lon": "2.2944813",
    "display_name": "Tour Eiffel, 5, Avenue Anatole France, Gros-Caillou, 7th Arrondissement, Paris, Île-de-France, Metropolitan France, 75007, France",
    "class": "tourism",
    "type": "attraction",
    "importance": 0.9285153886166438
  }
]
```

### Reverse Geocoding

**URL:** `GET /reverse`

**Parameters:**
- `lat` (float, required) - Latitude
- `lon` (float, required) - Longitude
- `format` (string) - Response format
- `zoom` (integer) - Level of detail (0-18, default: 18)

**Example:**
```bash
curl "https://nominatim.openstreetmap.org/reverse?lat=48.8583701&lon=2.2944813&format=json" \
  -H "User-Agent: ObsidianLocationNotes/0.1.0"
```

### Usage Policy

**Required:**
- Include valid `User-Agent` header identifying your application
- Limit to max 1 request per second
- Cache results when possible

**Prohibited:**
- Bulk geocoding large datasets
- Continuous querying
- Heavy usage without hosting own Nominatim instance

**Best Practices:**
- Throttle requests to <1/second
- Use most specific query possible
- Cache frequently accessed coordinates
- Consider self-hosting for heavy usage

## Google Maps Geocoding API

### Overview

Commercial geocoding service with high accuracy and coverage.

**Base URL:** `https://maps.googleapis.com/maps/api`

**Rate Limit:** Based on API key tier (varies)
**API Key:** Required
**Cost:** Pay-per-use (free tier available)

### Setup

1. Create project in Google Cloud Console
2. Enable "Geocoding API"
3. Create API key with restrictions
4. Set `GOOGLE_MAPS_API_KEY` environment variable

**API Key Restrictions (Recommended):**
- Application restrictions: IP addresses or HTTP referrers
- API restrictions: Limit to Geocoding API only

### Geocoding Endpoint

**URL:** `GET /geocode/json`

**Parameters:**
- `address` (string, required) - Address to geocode
- `key` (string, required) - API key
- `bounds` (string) - Bounding box bias (southwest_lat,southwest_lng|northeast_lat,northeast_lng)
- `language` (string) - Language for results (IETF code)
- `region` (string) - Region bias (ccTLD)
- `components` (string) - Component filters (route:Rue+Eiffel|locality:Paris)

**Example Request:**
```bash
curl "https://maps.googleapis.com/maps/api/geocode/json?address=Eiffel+Tower+Paris&key=YOUR_API_KEY"
```

**Example Response:**
```json
{
  "results": [
    {
      "address_components": [
        {
          "long_name": "Eiffel Tower",
          "short_name": "Eiffel Tower",
          "types": ["premise"]
        },
        {
          "long_name": "Paris",
          "short_name": "Paris",
          "types": ["locality", "political"]
        }
      ],
      "formatted_address": "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
      "geometry": {
        "location": {
          "lat": 48.8583701,
          "lng": 2.2922926
        },
        "location_type": "ROOFTOP",
        "viewport": {
          "northeast": {
            "lat": 48.8597190802915,
            "lng": 2.293641580291502
          },
          "southwest": {
            "lat": 48.8570211197085,
            "lng": 2.290943619708498
          }
        }
      },
      "place_id": "ChIJLU7jZClu5kcR4PcOOO6p3I0",
      "types": ["premise", "point_of_interest", "establishment"]
    }
  ],
  "status": "OK"
}
```

### Status Codes

- `OK` - Successful geocoding
- `ZERO_RESULTS` - No results found
- `OVER_QUERY_LIMIT` - Quota exceeded
- `REQUEST_DENIED` - API key invalid or request denied
- `INVALID_REQUEST` - Missing required parameter
- `UNKNOWN_ERROR` - Server error, retry may succeed

### Reverse Geocoding

**URL:** `GET /geocode/json`

**Parameters:**
- `latlng` (string, required) - Latitude,longitude
- `key` (string, required) - API key

**Example:**
```bash
curl "https://maps.googleapis.com/maps/api/geocode/json?latlng=48.8583701,2.2922926&key=YOUR_API_KEY"
```

### Location Types

Indicates geocoding accuracy:

- `ROOFTOP` - Precise address
- `RANGE_INTERPOLATED` - Interpolated between two precise points
- `GEOMETRIC_CENTER` - Center of result (e.g., polyline or polygon)
- `APPROXIMATE` - Approximate location

### Best Practices

1. **Error Handling:**
   - Check `status` field before parsing results
   - Handle `OVER_QUERY_LIMIT` with exponential backoff
   - Log `REQUEST_DENIED` for debugging

2. **Performance:**
   - Cache frequently accessed coordinates
   - Batch requests when possible
   - Use component filtering for faster results

3. **Cost Optimization:**
   - Set up billing alerts
   - Use Nominatim for simple queries
   - Cache aggressively
   - Consider Places API for POI lookups

## Service Comparison

| Feature | Nominatim | Google Maps |
|---------|-----------|-------------|
| **Cost** | Free | Pay-per-use |
| **API Key** | Not required | Required |
| **Rate Limit** | 1 req/sec | Tier-based |
| **Coverage** | Global | Global |
| **Accuracy** | Good | Excellent |
| **POI Data** | OSM-based | Extensive |
| **Best For** | General locations | Commercial POIs |

## Choosing a Service

### Use Nominatim When:
- No budget for geocoding
- General location lookup (cities, landmarks)
- Low request volume (<1/second)
- Open-source preference
- Self-hosting option desired

### Use Google Maps When:
- Budget available
- High accuracy required
- Commercial POIs (restaurants, shops)
- High request volume
- Integration with other Google services

### Fallback Strategy

Recommended approach for plugin:

1. **Try Nominatim first** (free, no API key)
2. **Fallback to Google Maps** if configured and Nominatim fails
3. **Manual input** if both fail

This maximizes free usage while providing high-accuracy fallback.

## Testing Coordinates

### Validation Checklist

- [ ] Latitude in range -90 to +90
- [ ] Longitude in range -180 to +180
- [ ] Coordinates in correct order [lat, lon]
- [ ] Precision sufficient (6 decimal places)
- [ ] Coordinates match expected region

### Visual Verification

Verify coordinates using online tools:

**Google Maps:**
```
https://www.google.com/maps/search/?api=1&query=LAT,LON
```

**OpenStreetMap:**
```
https://www.openstreetmap.org/?mlat=LAT&mlon=LON&zoom=15
```

### Example Test Locations

Well-known locations for testing:

```json
{
  "Eiffel Tower, Paris": [48.858370, 2.294481],
  "Statue of Liberty, New York": [40.689247, -74.044502],
  "Sydney Opera House": [-33.856784, 151.215297],
  "Taj Mahal, Agra": [27.175015, 78.042155],
  "Great Wall of China": [40.431908, 116.570374],
  "Christ the Redeemer, Rio": [-22.951916, -43.210487],
  "Machu Picchu, Peru": [-13.163136, -72.545128]
}
```

## Additional Resources

- [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)
- [Google Geocoding API Docs](https://developers.google.com/maps/documentation/geocoding)
- [OpenStreetMap Data License](https://www.openstreetmap.org/copyright)
- [Coordinate Systems Explained](https://en.wikipedia.org/wiki/Geographic_coordinate_system)
