---
version: "0.1.0"
author: "oskar-dragon"
allowed-tools: Bash(sh:*), Bash(curl:*)
description: Show the command to install chezmoi and apply dotfiles on a new machine
---

## Your task

Display the chezmoi installation command for setting up dotfiles on a new machine.

Show the following to the user:

```bash
sh -c "$(curl -fsLS get.chezmoi.io)" -- init --apply oskar-dragon
```

Explain that this command:
- Downloads and installs chezmoi
- Clones the dotfiles repository from GitHub (`github.com/oskar-dragon/dotfiles`)
- Applies all dotfiles and runs all setup scripts in one step

Also mention that this requires:
- `curl` to be available
- Internet access
- The user to be logged in (for 1Password integration to work during script execution)

Do not run the command — only display it for the user to run manually on the new machine.
