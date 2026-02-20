# Skill Create

## Invocation
`/skill:create [prompt|url]`

## Purpose
Create a new reusable skill markdown with examples and validation.

## Agent Routing
- researcher
- skill-creator
- code-reviewer
- tester

## Execution Protocol
1. Research source material.
2. Generate skill content and examples.
3. Review structure/completeness.
4. Validate usefulness and readiness.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Skill file path
2. Quality checklist
3. Suggested improvements
