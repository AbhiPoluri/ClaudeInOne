# Terraform

## Invocation
`/terraform`

## Purpose
Generate or update Terraform infrastructure code.

## Agent Routing
- devops-engineer

## Execution Protocol
1. Model required infrastructure resources.
2. Generate modules/variables/outputs.
3. Validate plan/apply flow.

## Validation
- Confirm scope and constraints before making changes.
- Run relevant checks for each touched surface.
- Report unresolved risks or skipped validations.

## Output Format
1. Terraform files
2. Plan/apply instructions
