# SpecKit Plugin for Claude Code

**Spec-Driven Development (SDD) toolkit** - Create specifications that generate implementations.

## Overview

SpecKit brings the Spec-Driven Development methodology to Claude Code, enabling a structured workflow where specifications become the source of truth that drives implementation. Instead of code being king, specifications define what to build, and implementation follows.

## Features

- **10 slash commands** for the complete SDD workflow
- **Structured templates** for specs, plans, tasks, and checklists
- **Automation scripts** for feature management and git integration
- **Constitutional enforcement** with architectural principles
- **Test-driven development** baked into the process
- **Quality validation** with automated checklists

## Installation

```bash
/plugin install speckit@claude-code
```

## Quick Start

### 1. Initialize SpecKit in Your Repository

```bash
/speckit:setup
```

This creates the `.specify/` directory structure with all templates and scripts.

### 2. Create Project Constitution

```bash
/speckit:constitution Create principles focused on code quality, testing standards, and performance requirements
```

### 3. Create Feature Specification

```bash
/speckit:specify Build a user authentication system with email/password login
```

### 4. Clarify Requirements (Optional)

```bash
/speckit:clarify
```

### 5. Create Technical Plan

```bash
/speckit:plan Using Node.js with Express, PostgreSQL database, and JWT authentication
```

### 6. Generate Task Breakdown

```bash
/speckit:tasks
```

### 7. Implement Feature

```bash
/speckit:implement
```

### 8. Validate Quality (Optional)

```bash
/speckit:analyze
/speckit:checklist
```

## Available Commands

| Command                  | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| `/speckit:setup`         | Initialize SpecKit directory structure and templates |
| `/speckit:constitution`  | Create or update project governing principles        |
| `/speckit:specify`       | Create feature specification from natural language   |
| `/speckit:clarify`       | Structured clarification workflow for requirements   |
| `/speckit:plan`          | Generate technical implementation plan               |
| `/speckit:tasks`         | Create executable task breakdown                     |
| `/speckit:implement`     | Execute tasks with progress tracking                 |
| `/speckit:analyze`       | Cross-artifact consistency analysis                  |
| `/speckit:checklist`     | Generate custom quality validation checklists        |
| `/speckit:taskstoissues` | Convert tasks to GitHub issues                       |

## Workflow

The SpecKit workflow follows a structured progression:

```
Constitution → Specify → Clarify → Plan → Tasks → Implement → Validate
```

1. **Constitution**: Establish immutable project principles
2. **Specify**: Define WHAT and WHY (not HOW)
3. **Clarify**: Resolve ambiguities through structured Q&A
4. **Plan**: Create technical implementation with tech stack choices
5. **Tasks**: Break down into executable, testable tasks
6. **Implement**: Execute task-by-task with progress tracking
7. **Validate**: Ensure quality and consistency

## Directory Structure

After running `/speckit:setup`, your repository will have:

```
.specify/
├── memory/
│   └── constitution.md       # Project principles
├── specs/
│   └── 001-feature-name/     # Feature specifications
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       └── checklists/
├── scripts/
│   └── bash/                 # Automation scripts
└── templates/                # Spec, plan, task templates
```

## Core Principles

### Specifications as Source of Truth

Code serves specifications, not the other way around. Specifications are precise, complete, and executable.

### Test-First Development

Tests define behavior before implementation. Every feature starts with contract and integration tests.

### Constitutional Enforcement

Architectural principles (simplicity, anti-abstraction, integration-first testing) enforce quality through phase gates.

### Iterative Refinement

Continuous validation catches ambiguity, contradictions, and gaps as an ongoing process.

## Requirements

- **Git**: For branch management and version control
- **Bash**: For automation scripts
- **jq**: For JSON parsing (optional but recommended)
- **GitHub CLI** (gh): For `/speckit:taskstoissues` command (optional)

## Examples

### Creating a New Feature

```bash
# 1. Create specification
/speckit:specify Build a real-time chat feature with WebSocket support and message history

# 2. Clarify if needed
/speckit:clarify

# 3. Create technical plan
/speckit:plan Using Socket.io for WebSocket, MongoDB for message storage, Redis for presence

# 4. Generate and execute tasks
/speckit:tasks
/speckit:implement
```

### Updating Project Principles

```bash
/speckit:constitution Add principle about API versioning and backwards compatibility
```

### Validating Feature Quality

```bash
/speckit:analyze
/speckit:checklist
```

## Philosophy

SpecKit embodies **Spec-Driven Development** principles:

- **Intent-driven**: Specifications define intent before implementation
- **Technology-agnostic**: Specs describe WHAT, not HOW
- **Multi-step refinement**: Not one-shot generation
- **Constitutional governance**: Immutable principles guide decisions
- **Living documentation**: Specs evolve with implementation

## Troubleshooting

**Setup fails with "not a git repository"**: SpecKit works with or without git. If in a git repo, it will find the root automatically.

**Templates not found**: Ensure you've run `/speckit:setup` to initialize the directory structure.

**Scripts fail with permission errors**: Make sure scripts in `.specify/scripts/bash/` are executable (`chmod +x`).

**Feature numbering conflicts**: Feature numbers are determined by scanning `.specify/specs/` directories. Delete or rename conflicting directories.
