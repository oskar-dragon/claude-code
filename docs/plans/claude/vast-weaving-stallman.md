# Fix marketplace.json issues and add $schema

## Context

The `marketplace.json` has several issues when compared against the official Claude Code plugin marketplace schema (from [the docs](https://code.claude.com/docs/en/plugin-marketplaces) and [Anthropic's own marketplaces](https://github.com/anthropics/claude-code/blob/main/.claude-plugin/marketplace.json)):

## Issues found

### Critical (will cause problems)
1. **`obsidian-location-notes` is missing `source`** — `source` is a required field per the schema. Should be `"./plugins/obsidian-location-notes"`
2. **`vault-manager` plugin exists on disk but is not in marketplace.json** — it exists at `plugins/vault-manager/` with a full `plugin.json`

### Non-standard fields (not in official schema)
3. **Top-level `source` object** — Anthropic's schema doesn't have this; their marketplaces don't use it
4. **Top-level `repository` string** — not in the official schema
5. **Top-level `strict: false`** — `strict` is a per-plugin field, not marketplace-level

### Minor
6. **`chezmoi` version duplication** — both `plugin.json` and `marketplace.json` declare `version: "0.1.0"`. Docs warn against this for relative-path plugins (plugin.json silently wins). Will remove version from `chezmoi`'s plugin.json.
7. **No `$schema` field** — Anthropic's own marketplaces include `"$schema": "https://anthropic.com/claude-code/marketplace.schema.json"`. Note: this URL doesn't actually resolve yet ([issue #9686](https://github.com/anthropics/claude-code/issues/9686)), but adding it matches convention and will work once Anthropic publishes it.

## Plan

### Files to modify

- `.claude-plugin/marketplace.json` — fix all issues above
- `plugins/chezmoi/.claude-plugin/plugin.json` — remove `version` field

### Changes to marketplace.json

1. Add `$schema` field pointing to `https://anthropic.com/claude-code/marketplace.schema.json`
2. Remove top-level `source`, `repository`, and `strict` fields
3. Add missing `source` to `obsidian-location-notes`: `"./plugins/obsidian-location-notes"`
4. Add `vault-manager` plugin entry with metadata from its plugin.json (version `2.1.0`, description from plugin.json, source `./plugins/vault-manager`)
5. Bump no plugin versions (we're fixing the marketplace file itself, not changing plugin content)

### Changes to chezmoi plugin.json

1. Remove `version` field, leaving only `name`

## Verification

- Validate the resulting JSON is valid (parse it)
- Confirm all 10 plugin directories have corresponding marketplace entries
- Confirm all entries have the required `name` and `source` fields
