# Scout Codebase

## Invocation
`/scout [prompt] [scale]`

## Purpose
Parallel codebase reconnaissance to locate implementation targets quickly.

## Agent Routing
- scout

## Execution Protocol
1. Partition search space by module/feature.
2. Run parallel searches.
3. Aggregate findings with confidence ranking.
4. Save report under plans/scouts/.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Relevant files list
2. Integration points
3. Unknowns requiring deeper inspection
