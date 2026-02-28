---
version: "0.1.0"
author: "oskar-dragon"
allowed-tools: Read(*), Edit(*), Bash(chezmoi:*), Bash(brew:*), Bash(bun:*)
description: Add a new dependency to chezmoi's packages.toml and apply it
argument-hint: "[package-name]"
---

## Your task

Invoke the `add-dependency` chezmoi skill to guide the user through adding a new package to their chezmoi-managed dotfiles setup.

If a package name was provided as an argument, use it: `$ARGUMENTS`

Follow the skill's workflow exactly:
1. Determine the package name, type (formula/cask/tap/MAS/npm), and machine category (common/work_computer/personal_computer) — ask if not provided
2. Edit `~/.local/share/chezmoi/.chezmoidata/packages.toml`, adding the entry to the correct section with a descriptive inline comment
3. Run `chezmoi apply` to install the package
4. Verify the package installed successfully
