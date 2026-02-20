# Review Security

## Invocation
`/review:security`

## Purpose
Security-focused audit with OWASP lens.

## Agent Routing
- security-auditor

## Execution Protocol
1. Inspect authz/authn/input handling/secret usage.
2. Identify exploit paths and exposure.
3. Recommend remediations.

## Validation
- Confirm scope and constraints before making changes.
- Run relevant checks for each touched surface.
- Report unresolved risks or skipped validations.

## Output Format
1. Security findings
2. Risk levels
3. Fix checklist
