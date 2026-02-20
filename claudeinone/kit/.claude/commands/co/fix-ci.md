# Fix CI

## Invocation
`/fix:ci [workflow-url]`

## Purpose
Diagnose and repair CI pipeline failures.

## Agent Routing
- debugger
- researcher
- devops-engineer
- tester

## Execution Protocol
1. Parse CI logs and classify failure type.
2. Find likely config/code/dependency causes.
3. Apply pipeline or code fixes.
4. Re-run local equivalents where possible.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Failure category
2. Fixes applied
3. Verification status
