# Workflow Patterns

This document outlines workflow patterns for guiding Claude through complex, multi-step tasks in skills.

## Sequential Workflows

Break tasks into clear, ordered steps where each step must complete before the next begins.

### Structure

```markdown
## Workflow

Follow these steps in order:

1. **[Step Name]**: [Description of what to do]
   - [Specific action or tool to use]
   - [Expected outcome]

2. **[Step Name]**: [Description of what to do]
   - [Specific action or tool to use]
   - [Expected outcome]

3. **[Step Name]**: [Description of what to do]
   - [Specific action or tool to use]
   - [Expected outcome]
```

### Example - PDF Form Filling

```markdown
## Workflow

1. **Analyze the form**: Run `analyze_form.py <pdf_file>` to extract field information
   - Outputs field names, types, and current values
   - Review the structure to understand required fields

2. **Prepare data**: Create a data mapping file (JSON or CSV)
   - Map field names to values
   - Validate data types match form expectations

3. **Fill the form**: Run `fill_form.py <pdf_file> <data_file> <output_file>`
   - Script populates all fields from data mapping
   - Outputs new PDF with filled fields

4. **Verify output**: Run `verify_output.py <output_file>`
   - Checks all required fields are populated
   - Validates no data corruption occurred

5. **Review**: Open the output PDF and visually confirm results
   - Check formatting and alignment
   - Ensure all data is correct
```

**When to use:**
- Linear processes with dependencies
- Each step produces artifacts needed by the next
- Clear start and end states

## Conditional Workflows

Incorporate branching logic with decision points based on context or user input.

### Structure

```markdown
## Workflow Decision Tree

**First, determine the task type:**

### If [Condition A]:
1. [Step 1 for Condition A]
2. [Step 2 for Condition A]
3. [Step 3 for Condition A]

### If [Condition B]:
1. [Step 1 for Condition B]
2. [Step 2 for Condition B]
3. [Step 3 for Condition B]
```

### Example - Content Modification

```markdown
## Workflow Decision Tree

**First, ask the user:** Are you creating new content or editing existing content?

### If Creating New Content:
1. **Gather requirements**: Ask about content type, audience, and goals
2. **Generate outline**: Create structure based on requirements
3. **Write content**: Produce full content following the outline
4. **Review and refine**: Iterate based on feedback

### If Editing Existing Content:
1. **Read existing content**: Load and analyze the current version
2. **Identify changes needed**: Understand what modifications are required
3. **Apply edits**: Make targeted changes to existing content
4. **Verify consistency**: Ensure edits maintain overall coherence
```

**When to use:**
- Multiple valid approaches to a problem
- User choice affects the workflow
- Different contexts require different processes

## Hybrid Workflows

Combine sequential and conditional patterns for complex, multi-phase processes.

### Example - Document Processing

```markdown
## Workflow

### Phase 1: Initial Setup (Sequential)
1. Load document
2. Extract metadata
3. Validate document format

### Phase 2: Processing (Conditional)

**If document type is invoice:**
- Extract line items
- Calculate totals
- Validate against PO

**If document type is contract:**
- Extract key terms
- Identify parties
- Highlight critical dates

### Phase 3: Finalization (Sequential)
1. Generate summary report
2. Save processed data
3. Archive original document
```

## Best Practices

### Provide Context Upfront

Always show the complete workflow overview before diving into details. This helps Claude understand the full scope and plan accordingly.

**Good:**
```markdown
This workflow has 4 main phases: Setup → Processing → Validation → Export.
We'll walk through each phase step by step.
```

**Bad:**
```markdown
First, do step 1. [No mention of what comes next or why]
```

### Make Dependencies Explicit

Clearly state when one step requires output from a previous step.

**Good:**
```markdown
2. **Process data**: Using the field names extracted in step 1, map values...
```

**Bad:**
```markdown
2. **Process data**: Map values to fields
```

### Include Success Criteria

Define what "done" looks like for each step.

**Good:**
```markdown
3. **Validate output**: Run validation script
   - Expected: All required fields populated, exit code 0
   - If validation fails: Review errors and repeat step 2
```

## Choosing the Right Pattern

- **Sequential**: Use when steps have clear dependencies and must happen in order
- **Conditional**: Use when different contexts require different approaches
- **Hybrid**: Use for complex processes with both fixed sequences and branching logic

## Key Principle

**Provide Claude with an upfront process overview** to improve task execution clarity and organization. The clearer the workflow, the better Claude can plan and execute.
