# MCP Server Builder

## Overview
Build custom Model Context Protocol servers to extend Claude Code with your own tools, resources, and data sources.

## Setup

```bash
npm install @modelcontextprotocol/sdk
npx @modelcontextprotocol/create-server my-mcp-server
```

## Basic MCP Server

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "my-tools", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_user",
      description: "Fetch a user from the database by ID",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string", description: "User ID" }
        },
        required: ["id"]
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  if (req.params.name === "get_user") {
    const { id } = req.params.arguments as { id: string };
    const user = await db.findUser(id);
    return {
      content: [{ type: "text", text: JSON.stringify(user, null, 2) }]
    };
  }
  throw new Error(`Unknown tool: ${req.params.name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

## Register in Claude Code

```json
// ~/.claude/claude_desktop_config.json
{
  "mcpServers": {
    "my-tools": {
      "command": "node",
      "args": ["/path/to/my-mcp-server/dist/index.js"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```

## MCP with Resources (File/Data Provider)

```typescript
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js";

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    { uri: "db://users/list", name: "All Users", mimeType: "application/json" }
  ]
}));

server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
  if (req.params.uri === "db://users/list") {
    const users = await db.findAll();
    return { contents: [{ uri: req.params.uri, mimeType: "application/json", text: JSON.stringify(users) }] };
  }
  throw new Error("Resource not found");
});
```

## Best Practices
- Keep tools focused — one tool does one thing well
- Return structured JSON text for complex data
- Validate all inputs with proper error messages
- Use environment variables for secrets, never hardcode

## Resources
- [MCP SDK docs](https://modelcontextprotocol.io/docs)
- [MCP server examples](https://github.com/modelcontextprotocol/servers)
