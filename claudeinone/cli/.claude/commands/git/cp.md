# Git Commit + Push

## Invocation
`/git:cp`

## Purpose
Commit then push with pre-push safety checks.

## Agent Routing
- git-manager
- tester

## Execution Protocol
1. Run /git:cm flow.
2. Run quick checks (tests/lint if configured).
3. Push and confirm remote update.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Commit + branch info
2. Push status
3. Follow-up if conflicts
