# Plan Validate

## Invocation
`/plan:validate`

## Purpose
Assess an existing plan for feasibility and missing pieces.

## Agent Routing
- planner
- risk-analyst
- tester

## Execution Protocol
1. Read target plan artifact.
2. Check completeness, dependencies, and verification steps.
3. Return pass/fail with concrete fixes.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Validation result
2. Missing sections
3. Recommended edits
