# Deploy

## Invocation
`/deploy [env]`

## Purpose
Run deployment workflow and validate post-deploy health.

## Agent Routing
- devops-engineer

## Execution Protocol
1. Resolve target environment.
2. Execute deploy pipeline or deployment commands.
3. Run smoke checks and rollback if needed.

## Validation
- Confirm scope and constraints before making changes.
- Run relevant checks for each touched surface.
- Report unresolved risks or skipped validations.

## Output Format
1. Deployment result
2. Health check summary
3. Rollback status
