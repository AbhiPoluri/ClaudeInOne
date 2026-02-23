# ClaudeInOne

A production-grade framework for Claude Code. It installs 213 skill guides, 37 specialist agents, and 95 namespaced `/co:` commands into any project — giving Claude expert-level knowledge across every major framework, pattern, and deployment strategy, without you having to explain anything.

## Install

```bash
npm install -g claudeinone-cli
cd your-project
co init
```

Claude Code picks it up automatically. Your `.claude/` directory will contain all skills, agents, and commands.

## What you get

- **213 skills** — Production-ready guides for every major framework, from Next.js and FastAPI to Kubernetes and Stripe. Each skill contains real TypeScript implementations Claude uses directly.
- **37 agents** — Specialist agents with deep domain expertise: backend developer, security auditor, DevOps engineer, UX designer, and more. Invoke with `/co:spawn`.
- **95 commands** — Namespaced `/co:` commands for the full development lifecycle: planning, building, fixing, reviewing, testing, deploying, and documenting.

## Quick example

```
/co:cook add Stripe billing with subscription plans
```

Claude reads the matching skills (`saas-billing.md`, `auth-session.md`) and writes production-ready code with checkout sessions, webhook handlers, and a customer portal.

## What gets installed

```
project-root/
├── CLAUDE.md                    # Master system prompt
├── .claude/
│   ├── .ck.json                 # Version metadata
│   ├── skills/                  # 213 production skill guides
│   ├── agents/                  # 37 specialist agents
│   ├── commands/co/             # 95 /co: slash commands
│   └── settings.json
├── docs/
├── plans/
└── journals/
```

> Claude Code built-ins (`/help`, `/clear`, `/init`, `/memory`...) are unchanged. The `/co:` prefix is ClaudeInOne.

## Commands overview

| Category | Commands |
|----------|----------|
| Plan | `/co:plan`, `/co:plan-hard`, `/co:plan-fast`, `/co:plan-parallel` |
| Build | `/co:cook`, `/co:bootstrap`, `/co:scaffold`, `/co:new-feature` |
| Fix | `/co:fix`, `/co:fix-hard`, `/co:fix-ci`, `/co:fix-types` |
| Review | `/co:review-codebase`, `/co:review-security`, `/co:review-perf` |
| Test | `/co:test`, `/co:test-gen`, `/co:test-ui` |
| Git | `/co:git-cm`, `/co:git-pr`, `/co:changelog` |
| Deploy | `/co:deploy`, `/co:docker`, `/co:terraform` |
| Docs | `/co:docs-readme`, `/co:docs-update`, `/co:docs-api` |

[Full command reference →](https://claude-in-one.vercel.app/docs.html#commands)

## Docs

[claude-in-one.vercel.app](https://claude-in-one.vercel.app)

## License

MIT
