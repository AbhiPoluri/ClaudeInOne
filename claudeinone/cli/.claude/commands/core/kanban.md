# Kanban

## Invocation
`/kanban`

## Purpose
Update or report task board state.

## Agent Routing
- project-manager

## Execution Protocol
1. Parse requested board operation.
2. Validate task transitions.
3. Apply updates and report resulting board state.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Updated task statuses
2. Newly blocked items
3. Follow-up owners
