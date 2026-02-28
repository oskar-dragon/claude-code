# Chezmoi Command Reference

## File Editing

### `chezmoi edit`
Edit the source file corresponding to a target file.

```bash
chezmoi edit ~/.zshrc                   # Open source file in editor
chezmoi edit --apply ~/.zshrc           # Edit and apply immediately after closing
chezmoi edit --watch ~/.zshrc           # Auto-apply on every save
chezmoi edit-config                     # Edit chezmoi config file (~/.config/chezmoi/chezmoi.toml)
```

**Editor**: Configured via `[edit] command` in chezmoi.toml. Defaults to `$VISUAL` or `$EDITOR`.
**Note**: Never manually edit files in `~/.local/share/chezmoi` — always use `chezmoi edit`.

---

## Applying Changes

### `chezmoi apply`
Apply the source state to the target directory (home directory).

```bash
chezmoi apply                           # Apply all pending changes
chezmoi apply -v                        # Verbose output
chezmoi apply ~/.zshrc                  # Apply specific file only
chezmoi apply -n                        # Dry run (show what would happen)
chezmoi apply --force                   # Apply even if target modified externally
```

### `chezmoi diff`
Show what would change if `chezmoi apply` were run.

```bash
chezmoi diff                            # Show all pending diffs
chezmoi diff ~/.zshrc                   # Diff specific file
chezmoi diff --reverse                  # Show reverse diff (target → source)
```

---

## Syncing with Remote

### `chezmoi update`
Pull latest changes from the remote git repository and apply them.

```bash
chezmoi update                          # Pull + apply
chezmoi update -v                       # Verbose
chezmoi update --apply=false            # Pull only, don't apply
```

Equivalent to: `chezmoi git pull -- --autostash --rebase && chezmoi apply`

### `chezmoi git`
Run git commands inside the source directory.

```bash
chezmoi git status
chezmoi git -- log --oneline -10
chezmoi git -- add .chezmoidata/packages.toml
chezmoi git -- commit -m "Add ripgrep formula"
chezmoi git -- push
```

---

## Adding Files

### `chezmoi add`
Start tracking a new file or directory.

```bash
chezmoi add ~/.config/tool/config       # Add file to source
chezmoi add --template ~/.gitconfig     # Add as template
chezmoi add -r ~/.config/tool/          # Add directory recursively
chezmoi add --encrypt ~/.ssh/config     # Add encrypted file
```

### `chezmoi re-add`
Sync changes made directly to target files back to source.

```bash
chezmoi re-add                          # Re-add all modified targets
chezmoi re-add ~/.zshrc                 # Re-add specific file
```

---

## Status & Inspection

### `chezmoi status`
Show files that differ between source and target.

```bash
chezmoi status                          # List all differing files
```

Output codes: `A` (added), `D` (deleted), `M` (modified), `R` (run)

### `chezmoi data`
Show all template variables available in templates.

```bash
chezmoi data                            # Show all data as JSON
chezmoi data | jq '.chezmoi.os'        # Extract specific value
```

### `chezmoi source-path`
Show the source path for a target file.

```bash
chezmoi source-path ~/.zshrc           # Shows source file location
```

### `chezmoi managed`
List all managed files.

```bash
chezmoi managed                         # List managed files
chezmoi managed --include=templates     # List only templates
```

### `chezmoi cat`
Print the target contents of a managed file (after template processing).

```bash
chezmoi cat ~/.gitconfig               # Show processed output
```

---

## Template Debugging

### `chezmoi execute-template`
Test template expressions without applying.

```bash
chezmoi execute-template '{{ .chezmoi.os }}'
chezmoi execute-template '{{ if .work_computer }}work{{ else }}personal{{ end }}'
chezmoi execute-template --init --promptString 'email=test@example.com' < ~/.local/share/chezmoi/.chezmoi.toml.tmpl
```

---

## Navigation

### `chezmoi cd`
Open a shell in the source directory.

```bash
chezmoi cd                              # Open shell in source dir
```

Source dir: `~/.local/share/chezmoi`

---

## Script State Management

### `chezmoi state`
Manage chezmoi's persistent state.

```bash
# Force all run_onchange_ and run_once_ scripts to re-run
chezmoi state delete-bucket --bucket=scriptState && chezmoi apply
```

---

## Installation

### New machine setup

```bash
# Install chezmoi and apply dotfiles in one command
sh -c "$(curl -fsLS get.chezmoi.io)" -- init --apply oskar-dragon

# One-shot mode (removes chezmoi and source dir after apply)
sh -c "$(curl -fsLS get.chezmoi.io)" -- init --one-shot oskar-dragon
```

### Initialization (existing chezmoi install)

```bash
chezmoi init oskar-dragon              # Clone repo from GitHub
chezmoi init --apply oskar-dragon      # Clone and apply immediately
```

---

## Diagnostics

### `chezmoi doctor`
Check for common configuration issues.

```bash
chezmoi doctor
```

### `chezmoi verify`
Verify that the target state matches the source state.

```bash
chezmoi verify
```

---

## Common Workflows

### Editing and applying a dotfile

```bash
chezmoi edit ~/.zshrc
chezmoi diff
chezmoi apply
chezmoi cd && git add . && git commit -m "Update zsh config" && git push
```

### Adding a new dotfile

```bash
chezmoi add ~/.config/newapp/config
chezmoi cd && git add . && git commit -m "Add newapp config" && git push
```

### Syncing from another machine

```bash
chezmoi update                          # Pull remote + apply
```

### Checking what would change after a pull

```bash
chezmoi git pull -- --autostash --rebase && chezmoi diff
```
