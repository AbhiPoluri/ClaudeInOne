# Changelog

## Invocation
`/changelog`

## Purpose
Generate changelog entries from commit history and release context.

## Agent Routing
- docs-manager
- git-manager

## Execution Protocol
1. Parse commits since last tag/release.
2. Group by type and impact.
3. Produce user-facing release notes.

## Validation
- Confirm scope and constraints before making changes.
- Run relevant checks for each touched surface.
- Report unresolved risks or skipped validations.

## Output Format
1. Changelog draft
2. Notable breaking changes
