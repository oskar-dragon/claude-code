# Chezmoi Plugin

Claude Code plugin for managing chezmoi dotfiles — provides reference knowledge and dependency management workflows.

## Features

- **Chezmoi Reference Skill** — auto-activates when working with chezmoi, giving Claude deep knowledge of commands, file naming conventions, template system, and package management
- **Add Dependency Skill + Command** — guided workflow for adding new packages (Homebrew formulae/casks/taps, MAS apps, npm packages) to `packages.toml` and applying them
- **Install Command** — shows the one-liner to set up dotfiles on a new machine

## Commands

| Command                             | Description                                             |
| ----------------------------------- | ------------------------------------------------------- |
| `/chezmoi:add-dependency [package]` | Add a new package to chezmoi's packages.toml            |
| `/chezmoi:install`                  | Show the chezmoi installation command for a new machine |

## Skills

| Skill               | Triggers                                                                       |
| ------------------- | ------------------------------------------------------------------------------ |
| `chezmoi-reference` | Automatically when working with chezmoi, dotfiles, templates, or packages.toml |
| `add-dependency`    | Via `/chezmoi:add-dependency` command or when asked to add a package           |

## Usage

### Add a new Homebrew formula

```
/chezmoi:add-dependency ripgrep
```

Claude will ask which machine category (common/work/personal), edit `packages.toml`, run `chezmoi apply`, and verify installation.

### Set up a new machine

```
/chezmoi:install
```

Displays the one-liner installation command.

## Prerequisites

- [chezmoi](https://chezmoi.io) installed (`brew install chezmoi`)
- Dotfiles repository: `github.com/oskar-dragon/dotfiles`
- `autoCommit` and `autoPush` enabled in `~/.config/chezmoi/chezmoi.toml`
