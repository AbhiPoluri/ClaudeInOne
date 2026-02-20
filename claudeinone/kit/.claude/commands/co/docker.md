# Dockerize

## Invocation
`/docker`

## Purpose
Containerize the app with production-safe defaults.

## Agent Routing
- devops-engineer

## Execution Protocol
1. Create Dockerfile (multi-stage where possible).
2. Add docker-compose for local stack.
3. Validate image build and startup.

## Validation
- Confirm scope and constraints before making changes.
- Run relevant checks for each touched surface.
- Report unresolved risks or skipped validations.

## Output Format
1. Docker artifacts
2. Build/run instructions
