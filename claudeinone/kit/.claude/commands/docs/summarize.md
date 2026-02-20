# Docs Summarize

## Invocation
`/docs:summarize`

## Purpose
Produce concise codebase summary for context refresh.

## Agent Routing
- docs-manager
- scout

## Execution Protocol
1. Build module map and key file inventory.
2. Summarize architecture and responsibilities.
3. Write/refresh codebase-summary.md.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Summary artifact
2. High-value entry points
