# Documentation Plugin

A structured documentation workflow based on the [Diataxis framework](https://diataxis.fr/) for creating learning-oriented tutorials, task-oriented how-to guides, understanding-oriented explanations, and information-oriented reference documentation.

## Overview

The Documentation Plugin provides a systematic approach to creating wtechnical documentation. Instead of writing docs in an ad-hoc manner, it guides you through the Diataxis framework—ensuring your documentation serves its intended purpose and meets your users' needs.

## Commands

### `/doc:tutorial`

Creates learning-oriented tutorials designed to help beginners accomplish their first success.

**Usage:**

```bash
/doc:tutorial Getting started with authentication
```

**Output:** A complete tutorial with:

- Clear learning objectives
- Step-by-step instructions with expected results
- Checkpoints to verify progress
- Working example from start to finish
- Next steps for continued learning

### `/doc:howto`

Creates task-oriented how-to guides for accomplishing specific goals.

**Usage:**

```bash
/doc:howto Configure JWT authentication
```

**Output:** A practical guide with:

- Clear goal statement
- Prerequisites listed upfront
- Direct, action-focused steps
- Troubleshooting common issues
- Success criteria

### `/doc:explain`

Creates understanding-oriented explanations of concepts, design decisions, and architecture.

**Usage:**

```bash
/doc:explain Why we use JWT for authentication
```

**Output:** A conceptual explanation with:

- Background and context
- Key concepts defined
- Design rationale
- Trade-offs discussed
- Connections to related topics

### `/doc:reference`

Creates information-oriented reference documentation for APIs, configurations, and technical specifications.

**Usage:**

```bash
/doc:reference Authentication API endpoints
```

**Output:** A technical reference with:

- Complete API/feature coverage
- Parameter descriptions
- Return values and types
- Code examples
- Error codes and handling

## The Diataxis Framework

The plugin implements all four quadrants of the Diataxis framework:

### Tutorials (Learning-Oriented)

**Purpose:** Help beginners achieve their first success

**Characteristics:**

- Step-by-step instructions
- Reproducible results
- Concrete examples
- Safe learning environment
- Clear success criteria

**When to use:**

- Onboarding new users
- Teaching fundamental concepts
- First-time setup experiences

**Example structure:**

```markdown
# Tutorial: Build Your First Feature

**What you'll learn:** [Clear objectives]
**Time required:** 25 minutes
**Prerequisites:** [What you need]

## Step 1: [First Action]

[Detailed instructions]
**Expected result:** [What should happen]
**Checkpoint:** [How to verify]

## Step 2: [Next Action]

...

## What You've Accomplished

[Summary of learning]

## Next Steps

[Where to go from here]
```

### How-To Guides (Task-Oriented)

**Purpose:** Help practitioners accomplish specific tasks

**Characteristics:**

- Goal-focused instructions
- Assumes basic knowledge
- Direct, efficient steps
- Multiple valid approaches
- Troubleshooting included

**When to use:**

- Solving specific problems
- Configuration tasks
- Common workflows
- Integration guides

**Example structure:**

```markdown
# How-To: Configure Authentication

**Goal:** Set up JWT authentication for your API
**Prerequisites:** [Required knowledge/tools]

## Steps

1. Install dependencies
2. Configure environment
3. Implement middleware
4. Test authentication

## Troubleshooting

### Problem: Token validation fails

**Solution:** [Specific fix]

## Verification

[How to confirm success]
```

### Explanations (Understanding-Oriented)

**Purpose:** Clarify concepts and provide context

**Characteristics:**

- Discussion of alternatives
- Historical context
- Design rationale
- Trade-off analysis
- Conceptual depth

**When to use:**

- Explaining architecture decisions
- Discussing design patterns
- Providing background knowledge
- Comparing approaches

**Example structure:**

```markdown
# Explanation: Authentication Architecture

## Background

[Why this topic matters]

## Key Concepts

[Fundamental ideas]

## Design Decisions

[Why we chose this approach]

## Trade-Offs

[Pros and cons]

## Alternatives Considered

[Other options and why we didn't choose them]

## Related Topics

[Connections to other concepts]
```

### Reference (Information-Oriented)

**Purpose:** Provide technical specifications and API details

**Characteristics:**

- Comprehensive coverage
- Accurate, up-to-date
- Consistent structure
- Searchable format
- Example code

**When to use:**

- API documentation
- Configuration options
- CLI command reference
- Data schemas

**Example structure:**

````markdown
# API Reference: Authentication Endpoints

## POST /auth/login

Authenticates a user and returns a JWT token.

**Parameters:**

- `email` (string, required): User email
- `password` (string, required): User password

**Returns:**

- `200 OK`: Authentication successful
  ```json
  {
    "token": "eyJhbGc...",
    "expiresIn": 3600
  }
  ```
````

- `401 Unauthorized`: Invalid credentials

**Example:**

```bash
curl -X POST /auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'
```

## Agents

### `tutorial-writer`

**Purpose:** Creates beginner-friendly, step-by-step tutorials

**Focus areas:**

- Clear learning objectives
- Safe, reproducible steps
- Expected results at each stage
- Checkpoints for verification
- Encouraging tone for beginners

**When triggered:**

- Automatically when using `/doc:tutorial`
- Can be invoked manually for tutorial creation

**Output:**

- Complete tutorial with prerequisites
- Step-by-step instructions with verification
- Troubleshooting common beginner issues
- Clear success criteria
- Next steps for continued learning

### `technical-writer`

**Purpose:** Creates clear, task-focused how-to guides

**Focus areas:**

- Goal-oriented instructions
- Efficient, direct steps
- Practical examples
- Common pitfalls
- Success verification

**When triggered:**

- Automatically when using `/doc:howto`
- Can be invoked manually for procedural docs

**Output:**

- Clear goal statement
- Prerequisites listed
- Step-by-step instructions
- Troubleshooting section
- Verification steps

### `concept-explainer`

**Purpose:** Creates deep conceptual explanations

**Focus areas:**

- Background and context
- Design rationale
- Trade-off analysis
- Alternative approaches
- Connections to broader concepts

**When triggered:**

- Automatically when using `/doc:explain`
- Can be invoked manually for explanatory docs

**Output:**

- Conceptual overview
- Key ideas explained
- Design decisions documented
- Trade-offs discussed
- Related topics linked

### `api-documenter`

**Purpose:** Generates comprehensive technical reference documentation

**Focus areas:**

- Complete API coverage
- Accurate parameter descriptions
- Return values and types
- Error codes and handling
- Code examples

**When triggered:**

- Automatically when using `/doc:reference`
- Can be invoked manually for API docs

**Output:**

- Structured API documentation
- Complete parameter listings
- Response schemas
- Example requests/responses
- Error reference

### `documentation-reviewer`

**Purpose:** Reviews documentation for clarity, accuracy, and completeness

**Focus areas:**

- Diataxis framework compliance
- Technical accuracy
- Clarity and readability
- Consistent tone and style
- Completeness

**When triggered:**

- After documentation generation
- Can be invoked manually for quality checks

**Output:**

- Framework compliance report
- Clarity issues identified
- Missing information flagged
- Style consistency check
- Improvement suggestions

## Usage Patterns

### Create complete documentation set

```bash
# Start with a tutorial for beginners
/doc:tutorial Getting started with your API

# Add how-to guides for common tasks
/doc:howto Configure authentication
/doc:howto Deploy to production

# Explain key concepts
/doc:explain API architecture decisions
/doc:explain Rate limiting strategy

# Provide technical reference
/doc:reference API endpoints
/doc:reference Configuration options
```

### Update existing documentation

```bash
# Review and improve existing tutorial
/doc:tutorial Improve "Getting Started" guide

# Add missing how-to guide
/doc:howto Add guide for database migrations
```

### Create documentation from code

```bash
# Generate API reference from code
/doc:reference Generate API docs from /src/api

# Create explanation from architecture
/doc:explain Explain the authentication system in /src/auth
```

## Best Practices

1. **Know your audience**: Match documentation type to user needs
   - Beginners need tutorials
   - Practitioners need how-to guides
   - Architects need explanations
   - Developers need reference

2. **One type per document**: Don't mix tutorials with reference docs
   - Keep tutorials focused on learning
   - Keep how-tos focused on tasks
   - Keep explanations focused on understanding
   - Keep references focused on information

3. **Use consistent structure**: Follow Diataxis patterns
   - Tutorials: steps with expected results
   - How-tos: goal → prerequisites → steps → troubleshooting
   - Explanations: context → concepts → rationale → trade-offs
   - Reference: specification → parameters → examples → errors

4. **Maintain documentation**: Keep docs in sync with code
   - Update reference docs when APIs change
   - Revise tutorials when UX changes
   - Refresh explanations when architecture evolves

5. **Test your documentation**: Verify instructions work
   - Follow tutorial steps yourself
   - Test how-to guides on fresh environments
   - Validate reference examples
   - Check links and code samples

6. **Link between types**: Create a documentation web
   - Tutorials link to related how-tos
   - How-tos reference API documentation
   - Explanations connect to tutorials
   - References link to explanatory docs

## When to Use This Plugin

**Use for:**

- Creating comprehensive documentation sets
- Onboarding new users with tutorials
- Providing task-focused guides for common workflows
- Explaining architecture and design decisions
- Maintaining API and technical references
- Standardizing documentation across projects

**Don't use for:**

- Quick inline code comments (use regular commenting)
- One-off notes or reminders
- Temporary documentation

## Requirements

- Claude Code installed
- Project with code to document
- Existing code or features to document

## Troubleshooting

### Documentation is too technical for beginners

**Issue:** Tutorial assumes too much knowledge

**Solution:**

- Use `/doc:tutorial` specifically for beginners
- Explicitly state prerequisites
- Define all terms on first use
- Include more verification steps
- Ask the agent to "write for complete beginners"

### How-to guide feels like a tutorial

**Issue:** Too much explanation, not enough action

**Solution:**

- Focus on the specific task/goal
- Remove background information (save for explanations)
- Make steps more direct
- Assume prerequisite knowledge
- Link to tutorials for foundational concepts

### Reference documentation lacks examples

**Issue:** API docs are too dry

**Solution:**

- Request "include practical examples" in your command
- Use `/doc:howto` for usage examples
- Link reference to how-to guides
- Ask for "common use cases" section

### Documentation doesn't match code

**Issue:** Docs are out of date

**Solution:**

```bash
# Regenerate reference from current code
/doc:reference Update API documentation from /src/api

# Use documentation-reviewer to check accuracy
"Review /docs/api.md against current code in /src/api"
```

### Too much duplication across docs

**Issue:** Same information repeated everywhere

**Solution:**

- Use Diataxis framework to separate concerns
- Tutorials: teach by example
- How-tos: task-focused instructions
- Explanations: deep concepts
- Reference: pure information
- Link between docs instead of duplicating

### Tone is inconsistent

**Issue:** Some docs formal, others casual

**Solution:**

- Define tone in project CLAUDE.md
- Use documentation-reviewer for consistency checks
- Specify tone in commands: "professional tone" or "friendly beginner tone"

## Tips

- **Start with tutorials** for new projects—help users achieve early success
- **Add how-tos** as users ask "how do I...?" questions
- **Write explanations** when people ask "why?" or "what's the difference?"
- **Maintain references** as your primary source of truth for APIs
- **Use the right tool** for the job—don't force everything into one type
- **Review with documentation-reviewer** before publishing
- **Update regularly** when code changes
- **Test with real users** to verify effectiveness
- **Link liberally** between related documentation
- **Keep it current** by regenerating docs from code when possible
