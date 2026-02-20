# Session Journal

## Invocation
`/journal`

## Purpose
Create a timestamped engineering session log.

## Agent Routing
- journal-writer

## Execution Protocol
1. Collect git diffs, tests, docs, and command history.
2. Summarize decisions and rationale.
3. Record failures, fixes, and lessons.
4. Save to journals/session-YYYY-MM-DD.md.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Session narrative
2. Decision log
3. Risks/limitations
4. Next priorities
