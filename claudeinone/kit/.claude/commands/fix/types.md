# Fix Types

## Invocation
`/fix:types`

## Purpose
Resolve type-system errors until project returns clean typecheck.

## Agent Routing
- backend-developer
- frontend-developer
- tester

## Execution Protocol
1. Detect TS/Dart typechecker.
2. Run checker and bucket errors.
3. Fix with strict typing; do not introduce unsafe shortcuts.
4. Re-run until clean or blocked.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Errors fixed
2. Remaining blockers
3. Typecheck status
