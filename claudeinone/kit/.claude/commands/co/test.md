# Run Tests

## Invocation
`/test`

## Purpose
Run project tests and evaluate quality gates.

## Agent Routing
- tester

## Execution Protocol
1. Detect test runners.
2. Execute targeted tests then full suite as needed.
3. Analyze failures and coverage.
4. Provide actionable fix guidance.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Pass/fail summary
2. Failing tests with causes
3. Coverage notes
