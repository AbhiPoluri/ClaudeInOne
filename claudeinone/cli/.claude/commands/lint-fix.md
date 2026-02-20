# Lint Fix

## Invocation
`/lint:fix`

## Purpose
Run formatter/linter auto-fixes and report residual issues.

## Agent Routing
- fullstack-developer

## Execution Protocol
1. Detect lint/format tooling.
2. Run auto-fix commands.
3. Re-run checks and summarize remaining errors.

## Validation
- Confirm scope and constraints before making changes.
- Run relevant checks for each touched surface.
- Report unresolved risks or skipped validations.

## Output Format
1. Fixes applied
2. Remaining lint issues
