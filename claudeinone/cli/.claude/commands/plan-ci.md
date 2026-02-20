# Plan CI Fix

## Invocation
`/plan:ci [workflow-url]`

## Purpose
Create a plan to fix CI issues without directly applying patches.

## Agent Routing
- debugger
- scout
- researcher
- planner

## Execution Protocol
1. Analyze CI failure logs and impacted files.
2. Identify root causes.
3. Draft step-by-step remediation plan and prevention measures.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Root-cause summary
2. File-level action plan
3. Validation strategy
