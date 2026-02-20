# Worktree Manager

## Invocation
`/worktree`

## Purpose
Create/list/remove git worktrees for parallel tasks.

## Agent Routing
- git-manager

## Execution Protocol
1. Inspect existing worktrees.
2. Apply requested operation safely.
3. Return path and branch mapping.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Worktree status
2. Commands executed
3. Cleanup guidance
