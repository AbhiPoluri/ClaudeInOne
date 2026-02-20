# Kubernetes

## Invocation
`/k8s`

## Purpose
Generate Kubernetes manifests and deployment guidance.

## Agent Routing
- devops-engineer

## Execution Protocol
1. Generate deployment/service/ingress manifests.
2. Add env/secret/config patterns.
3. Validate manifest schema.

## Validation
- Confirm scope and constraints before making changes.
- Run relevant checks for each touched surface.
- Report unresolved risks or skipped validations.

## Output Format
1. K8s manifests
2. Apply/rollback commands
