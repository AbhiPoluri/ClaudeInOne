# Git Commit

## Invocation
`/git:cm`

## Purpose
Create safe conventional commit from current diff.

## Agent Routing
- git-manager

## Execution Protocol
1. Inspect staged/unstaged changes.
2. Exclude secrets/artifacts.
3. Generate conventional message.
4. Commit and report hash.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Commit message
2. Commit hash
3. Excluded files warnings
