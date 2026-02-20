# Pull Request

## Invocation
`/pr`

## Purpose
Prepare complete PR content from current diff.

## Agent Routing
- git-manager
- code-reviewer

## Execution Protocol
1. Summarize scope and user impact.
2. Generate title/body/checklist.
3. Include testing and rollback notes.

## Validation
- Confirm scope and constraints before making changes.
- Run relevant checks for each touched surface.
- Report unresolved risks or skipped validations.

## Output Format
1. PR draft
2. Reviewer checklist
