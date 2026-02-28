---
name: Add Chezmoi Dependency
description: This skill should be used when the user asks to "add a dependency", "add a package", "add a homebrew formula", "add a cask", "add a brew tap", "add a MAS app", "add a bun package", "install a new tool via chezmoi", or wants to add any new software to their chezmoi-managed packages. Guides the complete workflow for adding dependencies to chezmoi's packages.toml and applying the changes.
version: 0.1.0
---

# Add Chezmoi Dependency

This skill guides the workflow for adding new dependencies to the chezmoi-managed dotfiles setup. Dependencies are tracked in `~/.local/share/chezmoi/.chezmoidata/packages.toml` and applied via `chezmoi apply`.

## packages.toml Structure

The packages file is located at:

```
~/.local/share/chezmoi/.chezmoidata/packages.toml
```

### Package Types

| Type             | TOML Section                              | Description                                  |
| ---------------- | ----------------------------------------- | -------------------------------------------- |
| Homebrew formula | `[packages.homebrew.<category>] formulae` | CLI tools installed via `brew install`       |
| Homebrew cask    | `[packages.homebrew.<category>] casks`    | GUI apps installed via `brew install --cask` |
| Homebrew tap     | `[packages.homebrew.<category>] taps`     | Third-party Homebrew repositories            |
| MAS app          | `[packages.mas.<category>] apps`          | Mac App Store apps (requires `mas` formula)  |
| Bun package      | `[packages.bun.<category>] packages`      | Bun global packages (`bun add -g`)           |
| npm package      | `[packages.npm.<category>] packages`      | npm global packages (prefer bun)             |

### Machine Categories

| Category            | Description               |
| ------------------- | ------------------------- |
| `common`            | Installed on all machines |
| `work_computer`     | Work machines only        |
| `personal_computer` | Personal machines only    |

## Workflow

Follow these steps in order:

### Step 1: Gather Information

Ask for the following if not already provided:

- **Package name** — exact name as it appears in Homebrew/MAS
- **Package type** — formula, cask, tap, MAS app, or bun package
- **Machine category** — common, work_computer, or personal_computer
- **Optional comment** — brief description for the inline comment

### Step 2: Edit packages.toml

Open the file for editing:

```
~/.local/share/chezmoi/.chezmoidata/packages.toml
```

Add the entry to the correct section. Match the existing formatting exactly — entries use inline comments for descriptions.

#### Homebrew formula example

```toml
[packages.homebrew.common]
formulae = [
    "ripgrep",       # Fancier GREP
    "new-tool",      # Brief description    ← add here
]
```

#### Homebrew cask example

```toml
[packages.homebrew.common]
casks = [
    "zed",           # IDE
    "new-app",       # Brief description    ← add here
]
```

#### Homebrew tap example

```toml
[packages.homebrew.common]
taps = [
    "oven-sh/bun",
    "new-tap/name",                        ← add here
]
```

#### MAS app example

```toml
[packages.mas.common]
apps = [
    "new-app-id",    # App Name            ← add here
]
```

#### Bun package example

```toml
[packages.bun.common]
packages = [
    "new-package",   # Brief description   ← add here
]
```

**Formatting rules:**

- Preserve existing indentation (4 spaces)
- Add inline comment with `#` describing the package
- Keep entries sorted alphabetically within their list where possible
- Add to the correct category section — do not create new sections

### Step 3: Apply Changes

Run chezmoi apply to install the new package:

```bash
chezmoi apply
```

This processes the updated packages.toml template and triggers the relevant install scripts. Since `autoCommit` and `autoPush` are configured, chezmoi will automatically commit and push the changes.

### Step 4: Verify Installation

Confirm the package was installed:

```bash
# For Homebrew formulae
brew list new-tool

# For Homebrew casks
brew list --cask new-app

# For MAS apps
mas list

# For Bun packages
bun pm ls -g
```

## Important Notes

- **Never add duplicates** — check the existing list before adding
- **MAS apps require the app ID** (numeric) — find it with `mas search "App Name"` or on the Mac App Store URL
- **Taps are shared** — add taps to `common` unless truly machine-specific
- **The `to_remove` field** — if a package appears in `to_remove`, it will be uninstalled; do not add to both lists
- **Homebrew casks vs formulae** — casks are GUI applications; formulae are CLI tools. When in doubt, check `brew info <name>` to see which type it is

## Examples

See `examples/adding-bat-formula.md` for a complete walkthrough of adding a Homebrew formula and a MAS app.
