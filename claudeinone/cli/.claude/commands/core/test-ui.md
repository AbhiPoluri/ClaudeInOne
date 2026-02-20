# UI E2E Testing

## Invocation
`/test:ui`

## Purpose
Run browser-level E2E checks and report UI regressions.

## Agent Routing
- tester
- frontend-developer

## Execution Protocol
1. Detect Playwright/Cypress configuration.
2. Run core user-flow tests.
3. Capture failure steps/screenshots/logs.
4. Summarize flaky vs deterministic failures.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. E2E run results
2. Failure reproduction steps
3. Suggested fixes
