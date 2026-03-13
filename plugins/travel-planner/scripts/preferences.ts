import { parse as parseYaml } from "yaml";

export interface Preferences {
  sources: string[];
}

export function parsePreferences(content: string): Preferences {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new Error("No YAML frontmatter found");
  }

  const parsed = parseYaml(match[1]);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid YAML frontmatter");
  }

  if (!("sources" in parsed)) {
    throw new Error("Missing required field: sources");
  }

  const sources = (parsed as Record<string, unknown>).sources;
  if (!Array.isArray(sources) || sources.length === 0) {
    throw new Error("sources must be a non-empty array");
  }

  if (!sources.every((s) => typeof s === "string")) {
    throw new Error("sources must be an array of strings");
  }

  return { sources };
}

// CLI entry point
if (import.meta.main) {
  const configPath =
    process.argv[2] ?? `${process.env.HOME}/.claude/travel-planner.local.md`;

  const file = Bun.file(configPath);
  const exists = await file.exists();

  if (!exists) {
    console.error(
      JSON.stringify({ error: "config_not_found", path: configPath }),
    );
    process.exit(1);
  }

  const content = await file.text();
  try {
    const prefs = parsePreferences(content);
    console.log(JSON.stringify(prefs));
  } catch (e) {
    console.error(
      JSON.stringify({ error: "parse_error", message: (e as Error).message }),
    );
    process.exit(1);
  }
}
