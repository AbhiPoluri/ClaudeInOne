# claudeinone-cli

Production-grade framework for [Claude Code](https://claude.ai/code). Installs 213 skill guides, 37 specialist agents, and 95 `/co:` commands into any project — giving Claude expert-level knowledge across every major framework, pattern, and deployment strategy.

## Install

```bash
npm install -g claudeinone-cli
```

## Usage

```bash
# Install into an existing project
cd my-project
co init

# Create a new project
co new my-app

# Verify installation
co doctor

# Update to latest kit
co update
```

## What Gets Installed

```
my-project/
├── CLAUDE.md                    # Master system prompt
├── .claude/
│   ├── skills/                  # 213 production skill guides
│   ├── agents/                  # 37 specialist agents
│   ├── commands/co/             # 95 /co: slash commands
│   ├── settings.json
│   └── .ck.json
├── docs/
├── plans/
└── journals/
```

## Commands in Claude Code

All ClaudeInOne commands are namespaced under `/co:` to avoid collision with Claude Code built-ins.

| Category | Commands |
|----------|----------|
| Plan | `/co:plan`, `/co:plan-fast`, `/co:plan-hard`, `/co:plan-parallel` |
| Build | `/co:cook`, `/co:bootstrap`, `/co:scaffold`, `/co:new-feature` |
| Fix | `/co:fix`, `/co:fix-fast`, `/co:fix-hard`, `/co:fix-types`, `/co:fix-ui` |
| Review | `/co:review-codebase`, `/co:review-security`, `/co:review-perf`, `/co:review-a11y` |
| Test | `/co:test`, `/co:test-gen`, `/co:test-ui` |
| Git | `/co:git-cm`, `/co:git-cp`, `/co:pr` |
| Deploy | `/co:docker`, `/co:k8s`, `/co:terraform`, `/co:deploy` |
| Docs | `/co:docs-init`, `/co:docs-update`, `/co:docs-readme` |

## CLI Reference

```
co init [--yes] [--global] [--exclude <pattern>]
co new <name> [--dir <path>]
co doctor [--fix] [--report]
co update
co versions
co uninstall [--global]
```

## License

MIT
