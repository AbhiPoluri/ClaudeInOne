# Release

## Invocation
`/release <version>`

## Purpose
Prepare release tag, notes, and publish checklist.

## Agent Routing
- git-manager
- docs-manager

## Execution Protocol
1. Validate version bump semantics.
2. Generate release notes/changelog.
3. Tag and prepare publication steps.

## Validation
- Confirm scope and constraints before making changes.
- Run relevant checks for each touched surface.
- Report unresolved risks or skipped validations.

## Output Format
1. Release notes
2. Tag command/status
