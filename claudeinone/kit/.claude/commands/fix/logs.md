# Fix Logs

## Invocation
`/fix:logs [issue]`

## Purpose
Use log analysis to identify and fix runtime failures.

## Agent Routing
- debugger
- fullstack-developer
- tester

## Execution Protocol
1. Correlate log events around failure window.
2. Identify recurring signatures.
3. Implement remediation.
4. Re-check log behavior post-fix.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Log-derived root cause
2. Fixes
3. Confirmation evidence
