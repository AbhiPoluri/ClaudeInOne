# Migrate

## Invocation
`/migrate [desc]`

## Purpose
Create and apply data/schema migration safely.

## Agent Routing
- database-admin
- backend-developer
- tester

## Execution Protocol
1. Model schema deltas and data migration needs.
2. Generate migration scripts.
3. Validate on representative dataset.
4. Provide rollback path.

## Validation
- Confirm scope and constraints before making changes.
- Run relevant checks for each touched surface.
- Report unresolved risks or skipped validations.

## Output Format
1. Migration files
2. Rollback plan
3. Verification results
