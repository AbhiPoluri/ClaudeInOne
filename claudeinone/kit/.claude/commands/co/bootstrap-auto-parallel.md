# Bootstrap Auto Parallel

## Invocation
`/bootstrap:auto:parallel [desc]`

## Purpose
Autonomous bootstrap with parallelized sub-workstreams.

## Agent Routing
- planner
- fullstack-developer
- tester
- code-reviewer

## Execution Protocol
1. Split work into independent tracks (foundation, feature, validation).
2. Execute tracks in parallel where safe.
3. Reconcile integration boundaries.
4. Run final validation pass.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Parallel task breakdown
2. Integrated result
3. Final quality status
