# Environment Check

## Invocation
`/env:check`

## Purpose
Audit environment variables for missing/unused/insecure values.

## Agent Routing
- security-auditor
- devops-engineer

## Execution Protocol
1. Extract env usage from code/config.
2. Compare with .env templates and runtime docs.
3. Flag missing, unused, and risky variables.

## Validation
- Confirm scope and constraints before making changes.
- Run relevant checks for each touched surface.
- Report unresolved risks or skipped validations.

## Output Format
1. Env audit report
2. Remediation list
