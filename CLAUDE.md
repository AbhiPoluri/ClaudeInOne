# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This repo contains three distinct components:

```
claudeinone/
├── cli/          # The `co` CLI tool — TypeScript, published to npm as claudeinone-cli
├── kit/          # The content package — markdown skills, agents, and commands
└── website/      # Static marketing site — plain HTML/CSS/JS (no framework)
```

The `cli/kit` directory is a **symlink** pointing to `../kit`, so the bundled kit ships inside the CLI package.

## CLI Development (`cli/`)

### Build & Run

```bash
cd claudeinone/cli

npm run build        # compile TypeScript → dist/
npm run dev          # run via Bun directly (no compile step)
npm run smoke        # integration test: init → doctor → uninstall in a temp dir
npm run start        # run compiled dist/index.js
```

TypeScript is compiled with `tsc` targeting ES2022 with `NodeNext` module resolution. All imports in source must use `.js` extensions (NodeNext requirement).

### Install locally for testing

```bash
cd claudeinone/cli
npm run build
npm install -g .     # registers `co` binary globally
```

### CLI Architecture

Entry point is `src/index.ts` — registers all Commander commands and delegates to handler functions.

**Commands** (`src/commands/`):
- `init.ts` — copies kit to `cwd` (or `~/.claude` with `--global`). Detects conflicts via `getFileDiffs`, backs up changed files, then calls `installKit`. Writes `.claude/.ck.json` on completion.
- `new.ts` — creates a directory, runs `git init`, then delegates to `runInit`.
- `doctor.ts` — validates the installed structure against a checklist; `--fix` creates missing dirs/files; `--report` emits JSON.
- `versions.ts` — reads `package.json` and `kit/.claude/.ck.json` for local versions, queries npm registry for published versions.
- `update.ts` — re-runs `init --yes` to overwrite with latest bundled kit.
- `uninstall.ts` — removes `.claude/`, `CLAUDE.md`, `docs/`, `plans/`, `journals/` from `cwd`.

**Utils** (`src/utils/`):
- `installer.ts` — recursive file copy respecting `.claude/.ckignore` patterns and `skipPaths`.
- `merger.ts` — `getFileDiffs()` compares source tree vs target tree, returns which files are new/changed/identical.
- `backup.ts` — `backupPaths()` copies listed paths into `.claude.backup.<timestamp>/` before overwriting.
- `platform.ts` — resolves `~/.claude` path cross-platform (Windows uses `%LOCALAPPDATA%`).

### Kit Resolution

At runtime, `init.ts` resolves the kit root by walking up from `import.meta.url`:
```
dist/commands/init.js  →  ../../  →  cli/  →  cli/kit/
```
This means `kit/` must always be a sibling of the compiled `dist/` directory.

## Kit Content (`kit/`)

The kit installs the following into a target project:

```
kit/
├── CLAUDE.md                  # master system prompt for Claude Code
├── README.md
├── SKILLS_INDEX.md
├── .claude/
│   ├── .ck.json               # version metadata: { version, kit, skills, commands, agents }
│   ├── .ckignore              # files excluded during install (gitignore syntax)
│   ├── settings.json
│   ├── skills/                # 213 .md skill guides
│   ├── agents/                # 37 .md agent definitions
│   └── commands/
│       └── co/                # 95 /co: slash commands (namespaced to avoid collision with Claude built-ins)
├── docs/
├── plans/
└── journals/
```

All commands live under `commands/co/` so they are invoked as `/co:<name>` in Claude Code — this separates them from Claude Code's built-in commands (`/help`, `/clear`, `/init`, etc.).

### Updating Kit Content

Skills, agents, and commands are plain `.md` files — edit them directly. No build step required. After editing, run `npm run smoke` from `cli/` to verify the install/uninstall cycle still works.

The `.ckignore` file in `kit/.claude/` lists paths excluded during `co init` (same syntax as `.gitignore`).

## Website (`website/`)

Plain static HTML/CSS/JS — no build tool, no framework. Open `index.html` directly in a browser or serve with any static file server:

```bash
cd claudeinone/website
npx serve .          # or python3 -m http.server 8080
```

Files: `index.html` (landing page), `docs.html` (documentation), `style.css`, `script.js`.

## Key Conventions

- All imports in `cli/src/` use `.js` extensions even for `.ts` files (NodeNext module resolution requirement).
- The kit version lives in `kit/.claude/.ck.json` — bump `version` there to release a new kit version.
- The npm package version lives in `cli/package.json` — these can be bumped independently.
- `co init --yes` is idempotent: re-running it creates a backup and re-installs the full kit.
