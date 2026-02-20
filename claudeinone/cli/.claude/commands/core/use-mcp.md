# Use MCP

## Invocation
`/use-mcp`

## Purpose
Discover and execute available MCP tools for the requested task.

## Agent Routing
- mcp-manager

## Execution Protocol
1. List servers/resources/templates.
2. Select minimal tool chain.
3. Execute operations and summarize outcomes.

## Validation
- Verify assumptions before changing files.
- Run the smallest relevant checks first, then broader checks when risk is high.
- Report residual risks explicitly.

## Output Format
1. Tools used
2. Results
3. Any follow-up calls needed
