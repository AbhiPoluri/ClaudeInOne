# Debug Diagnosis

## Invocation
`/debug [issues]`

## Purpose
Root-cause diagnosis only; no code modifications by default.

## Agent Routing
- debugger

## Execution Protocol
1. Reconstruct failure timeline from logs/stack traces/repro steps.
2. Identify root cause and impacted components.
3. Distinguish primary causes from symptoms.
4. Propose ranked fix strategies.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Root-cause report
2. Evidence with file references
3. Recommended fix options
