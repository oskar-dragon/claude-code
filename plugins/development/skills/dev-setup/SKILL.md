---
description: One-time developer setup after installing the development plugin. Shows manual steps required to complete the installation.
disable-model-invocation: true
---

Complete these steps after installing the `development` plugin:

**1. Add the official Anthropic marketplace** (skip if already added):
```
/plugin marketplace add <anthropic-official-repo>
```
> ⚠️ Verify the exact repo path for claude-plugins-official in the Claude Code docs or run `/plugin marketplace list` to check if it's already registered.

**2. Install superpowers:**
```
/plugin install superpowers@claude-plugins-official
```

**3. Verify everything is installed:**
```
/plugin list
```

Once superpowers is installed, all development skills have access to the full superpowers workflow (TDD, brainstorming, debugging, etc.).
