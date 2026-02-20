# Fix UI

## Invocation
`/fix:ui [screenshot/video] [desc]`

## Purpose
Diagnose and fix visual/layout/interaction issues from evidence.

## Agent Routing
- frontend-developer
- accessibility-auditor
- tester

## Execution Protocol
1. Inspect visual evidence and reproduce issue.
2. Find CSS/component/root-cause conflicts.
3. Patch responsive and interaction behavior.
4. Validate across breakpoints.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Root cause
2. UI patch details
3. Visual validation checklist
