# Docs Init

## Invocation
`/docs:init`

## Purpose
Generate baseline documentation set from codebase analysis.

## Agent Routing
- docs-manager
- researcher

## Execution Protocol
1. Scan repo structure and technologies.
2. Produce core docs (overview, standards, architecture, roadmap, deployment).
3. Validate links and internal consistency.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Files generated
2. Coverage summary
3. Gaps needing manual input
