# Qogita Notion PRD Template

This is the canonical template structure. Each section has guidance on what to include.

## Template Sections

### Problem

Detailed overview of the problem with supporting evidence. Give stakeholders deep understanding so they can brainstorm without external documents.

### Solution

Overview of the solution with embedded sketches/designs. Living document that evolves during shaping. Once complete, few unknowns should remain. Non-product team members should understand what's being built.

### Estimated Impact

Back-of-envelope calculation for expected impact bandwidth. Be specific — uncover additional factors. Include personas, customer journeys, and success metrics where applicable. Involve Analytics team for data capture and measurement.

**Note:** Only fill this section if the data and calculations are available from the source docs. Otherwise mark as TBD.

### No-gos

Expected boundaries. Items and problems out of scope, rabbit holes, things to not worry about now. More items here = better. Keeps team razor-focused on the problem being solved.

### Open Questions

Questions needing answers. Incorporate answers into relevant sections once resolved.

### Technical Specification

Technical solution implementing the agreed strategy. Enough detail for productive discussion. Break down by areas (Design, Frontend, Backend, DevOps). Include observability, resilience, and performance considerations.

#### Architecture

Diagrams describing overall architecture (optional, use when it adds clarity).

#### API Spec

Changes to APIs. Involve Tribe engineers and relevant stakeholders to validate.

#### Tech Debt

Relevant tech debt introduced with the solution. Make trade-offs clear.

### Testing Strategy

How to test before production release. New test data scenarios, dummy data needs, instructions.

### Release Strategy

How the pitch deploys live. Feature flags, frontend/backend sync requirements. Default to feature flags to decouple deployment from release.
