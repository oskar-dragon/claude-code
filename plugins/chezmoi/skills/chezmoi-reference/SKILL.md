---
name: Chezmoi Reference
description: This skill should be used when the user asks about "chezmoi", "dotfiles management", "chezmoi apply", "chezmoi edit", "chezmoi diff", "chezmoi update", "chezmoi template", "dot_ prefix", "file naming conventions", "run_once_ scripts", "chezmoiscripts", "chezmoidata", "packages.toml", or any chezmoi-related operation. This skill provides comprehensive reference knowledge for managing dotfiles with chezmoi.
version: 0.1.0
---

# Chezmoi Reference

Chezmoi is a dotfile manager that keeps configuration files in a source directory and applies them to the target (home) directory. It supports templates, secrets integration, and cross-machine configuration.

**Source directory**: `~/.local/share/chezmoi` (navigate with `chezmoi cd`)
**Config file**: `~/.config/chezmoi/chezmoi.toml`
**Apply target**: `~` (home directory)

## Core Workflow

The three-location model:
1. **Home directory** — where dotfiles actually live (`~/.zshrc`, `~/.gitconfig`)
2. **Source directory** — chezmoi-managed source (`~/.local/share/chezmoi`)
3. **Remote repository** — git repo for syncing across machines

Typical edit-apply cycle:
```bash
chezmoi edit ~/.zshrc          # Opens source file in editor
chezmoi diff                   # Preview what would change
chezmoi apply                  # Apply changes to home directory
```

## Essential Commands

| Command | Description |
|---------|-------------|
| `chezmoi edit <file>` | Edit source file for a target file |
| `chezmoi edit --apply <file>` | Edit and immediately apply |
| `chezmoi edit --watch <file>` | Edit with auto-apply on save |
| `chezmoi apply` | Apply all pending changes |
| `chezmoi apply -v` | Apply with verbose output |
| `chezmoi diff` | Preview changes before applying |
| `chezmoi update` | Pull from git remote + apply |
| `chezmoi add <file>` | Start tracking a new file |
| `chezmoi cd` | Navigate to source directory |
| `chezmoi status` | Show files that differ |
| `chezmoi re-add` | Sync target changes back to source |
| `chezmoi data` | Show available template variables |

For complete command syntax with all flags and options, see `references/commands.md`.

## File Naming Conventions

Chezmoi uses filename prefixes and suffixes to determine how files are handled:

| Prefix/Suffix | Effect | Example |
|---------------|--------|---------|
| `dot_` | Becomes `.` in target | `dot_zshrc` → `~/.zshrc` |
| `private_` | Sets permissions to 0600 | `private_dot_netrc` |
| `executable_` | Sets permissions to 0755 | `executable_script.sh` |
| `symlink_` | Creates a symbolic link | `symlink_dot_vim` |
| `.tmpl` suffix | Processed as Go template | `dot_gitconfig.tmpl` |
| `readonly_` | Sets file as read-only | `readonly_dot_bashrc` |

Prefixes can be combined: `private_executable_dot_script.sh.tmpl`

## Template System

Templates use Go's `text/template` syntax. Files with `.tmpl` suffix are processed during `chezmoi apply`.

### Key Template Variables

| Variable | Type | Description |
|----------|------|-------------|
| `.chezmoi.os` | string | Operating system (`darwin`, `linux`) |
| `.git_email` | string | Git email address |
| `.git_user` | string | Git username |
| `.work_computer` | bool | True on work machines |
| `.personal_computer` | bool | True on personal machines |
| `.use_secrets` | bool | True when 1Password integration enabled |

### Common Template Patterns

```go
{{- if eq .chezmoi.os "darwin" -}}
# macOS-specific content
{{- end }}

{{ if .work_computer }}
# Work computer only
{{ end }}

{{ range $package := .packages.homebrew.common.formulae }}
"{{ $package }}"
{{ end }}
```

Access all available variables: `chezmoi data`

For complete template reference, see `references/template-system.md`.

## Script Execution Order

Scripts in `.chezmoiscripts/` run in alphabetical order. The naming prefix controls when and how often they run:

| Prefix | Behavior |
|--------|----------|
| `run_before_*` | Runs before applying dotfiles, every time |
| `run_once_before_*` | Runs once before, never again |
| `run_onchange_before_*` | Runs when script content changes, before applying |
| `run_once_after_*` | Runs once after applying |
| `run_onchange_after_*` | Runs when script content changes, after applying |
| `run_after_*` | Runs after applying, every time |

Numeric prefixes control execution order within each category: `run_once_after_10_install.sh` runs before `run_once_after_20_configure.sh`.

To force re-run all scripts:
```bash
chezmoi state delete-bucket --bucket=scriptState && chezmoi apply
```

## Directory Structure

```
~/.local/share/chezmoi/
├── .chezmoi.toml.tmpl          # Config template (generates chezmoi.toml)
├── .chezmoidata/               # TOML data files for templates
│   ├── packages.toml           # Package definitions
│   ├── directories.toml        # Directory path configurations
│   └── onepassword.toml        # 1Password settings
├── .chezmoiscripts/            # Scripts that run during apply
├── .chezmoitemplates/          # Reusable template snippets
│   └── shared_script_utils.bash
├── dot_config/                 # Files for ~/.config/
└── dot_*/                      # Dotfiles for home directory
```

## Package Management

Packages are defined in `.chezmoidata/packages.toml` with categories per machine type.

### Structure Overview

```toml
[packages.homebrew.common]
taps = ["oven-sh/bun"]
formulae = ["git", "ripgrep", "fd"]
casks = ["zed", "ghostty"]

[packages.homebrew.work_computer]
formulae = ["basedpyright", "uv", "ruff"]
casks = ["firefox"]

[packages.homebrew.personal_computer]
casks = ["tailscale", "mullvad-vpn"]

[packages.mas.common]
apps = []

[packages.npm.common]
packages = []
```

Machine categories: `common` (all machines), `work_computer`, `personal_computer`.

For the full add-dependency workflow, see the `add-dependency` skill.

## Shared Script Utilities

Scripts include the `shared_script_utils.bash` template providing common logging functions (`header`, `notice`, `success`, `warning`, `error`, `fatal`, `_safeExit_`). Include it with `{{ template "shared_script_utils.bash" . }}`. For the full function reference, see `references/template-system.md`.

## Configuration Options

Key settings in `~/.config/chezmoi/chezmoi.toml`:

```toml
[data]
git_email = "user@example.com"
work_computer = false
personal_computer = true
use_secrets = true

[edit]
command = "zed"
args = ["--wait"]

[git]
autoCommit = true    # Auto-commit after apply
autoPush = true      # Auto-push (implies autoCommit)
```

## Auto-Commit Configuration

When `autoCommit = true` is set, chezmoi automatically commits changes to the source directory after `chezmoi apply`. When `autoPush = true` is set, it also pushes to the remote.

## Additional Resources

### Reference Files

- **`references/commands.md`** — Complete command reference with all flags and examples
- **`references/template-system.md`** — Full template variable reference, functions, and advanced patterns
