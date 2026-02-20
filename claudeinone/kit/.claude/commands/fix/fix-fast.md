# Fix Fast

## Invocation
`/fix:fast [bug]`

## Purpose
Quickly patch straightforward issues with minimal analysis.

## Agent Routing
- debugger
- fullstack-developer
- tester

## Execution Protocol
1. Identify likely fault location quickly.
2. Implement narrow patch aligned with existing patterns.
3. Run relevant tests/checks.
4. Report what was fixed and what was not investigated.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Root symptom
2. Patch summary
3. Validation run
