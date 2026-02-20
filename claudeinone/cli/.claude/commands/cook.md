# Cook Feature

## Invocation
`/cook [feature]`

## Purpose
Structured delivery pipeline for a feature from plan to docs.

## Agent Routing
- planner
- scout
- fullstack-developer
- tester
- code-reviewer

## Execution Protocol
1. Reuse existing plan if available, otherwise plan quickly.
2. Locate integration points.
3. Implement feature + error handling.
4. Add/adjust tests.
5. Review security/perf/quality.
6. Update docs and summarize.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Implementation summary
2. Test + review findings
3. Docs updated
4. Follow-up tasks
