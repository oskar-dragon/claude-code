import { parse as parseYaml } from "yaml";

export interface Preferences {
  travel_style: string;
  budget_level: string;
  accommodation_preference: string[];
  interests: string[];
  dietary_restrictions: string[];
  pace_preference: string;
  travel_companions: string;
  preferred_sources: string[];
}

const REQUIRED_FIELDS: (keyof Preferences)[] = [
  "travel_style",
  "budget_level",
  "accommodation_preference",
  "interests",
  "dietary_restrictions",
  "pace_preference",
  "travel_companions",
  "preferred_sources",
];

export function parsePreferences(content: string): Preferences {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error("No YAML frontmatter found");
  }

  const parsed = parseYaml(match[1]);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid YAML frontmatter");
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in parsed)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  return parsed as Preferences;
}

// CLI entry point
if (import.meta.main) {
  const configPath =
    process.argv[2] ??
    `${process.env.HOME}/.claude/travel-planner.local.md`;

  const file = Bun.file(configPath);
  const exists = await file.exists();

  if (!exists) {
    console.error(JSON.stringify({ error: "config_not_found", path: configPath }));
    process.exit(1);
  }

  const content = await file.text();
  try {
    const prefs = parsePreferences(content);
    console.log(JSON.stringify(prefs, null, 2));
  } catch (e) {
    console.error(JSON.stringify({ error: "parse_error", message: (e as Error).message }));
    process.exit(1);
  }
}
