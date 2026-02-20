# Preview

## Invocation
`/preview`

## Purpose
Start local preview and provide access instructions.

## Agent Routing
- frontend-developer

## Execution Protocol
1. Detect project runtime command.
2. Start dev server safely.
3. Confirm served URL and health.
4. Report stop/restart instructions.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Preview URL
2. Startup logs summary
3. Troubleshooting notes
