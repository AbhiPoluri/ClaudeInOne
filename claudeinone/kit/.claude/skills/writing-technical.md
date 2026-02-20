# Technical Writing

## Overview
Write clear, accurate technical documentation — API docs, guides, tutorials, and READMEs that developers love.

## README Structure

```markdown
# Project Name

One-line description of what this does.

## Features
- ✅ Feature 1 — brief description
- ✅ Feature 2 — brief description

## Quick Start

\`\`\`bash
npm install my-package
\`\`\`

\`\`\`typescript
import { MyThing } from 'my-package';
const result = MyThing.doSomething({ option: true });
\`\`\`

## Installation
Detailed installation with prerequisites.

## Usage
Code examples for common use cases.

## API Reference
Link to full API docs.

## Contributing
How to contribute — setup, tests, PRs.

## License
MIT
```

## API Documentation Pattern

```typescript
/**
 * Fetches a user by their unique identifier.
 *
 * @param id - The UUID of the user to fetch
 * @param options - Optional configuration
 * @param options.includeProfile - Whether to include profile data (default: false)
 * @returns The user object, or null if not found
 * @throws {ValidationError} If the ID is not a valid UUID
 * @throws {DatabaseError} If the database connection fails
 *
 * @example
 * ```typescript
 * const user = await getUser('550e8400-e29b-41d4-a716-446655440000');
 * if (user) console.log(user.name);
 * ```
 */
async function getUser(id: string, options?: { includeProfile?: boolean }): Promise<User | null> {
  // implementation
}
```

## Tutorial Writing Structure

```markdown
# How to Add Authentication to Your Next.js App

## What you'll build
A login/signup flow with JWT tokens.

## Prerequisites
- Node.js 18+
- Basic React knowledge

## Step 1: Install dependencies
[Short explanation of why these packages are needed]
\`\`\`bash
npm install next-auth @auth/prisma-adapter
\`\`\`

## Step 2: Configure the provider
[Explain what this code does, then show it]
\`\`\`typescript
// ...code...
\`\`\`

## Troubleshooting
Common errors and how to fix them.

## Next steps
Links to related guides.
```

## Writing Guidelines

```
DO:
✅ Use active voice: "Call the function" not "The function should be called"
✅ Show complete, runnable code examples
✅ Explain why, not just what
✅ Use numbered steps for procedures
✅ Include error messages users might see
✅ Keep paragraphs to 3-4 sentences maximum

DON'T:
❌ Use jargon without defining it
❌ Assume knowledge of unrelated topics
❌ Write overly long intro paragraphs
❌ Use "simply", "just", "easy" — it's condescending
```

## Resources
- [Google Developer Style Guide](https://developers.google.com/style)
- [Write the Docs](https://www.writethedocs.org)
