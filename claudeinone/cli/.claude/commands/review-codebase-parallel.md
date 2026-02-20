# Review Codebase Parallel

## Invocation
`/review:codebase:parallel`

## Purpose
Parallel review tracks for faster full-codebase audits.

## Agent Routing
- code-reviewer
- security-auditor
- performance-optimizer
- accessibility-auditor

## Execution Protocol
1. Run parallel audits by concern area.
2. Deduplicate overlapping findings.
3. Return ranked remediation plan.

## Validation
- Confirm scope and constraints before making changes.
- Run relevant checks for each touched surface.
- Report unresolved risks or skipped validations.

## Output Format
1. Parallel audit findings
2. Consolidated priorities
