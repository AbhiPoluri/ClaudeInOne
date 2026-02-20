# Docs Update

## Invocation
`/docs:update [requests]`

## Purpose
Synchronize documentation with recent code changes.

## Agent Routing
- docs-manager

## Execution Protocol
1. Diff code changes since last doc update.
2. Patch outdated sections.
3. Validate examples and commands.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Updated docs list
2. Sections changed
3. Remaining stale areas
