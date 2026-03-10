export interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  importance: number;
  type: string;
}

export interface GeocodedLocation {
  lat: string;
  lon: string;
  display_name: string;
}

const BASE_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "travel-planner-claude-plugin/0.1.0";

async function searchNominatim(
  query: string,
  countryCode?: string
): Promise<NominatimResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: "5",
  });
  if (countryCode) {
    params.set("countrycodes", countryCode);
  }

  const response = await fetch(`${BASE_URL}?${params}`, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(`Nominatim API error: ${response.status}`);
  }

  return response.json();
}

export function selectBestResult(
  results: NominatimResult[]
): NominatimResult | null {
  if (results.length === 0) return null;
  return results.sort((a, b) => b.importance - a.importance)[0];
}

export async function geocode(
  locationName: string,
  country?: string
): Promise<GeocodedLocation | null> {
  // Strategy 1: exact name search
  let results = await searchNominatim(locationName);
  let best = selectBestResult(results);
  if (best) {
    return { lat: best.lat, lon: best.lon, display_name: best.display_name };
  }

  // Strategy 2: name + country filter (if country provided)
  if (country) {
    // Wait 1 second to respect Nominatim rate limit
    await Bun.sleep(1000);
    results = await searchNominatim(`${locationName} ${country}`);
    best = selectBestResult(results);
    if (best) {
      return { lat: best.lat, lon: best.lon, display_name: best.display_name };
    }
  }

  // Strategy 3: simplified name (remove articles, parenthetical text)
  const simplified = locationName
    .replace(/\(.*?\)/g, "")
    .replace(/\b(the|of|de|la|le|el|al)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (simplified !== locationName) {
    await Bun.sleep(1000);
    results = await searchNominatim(simplified);
    best = selectBestResult(results);
    if (best) {
      return { lat: best.lat, lon: best.lon, display_name: best.display_name };
    }
  }

  return null;
}

// CLI entry point
if (import.meta.main) {
  const locationName = process.argv[2];
  const country = process.argv[3];

  if (!locationName) {
    console.error(JSON.stringify({ error: "missing_argument", message: "Usage: bun run geocode.ts <location> [country]" }));
    process.exit(1);
  }

  const result = await geocode(locationName, country);
  if (result) {
    console.log(JSON.stringify(result));
  } else {
    console.log(JSON.stringify({ coordinates: null, reason: "No results found", tried: [locationName, country].filter(Boolean) }));
  }
}
