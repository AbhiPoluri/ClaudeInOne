# Git Pull Request

## Invocation
`/git:pr [target] [source]`

## Purpose
Prepare PR metadata and create PR via gh when available.

## Agent Routing
- git-manager
- code-reviewer

## Execution Protocol
1. Analyze diff and commits.
2. Draft title, summary, test plan.
3. Create PR or output ready-to-paste template.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. PR title/body
2. URL (if created)
3. Checklist
