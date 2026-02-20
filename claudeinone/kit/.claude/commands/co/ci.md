# CI

## Invocation
`/ci`

## Purpose
Create or repair CI workflow for build, test, and quality checks.

## Agent Routing
- devops-engineer
- tester

## Execution Protocol
1. Detect runtime/toolchain.
2. Generate/update CI config.
3. Add cache and quality gates.
4. Validate workflow syntax.

## Validation
- Confirm scope and constraints before making changes.
- Run relevant checks for each touched surface.
- Report unresolved risks or skipped validations.

## Output Format
1. CI config changes
2. Trigger/verification steps
