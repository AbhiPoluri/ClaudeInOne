# Bootstrap Auto

## Invocation
`/bootstrap:auto [desc]`

## Purpose
Autonomous bootstrap flow with no clarification loop.

## Agent Routing
- planner
- researcher
- fullstack-developer
- tester

## Execution Protocol
1. Infer assumptions from prompt and state them briefly.
2. Plan and execute without waiting for review.
3. Implement with sensible defaults.
4. Validate and summarize decisions made automatically.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Assumptions made
2. Implemented architecture/features
3. Validation results
4. Follow-up recommendations
