# Skill Fix Logs

## Invocation
`/skill:fix-logs [skill-path]`

## Purpose
Repair skill failures discovered in logs.txt.

## Agent Routing
- debugger
- skill-creator
- tester

## Execution Protocol
1. Classify log errors.
2. Map failures to broken skill sections.
3. Rewrite unclear/problematic instructions and examples.
4. Re-validate with checklist.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Updated skill changes
2. Fix report
3. Validation report
