# Example: Adding `bat` as a Common Homebrew Formula

This shows a complete run of the add-dependency workflow.

## Input

User: "Add bat to my chezmoi setup"

## Step 1: Gather Information

- **Package name**: `bat`
- **Package type**: Homebrew formula (CLI tool)
- **Machine category**: `common` (useful on all machines)
- **Comment**: Fast cat replacement

## Step 2: Edit packages.toml

File: `~/.local/share/chezmoi/.chezmoidata/packages.toml`

**Before:**
```toml
[packages.homebrew.common]
formulae = [
    "atuin",         # Better shell history
    "chezmoi",       # Dotfile manager
    ...
]
```

**After:**
```toml
[packages.homebrew.common]
formulae = [
    "atuin",         # Better shell history
    "bat",           # Fast cat replacement    ← added
    "chezmoi",       # Dotfile manager
    ...
]
```

## Step 3: Apply

```bash
chezmoi apply
```

Output: chezmoi processes the updated packages.toml, triggers the Homebrew install script, which runs `brew install bat`. Since `autoCommit` and `autoPush` are enabled, chezmoi also commits and pushes the change automatically.

## Step 4: Verify

```bash
brew list bat
# → bat
bat --version
# → bat 0.24.0
```

---

# Example: Adding a MAS App

## Input

User: "Add Amphetamine to my MAS apps"

## Step 1: Find the App ID

```bash
mas search "Amphetamine"
# → 937984704  Amphetamine
```

## Step 2: Edit packages.toml

```toml
[packages.mas.common]
apps = [
    "937984704",     # Amphetamine
]
```

## Step 3: Apply

```bash
chezmoi apply
```

## Step 4: Verify

```bash
mas list | grep Amphetamine
# → 937984704  Amphetamine  5.3.3
```
