# ClaudeKit Clone — Implementation Plan

## Overview

ClaudeKit is a production-grade framework for Claude Code consisting of two parts:

1. **Kit** — a `.claude/` content package (commands, agents, skills) installed into projects
2. **CLI** — a `ck` command-line tool (Bun + TypeScript) that distributes and manages the kit

---

## Project Structure

```
claudekit/
├── PLAN.md
├── kit/
│   ├── CLAUDE.md              ← master system prompt
│   ├── docs/                  ← documentation templates
│   ├── plans/                 ← plan templates
│   ├── journals/              ← session journals output dir
│   └── .claude/
│       ├── .ck.json
│       ├── .ckignore
│       ├── settings.json
│       ├── commands/          ← 50+ slash command .md files
│       ├── agents/            ← 30+ agent definition .md files
│       └── skills/            ← 108+ skill .md files
└── cli/
    ├── package.json
    ├── tsconfig.json
    ├── kit -> ../kit
    └── src/
        ├── index.ts
        ├── commands/
        └── utils/
```

---

## Phase 1 — Kit Content

### 1.1 Root Config Files

| File | Purpose |
|------|---------|
| `kit/CLAUDE.md` | Master system prompt: role, token budget, session structure, plan-before-code protocol, agent routing |
| `kit/.claude/settings.json` | Pre/post-tool hooks, permission rules, MCP server stubs |
| `kit/.claude/.ck.json` | `{ "version": "1.0.0", "kit": "engineer" }` |
| `kit/.claude/.ckignore` | `node_modules`, `.next`, `dist`, `build`, `.git` |

---

### 1.2 Commands (50+ files in `kit/.claude/commands/`)

All commands sourced directly from docs.claudekit.cc.

---

#### Core Commands (`commands/core/`)

| File | Command | Exact Behavior from Docs |
|------|---------|--------------------------|
| `bootstrap.md` | `/bootstrap [desc]` | 5-phase: Requirements Q&A → Researcher agents find best practices → Planner creates architecture → Auto-generates project structure + features + configs + tests → Validation phase runs tests |
| `bootstrap-auto.md` | `/bootstrap:auto [desc]` | Same as `/bootstrap` but fully autonomous — no Q&A, skips plan review, makes all decisions independently. Requires comprehensive description |
| `bootstrap-auto-fast.md` | `/bootstrap:auto:fast [desc]` | Autonomous mode speed-optimized — fewer research passes, direct implementation |
| `bootstrap-auto-parallel.md` | `/bootstrap:auto:parallel [desc]` | Autonomous with parallel agent execution for implementation phases |
| `cook.md` | `/cook [feature]` | 7-step pipeline: Planning (uses existing plan if available) → Scout (locates files/integration points) → Implementation (code + error handling) → Testing (unit/integration/E2E, >80% coverage) → Code Review (quality/security/perf) → Documentation → Summary report. Agents: planner, scout, code-reviewer, tester, debugger (on failures) |
| `debug.md` | `/debug [issues]` | Diagnosis ONLY — does NOT fix. Invokes debugger agent for: root cause identification with file refs, chain-of-events execution flow, affected component analysis, recommended fix approaches. Saves report to `plans/debug/`. Input: error messages + stack traces + reproduction steps |
| `ask.md` | `/ask [question]` | Strategic architectural consultation — no implementation. Invokes 4 advisor agents in parallel: Systems Designer (boundaries/interactions), Technology Strategist (patterns/stacks), Scalability Consultant (perf/reliability), Risk Analyst (trade-offs). Auto-reads `./docs/` context files |
| `scout.md` | `/scout [prompt] [scale]` | Parallel codebase search. Scale = number of agents (default 3, range 2-5). Divides codebase into logical regions → spawns parallel Explore subagents → aggregates results → saves to `plans/scouts/[name]-[date].md`. 3-minute timeout per agent |
| `journal.md` | `/journal` | Creates timestamped session journal in `journals/session-YYYY-MM-DD.md`. journal-writer agent analyzes: git commits, file diffs, test additions, doc changes, error logs, command history. Sections: code change summary, technical decisions + rationale, obstacles + resolutions, perf benchmarks, security implementations, known limitations, future priorities, lessons learned |
| `test.md` | `/test` | Tester agent: run tests, analyze coverage, validate quality standards |
| `test-ui.md` | `/test:ui` | E2E UI testing with Playwright/Cypress |
| `watzup.md` | `/watzup` | Project status report: active plans, blockers, recent changes, next steps |
| `kanban.md` | `/kanban` | View/update kanban board task status |
| `preview.md` | `/preview` | Launch dev server + open browser preview |
| `use-mcp.md` | `/use-mcp` | MCP Manager agent: discover and execute MCP server tools |
| `ck-help.md` | `/ck-help` | List all available ClaudeKit commands with descriptions |
| `coding-level.md` | `/coding-level` | Set output verbosity and detail level for Claude's code responses |
| `worktree.md` | `/worktree` | Git worktree management for parallel feature development |

---

#### Fix Commands (`commands/fix/`)

| File | Command | Exact Behavior from Docs |
|------|---------|--------------------------|
| `fix-fast.md` | `/fix:fast [bug]` | Quick fix without analysis: reads bug → identifies likely location (minimal scan) → implements fix following existing patterns → runs relevant tests → summary report. Typical: 5-30 sec, 1-2 files. ~95% success for simple issues. Skip for: complex bugs, unknown root causes, system-wide issues |
| `fix-hard.md` | `/fix:hard [issue]` | Multi-agent complex fix: Scout (parallel agents scan + map deps) → Debugger (root cause, distinguish symptoms vs causes) → Researcher (best practices + known solutions) → Planner (detailed strategy) → Implementation (fixes + edge cases) → Tester (new tests + full suite). Output: fix plan, modified files, test suites, docs, rollback instructions. ~8-15 min |
| `fix-ci.md` | `/fix:ci [github-workflow-url]` | Fetches workflow logs via `gh` CLI → Debugger categorizes failures (dependency/environment/test/build/workflow-config) → Researcher finds solutions → Implements fixes (code + workflow YAML + deps + settings) → Verifies locally. Flags: `--job=`, `--auto-rerun`, `--create-issue`. ~85% automated fix rate |
| `fix-logs.md` | `/fix:logs [issue]` | Reads `./logs.txt` → Debugger does root cause analysis (correlates events, identifies patterns, traces execution paths) → creates diagnostic report → implements fixes systematically → re-analyzes logs to confirm resolution. ~92% fix accuracy, discovers secondary issues in ~35% of cases |
| `fix-types.md` | `/fix:types` | Auto-detects TypeScript or Dart → runs typecheck (`bun run typecheck` / `dart analyze`) → categorizes errors → fixes without introducing `any` types (null safety, annotations, generics, union types, interface completeness) → re-runs in loop until clean. ~98% success, 1-3 iterations typically |
| `fix-ui.md` | `/fix:ui [screenshot/video] [desc]` | AI vision analyzes media → locates component files + CSS + breakpoints → root cause (CSS rules, responsive, component logic, conflicts) → implements fixes (styles, layouts, responsive, component logic) → visual validation steps. Handles: layout misalignment, responsive issues, z-index, animations, dark mode, a11y |

---

#### Plan Commands (`commands/plan/`)

| File | Command | Exact Behavior from Docs |
|------|---------|--------------------------|
| `plan.md` | `/plan [feature]` | Spawns 3 researcher agents in parallel → analyze codebase → create `plans/<timestamp>.md` → display for user review before any implementation |
| `plan-fast.md` | `/plan:fast [feature]` | Single researcher, faster output, lighter research pass |
| `plan-hard.md` | `/plan:hard [feature]` | Deep multi-source research, exhaustive planning, maximum detail |
| `plan-parallel.md` | `/plan:parallel [feature]` | Parallel researchers + parallel implementation planning sections |
| `plan-validate.md` | `/plan:validate` | Validate an existing plan for feasibility, risks, and completeness |
| `plan-two.md` | `/plan:two [task]` | Researcher analyzes best practices → Planner generates 2 contrasting approaches → detailed planning for each → comparison matrix (scalability/security/simplicity/perf) → recommendation with reasoning. Outputs: `plans/[task]-approach-1-[name].md`, `plans/[task]-approach-2-[name].md`, `plans/[task]-comparison.md` |
| `plan-ci.md` | `/plan:ci [github-actions-url]` | Fetches CI logs → Debugger (root cause, not just symptoms) → Scout (workflow files, affected source) → Researcher (solutions + best practices) → Planner creates implementation plan with root cause, step-by-step instructions, files to modify, commands, testing strategy, prevention measures. Plan-only — no automatic fixes |
| `plan-archive.md` | `/plan:archive` | Archive completed plans with summary and outcome notes |
| `plan-cro.md` | `/plan:cro` | Plan conversion rate optimization changes for current project |

---

#### Git Commands (`commands/git/`)

| File | Command | Exact Behavior from Docs |
|------|---------|--------------------------|
| `git-cm.md` | `/git:cm` | Examines repo status + diffs + commit history → categorizes changes → generates conventional commit message (`<type>(<scope>): <subject>`) → stages files (excludes .env, secrets, artifacts) → commits. Security: detects sensitive files + warns. Auto-detects scope from changed files. Types: feat/fix/docs/style/refactor/perf/test/build/ci/chore |
| `git-cp.md` | `/git:cp` | Same as `/git:cm` then: pre-push safety checks (tests, linting, sensitive files) → `git push` with conflict detection → verifies remote update + CI triggering. Prompts to configure upstream if needed. Warns on force push |
| `git-pr.md` | `/git:pr [target-branch] [source-branch]` | Identifies branches → `git status` + `git diff` + `git log` → analyzes complete changeset → generates PR title + description + feature list + test plan → `gh pr create` → returns PR URL. Requires `gh` CLI. Default target: `main` |

---

#### Docs Commands (`commands/docs/`)

| File | Command | Exact Behavior from Docs |
|------|---------|--------------------------|
| `docs-init.md` | `/docs:init` | 4-phase codebase analysis: Scanning (source files, structure, frameworks, schemas, API endpoints) → Architecture Analysis (patterns, deps, data flow, integration points, external services) → Code Standards Detection (naming, style, lint rules, testing, error handling) → Documentation Generation. Creates 7 files in `docs/`: `codebase-summary.md`, `project-overview-pdr.md`, `code-standards.md`, `system-architecture.md`, `design-guidelines.md`, `deployment-guide.md`, `project-roadmap.md`. Flags: `--focus=`, `--dir=` |
| `docs-update.md` | `/docs:update [requests]` | docs-manager agent: runs `repomix` → creates/updates `./docs/codebase-summary.md` → reads existing docs → identifies outdated info + gaps → updates README, project overview, codebase summary, code standards, system architecture, project roadmap, deployment guide, design guidelines → QA (formatting, links, code examples). ~3-5 min, 4-8 files updated |
| `docs-summarize.md` | `/docs:summarize` | Runs `repomix` → generates `./repomix-output.xml` → parses for key components + modules + architectural patterns → creates/updates `./docs/codebase-summary.md` with project tree, file organization, key files, metrics. docs-manager agent. No flags needed |

---

#### Content Commands (`commands/content/`)

| File | Command | Exact Behavior from Docs |
|------|---------|--------------------------|
| `content-fast.md` | `/content:fast [request]` | Quick copy generation. Copywriter agent: analyzes content type + audience + tone + platform → quick research → creates 3-5 platform-optimized variations with character counts. 5-15 seconds. Supports: social posts, email subjects, headlines, ad copy, product descriptions, push notifications, SMS, taglines, email body, landing page copy, changelog entries, READMEs, press releases |
| `content-good.md` | `/content:good [request]` | Strategic content. Copywriter + Researcher agents: deep audience analysis + competitor study + gap research + psychological triggers → strategic planning (objectives, messages, structure, tone) → 3-5 complete variations with different angles + detailed rationale per variation + A/B testing recommendations. Saves: research report, strategy brief, variations |
| `content-cro.md` | `/content:cro [content/url]` | CRO optimization. Copywriter agent: analyzes existing content → psychological analysis (triggers, trust signals, cognitive biases) → CRO audit (headlines, value props, CTAs, social proof, urgency, visual hierarchy, mobile) → 3-5 headline rewrites + improved CTAs + A/B testing plan with metrics + sample size + expected lift. Frameworks: AIDA, PAS, Before-After-Bridge. Saves to `plans/content-cro-[page-name]-YYYYMMDD.md` |
| `content-enhance.md` | `/content:enhance [file/desc]` | Enhance existing copy. Copywriter agent: reads content → multi-dimensional audit (clarity, impact, SEO, readability, grammar, structure) → recommendations + revised version. Dimensions: clarity (jargon), impact (engagement), SEO (keywords, meta, links), readability (sentence length, paragraph structure). Outputs: enhanced file + change report (diff) + analysis with before/after metrics |

---

#### Design Commands (`commands/design/`)

| File | Command | Exact Behavior from Docs |
|------|---------|--------------------------|
| `design-fast.md` | `/design:fast [desc]` | Rapid UI prototype. Template-based + Tailwind CSS + React/TypeScript + React Hook Form + Zod. Skips: lengthy research, aesthetics polish. Prioritizes: working interactions, functional first. ~10-18 min depending on type. Outputs: complete components + documentation. Best for: MVPs, prototypes, internal tools, hackathons |
| `design-good.md` | `/design:good [brief]` | Production-ready design. ui-ux-designer agent. 7 steps: Research (Dribbble/Behance/Awwwards analysis) → Strategic Planning (comprehensive design system definition) → Design System (color palettes, typography, spacing, component lib) → High-Fidelity (pixel-perfect + custom graphics + meaningful animations) → Responsive + Accessible (WCAG 2.1 AA, all breakpoints, keyboard nav) → Motion Design (300-500ms standard, reduced-motion support) → Production Ready (clean code + perf optimization + docs). 6-16 hours |
| `design-screenshot.md` | `/design:screenshot [path]` | Screenshot → code. AI vision: extracts layout structure, colors (hex/RGB/HSL), typography, spacing, responsive patterns → component decomposition (hierarchy, relationships) → style extraction (exact values, shadows, gradients, animations) → generates typed React/Vue + Tailwind or CSS-in-JS + responsive breakpoints + interactive states + WCAG AA. Ethically: inspiration + mockup conversion, not direct copying |
| `design-video.md` | `/design:video [path]` | Video → animated UI. Frame-by-frame analysis: identifies key states + transitions + timing + user interactions → motion analysis (fade/slide/scale/rotate types, durations ms, easing functions) → interaction mapping (user actions → visual feedback) → state transition identification → generates Framer Motion or CSS with exact timing. Supports: swipe/pinch/drag/tap with velocity thresholds. Includes `useReducedMotion` support |
| `design-describe.md` | `/design:describe [file]` | Visual analysis only — no code generation. AI vision: UI components + layout + color palettes + typography + spacing + interaction patterns → component identification (recognizes Material UI, Ant Design, etc.) → style extraction (exact values) → implementation strategy (tech recommendations, effort estimates) → technical specifications. Outputs: component breakdown, color systems, typography scale, spacing docs, animation specs, responsive notes, a11y considerations |
| `design-3d.md` | `/design:3d [desc]` | Three.js + WebGL 3D experience. ui-ux-designer agent for concept. 7 phases: Concept + Planning → Three.js Setup (scene, responsive canvas, WebGL context) → 3D Assets (geometry, PBR materials, lighting, model loading GLTF/FBX/OBJ) → Interaction (orbit controls, raycasting, hover/click, touch gestures) → Animation + Effects (loops, particles, post-processing, shaders) → Perf Optimization (LOD, draw calls, frustum culling, texture compression) → Responsive Integration (cross-device, mobile optimizations, WebXR). Outputs: React/TypeScript Scene3D components + GLSL shader files + utility modules |

---

#### Integration Commands (`commands/integrate/`)

| File | Command | Exact Behavior from Docs |
|------|---------|--------------------------|
| `integrate-polar.md` | `/integrate:polar [requirements]` | Polar.sh payment integration. 5 phases: Requirements Analysis → Researcher reviews Polar API docs → Planner details routes + DB models + webhooks → Code agent builds backend (SDK, endpoints, webhook handlers with signature verification, DB models, subscription middleware) + frontend (pricing table, checkout button, subscription dashboard, customer portal, usage tracking) → Tester generates 80+ tests with 90%+ coverage. ~25 files, 4-6 min. Handles: subscriptions, one-time payments, usage-based billing, webhooks (subscription created/updated/canceled, payment succeeded/failed) |
| `integrate-sepay.md` | `/integrate:sepay [requirements]` | SePay.vn Vietnamese payment integration. 5 phases: Requirements (Vietnamese-specific needs) → Researcher reviews SePay API + Vietnam regulations + localization → Planning → Code agent builds: QR code generation (15-min expiry), bank transfer (multi-bank, Vietnamese bank codes), webhook handlers (signature verification, payment.success/expired), VND formatting (no decimals, 1K-500M range), Vietnamese UI/error messages → Tester generates 98 tests, 96% coverage. ~16 files. Supports 10+ Vietnamese banks (VCB, TCB, BIDV, VTB, ACB, MBBank, MSB, SCB, VPBank) |

---

#### Skill Commands (`commands/skill/`)

| File | Command | Exact Behavior from Docs |
|------|---------|--------------------------|
| `skill-create.md` | `/skill:create [prompt/llms-url/github-url]` | Creates new skill file. 4 phases: Research (2-3 min, Researcher agent analyzes docs + maps skill structure) → Implementation (3-5 min, skill-creator agent writes `.claude/skills/[name].md` with knowledge sections, usage examples, tool integrations, best practices) → Review (1-2 min, code-reviewer validates structure + completeness + example accuracy) → Evaluation (1 min, tester verifies activation + quality score on 4 dims: completeness, clarity, examples, usefulness). Accepts: natural language, llms.txt URL, GitHub repo URL. Outputs: `.claude/skills/[name].md` + research plan + evaluation report |
| `skill-fix-logs.md` | `/skill:fix-logs [skill-path]` | Fixes a skill based on `logs.txt` errors. 5 phases: Log Analysis (reads errors, categorizes: syntax/logic/missing info) → Diagnosis (debugger agent: skill content vs error patterns, root cause, missing info gaps) → Fix Planning (prioritization, content additions, rewrites, example fixes) → Update (skill-creator agent: revise problematic sections, insert missing info, fix code examples, clarify instructions) → Validation (tester verifies fixes, generates validation report). Outputs: updated skill file + fix report + validation report |

---

### 1.3 Agents (30+ files in `kit/.claude/agents/`)

#### Engineering Agents
| File | Agent | Role |
|------|-------|------|
| `planner.md` | Planner | Conducts research + creates detailed implementation plans before coding |
| `researcher.md` | Researcher | Multi-source research, docs analysis, codebase exploration, pattern identification |
| `fullstack-developer.md` | Fullstack Developer | Implements phases with strict file ownership protocol |
| `frontend-developer.md` | Frontend Developer | React/Next.js UI specialist |
| `backend-developer.md` | Backend Developer | API, services, database layer specialist |
| `mobile-developer.md` | Mobile Developer | React Native / Flutter / Expo implementation |
| `debugger.md` | Debugger | Root cause analysis, log investigation, systematic diagnosis — does NOT fix |
| `tester.md` | Tester | Run tests, coverage analysis, generate test suites, quality validation |
| `code-reviewer.md` | Code Reviewer | Security audits, performance analysis, quality assessment, best practices |
| `security-auditor.md` | Security Auditor | OWASP Top 10, secrets detection, vulnerability scanning, threat modeling |
| `performance-optimizer.md` | Performance Optimizer | Profiling, bottleneck analysis, bundle size, query optimization |
| `refactorer.md` | Refactorer | Safe code restructuring without behavior change |
| `api-designer.md` | API Designer | REST / GraphQL / tRPC / gRPC design patterns |
| `database-admin.md` | Database Admin | Schema design, migrations, indexing, query optimization |
| `devops-engineer.md` | DevOps Engineer | CI/CD, Docker, Kubernetes, cloud infrastructure |
| `accessibility-auditor.md` | Accessibility Auditor | WCAG 2.1 AA, ARIA, keyboard navigation, screen readers |
| `ui-ux-designer.md` | UI/UX Designer | Award-winning interfaces, Three.js, Dribbble/Awwwards research, responsive |
| `scout.md` | Scout | Fast parallel codebase search and pattern detection |
| `skill-creator.md` | Skill Creator | Writes new skill prompt files in standardized markdown format |

#### Management & Process Agents
| File | Agent | Role |
|------|-------|------|
| `docs-manager.md` | Docs Manager | Technical docs, API refs, architecture guides, codebase summaries |
| `project-manager.md` | Project Manager | Progress tracking, cross-agent coordination, status reports |
| `journal-writer.md` | Journal Writer | Candid session recording: decisions, failures, lessons learned |
| `git-manager.md` | Git Manager | Conventional commits, security scanning, PR generation |
| `brainstormer.md` | Brainstormer | Explore alternatives, question assumptions, debate decisions |

#### Specialized Advisor Agents (invoked by `/ask`)
| File | Agent | Role |
|------|-------|------|
| `systems-designer.md` | Systems Designer | System boundaries, component interactions, architecture evaluation |
| `technology-strategist.md` | Technology Strategist | Architectural patterns, technology stack recommendations |
| `scalability-consultant.md` | Scalability Consultant | Performance, reliability, scalability assessment |
| `risk-analyst.md` | Risk Analyst | Trade-off identification, risk analysis, issue prediction |

#### Integration & Research Agents
| File | Agent | Role |
|------|-------|------|
| `mcp-manager.md` | MCP Manager | MCP server discovery, tool execution, integration management |
| `integration-specialist.md` | Integration Specialist | Third-party API integrations (Stripe, Polar, SePay, Auth0, etc.) |
| `i18n-specialist.md` | i18n Specialist | Internationalization, locale management, RTL support |

#### Marketing Agents
| File | Agent | Role |
|------|-------|------|
| `copywriter.md` | Copywriter | CRO-focused copy, AIDA/PAS frameworks, A/B test copy |
| `seo-specialist.md` | SEO Specialist | Technical SEO, keyword research, on-page optimization |
| `content-creator.md` | Content Creator | Blog posts, tutorials, documentation content |
| `email-wizard.md` | Email Wizard | Email campaigns, sequences, subject line optimization |
| `social-media-manager.md` | Social Media Manager | Platform-specific content and scheduling |
| `campaign-manager.md` | Campaign Manager | End-to-end campaign strategy and execution |

---

### 1.4 Skills (108+ files in `kit/.claude/skills/`)

#### Frontend Development (15)
| File | Skill |
|------|-------|
| `frontend-react.md` | React: hooks, context, patterns, performance, RSC |
| `frontend-nextjs.md` | Next.js 15: App Router, Server Actions, caching, ISR |
| `frontend-vue.md` | Vue 3: Composition API, Pinia, Nuxt 3 |
| `frontend-svelte.md` | SvelteKit: stores, SSR, form actions |
| `frontend-astro.md` | Astro: islands, content collections, SSG |
| `frontend-remix.md` | Remix: loaders, actions, nested routes |
| `frontend-angular.md` | Angular: signals, standalone components, RxJS |
| `frontend-solid.md` | SolidJS: fine-grained reactivity, SolidStart |
| `frontend-htmx.md` | HTMX: hypermedia-driven UI, partial updates |
| `frontend-vite.md` | Vite: config, plugins, optimization, HMR |
| `frontend-webpack.md` | Webpack: config, loaders, bundle optimization |
| `frontend-state.md` | State: Zustand, Jotai, Redux Toolkit |
| `frontend-forms.md` | Forms: React Hook Form, Zod validation |
| `frontend-pwa.md` | PWA: service workers, offline, push notifications |
| `frontend-testing.md` | Frontend testing: Vitest, RTL, Storybook |

#### Backend Development (15)
| File | Skill |
|------|-------|
| `backend-nodejs.md` | Node.js: event loop, streams, clustering |
| `backend-express.md` | Express.js: middleware, routing, error handling |
| `backend-fastify.md` | Fastify: schemas, plugins, serialization |
| `backend-hono.md` | Hono: edge-first, middleware, adapters |
| `backend-python-fastapi.md` | FastAPI: pydantic, dependency injection, async |
| `backend-python-django.md` | Django: ORM, DRF, signals, celery |
| `backend-go.md` | Go: goroutines, channels, stdlib, net/http |
| `backend-rust.md` | Rust: ownership, async, Axum, Actix |
| `backend-java-spring.md` | Spring Boot: DI, JPA, Security, Reactor |
| `backend-ruby-rails.md` | Rails: ActiveRecord, Hotwire, background jobs |
| `backend-php-laravel.md` | Laravel: Eloquent, queues, broadcasting |
| `backend-dotnet.md` | .NET/C#: minimal APIs, EF Core, SignalR |
| `backend-graphql.md` | GraphQL: schema, resolvers, subscriptions |
| `backend-grpc.md` | gRPC: proto files, streaming, deadlines |
| `backend-websockets.md` | WebSockets: real-time, rooms, presence |

#### API & Integration (6)
| File | Skill |
|------|-------|
| `api-rest.md` | REST: resource design, versioning, pagination, HATEOAS |
| `api-trpc.md` | tRPC: type-safe procedures, middleware |
| `api-openapi.md` | OpenAPI: spec writing, codegen, validation |
| `api-webhooks.md` | Webhooks: delivery, retry, signature verification |
| `api-rate-limiting.md` | Rate limiting: strategies, Redis sliding window |
| `api-caching.md` | Caching: HTTP, CDN, stale-while-revalidate |

#### Databases (12)
| File | Skill |
|------|-------|
| `db-postgresql.md` | PostgreSQL: advanced queries, indexes, JSONB, RLS |
| `db-mysql.md` | MySQL: InnoDB, full-text search, replication |
| `db-sqlite.md` | SQLite: WAL, FTS5, Turso/libSQL edge |
| `db-mongodb.md` | MongoDB: aggregations, Atlas Search, change streams |
| `db-redis.md` | Redis: data structures, pub/sub, caching patterns |
| `db-dynamodb.md` | DynamoDB: single-table design, GSIs, streams |
| `db-cassandra.md` | Cassandra: partitioning, consistency levels |
| `db-prisma.md` | Prisma: schema, migrations, client patterns |
| `db-drizzle.md` | Drizzle ORM: type-safe queries, migrations |
| `db-supabase.md` | Supabase: Realtime, RLS, Edge Functions, Storage |
| `db-planetscale.md` | PlanetScale: branching, deploy requests, Vitess |
| `db-neon.md` | Neon: serverless Postgres, branching, pooling |

#### Authentication & Security (8)
| File | Skill |
|------|-------|
| `auth-jwt.md` | JWT: signing, verification, refresh, rotation |
| `auth-oauth2.md` | OAuth 2.0: flows, PKCE, token exchange |
| `auth-passkeys.md` | WebAuthn/Passkeys: SimpleWebAuthn, registration, assertion |
| `auth-session.md` | Session auth: cookies, CSRF, secure flags |
| `auth-lucia.md` | Lucia Auth: sessions, adapters, OAuth |
| `auth-nextauth.md` | NextAuth v5/Auth.js: providers, callbacks |
| `auth-clerk.md` | Clerk: prebuilt UI, organizations, webhooks |
| `security-owasp.md` | OWASP Top 10: injection, XSS, IDOR, misconfig |

#### UI Styling & Design (8)
| File | Skill |
|------|-------|
| `ui-tailwind.md` | Tailwind CSS v4: utilities, variants, dark mode |
| `ui-shadcn.md` | shadcn/ui: component customization, registry |
| `ui-radix.md` | Radix UI: primitives, accessibility, composition |
| `ui-framer.md` | Framer Motion: animations, transitions, gestures |
| `ui-gsap.md` | GSAP: timeline, ScrollTrigger, SVG animation |
| `ui-threejs.md` | Three.js: scenes, shaders, WebGL, 3D animations |
| `ui-tokens.md` | Design tokens: variables, theming, dark mode |
| `ui-a11y.md` | Accessibility: WCAG 2.1 AA, ARIA, focus management |

#### Mobile Development (4)
| File | Skill |
|------|-------|
| `mobile-react-native.md` | React Native: navigation, native modules, Expo |
| `mobile-expo.md` | Expo: EAS, OTA updates, SDK, Router |
| `mobile-flutter.md` | Flutter: widgets, state management, platform channels |
| `mobile-capacitor.md` | Capacitor: native APIs, plugins, web-native bridge |

#### AI & Machine Learning (10)
| File | Skill |
|------|-------|
| `ai-anthropic.md` | Anthropic API: messages, streaming, tool use, vision |
| `ai-openai.md` | OpenAI API: chat, embeddings, assistants, fine-tuning |
| `ai-gemini.md` | Google Gemini API: multimodal, grounding, long context |
| `ai-langchain.md` | LangChain: chains, agents, memory, RAG |
| `ai-llamaindex.md` | LlamaIndex: data connectors, query engines, RAG |
| `ai-vectordb.md` | Vector DBs: Pinecone, Weaviate, Qdrant, ChromaDB |
| `ai-rag.md` | RAG: chunking, embedding, retrieval, reranking |
| `ai-prompt-engineering.md` | Prompt engineering: CoT, few-shot, structured output |
| `ai-mcp-builder.md` | MCP servers: TS/Python SDK, tool definitions |
| `ai-context-engineering.md` | Context: token budget, memory, compression |

#### Cloud & Infrastructure (8)
| File | Skill |
|------|-------|
| `cloud-aws.md` | AWS: Lambda, ECS, RDS, S3, CloudFront, CDK |
| `cloud-gcp.md` | GCP: Cloud Run, BigQuery, Pub/Sub, Firebase |
| `cloud-azure.md` | Azure: Functions, AKS, Cosmos DB, AD B2C |
| `cloud-vercel.md` | Vercel: Edge Functions, KV, Blob, Analytics |
| `cloud-cloudflare.md` | Cloudflare: Workers, Pages, D1, R2, Durable Objects |
| `cloud-railway.md` | Railway: services, volumes, environments |
| `cloud-fly.md` | Fly.io: Machines, volumes, regions, secrets |
| `cloud-serverless.md` | Serverless: cold start, edge, global deployment |

#### DevOps & CI/CD (8)
| File | Skill |
|------|-------|
| `devops-docker.md` | Docker: multi-stage builds, compose, networking |
| `devops-kubernetes.md` | Kubernetes: deployments, services, ingress, Helm |
| `devops-github-actions.md` | GitHub Actions: workflows, caching, matrix, secrets |
| `devops-terraform.md` | Terraform: providers, modules, state, workspaces |
| `devops-pulumi.md` | Pulumi: TypeScript IaC, stacks, secrets |
| `devops-monitoring.md` | Monitoring: Prometheus, Grafana, Datadog, alerts |
| `devops-logging.md` | Logging: structured logs, Loki, ELK, OpenTelemetry |
| `devops-secrets.md` | Secrets: Vault, AWS Secrets Manager, .env patterns |

#### Architecture Patterns (8)
| File | Skill |
|------|-------|
| `arch-microservices.md` | Microservices: decomposition, service mesh, saga |
| `arch-monorepo.md` | Monorepo: Turborepo, Nx, workspace protocols |
| `arch-event-driven.md` | Event-driven: Kafka, RabbitMQ, event sourcing |
| `arch-cqrs.md` | CQRS + Event Sourcing: commands, queries, projections |
| `arch-ddd.md` | DDD: aggregates, bounded contexts, ubiquitous language |
| `arch-clean.md` | Clean architecture: use cases, ports, adapters |
| `arch-serverless.md` | Serverless: functions, queues, step functions |
| `arch-multi-tenant.md` | Multi-tenancy: isolation, RLS, shard-per-tenant |

#### Testing (5)
| File | Skill |
|------|-------|
| `test-unit.md` | Unit testing: Jest, Vitest, spies, mocks |
| `test-integration.md` | Integration: Supertest, MSW, Testcontainers |
| `test-e2e.md` | E2E: Playwright, Cypress, visual regression |
| `test-tdd.md` | TDD: red-green-refactor, test structure |
| `test-performance.md` | Perf testing: k6, Artillery, load patterns |

#### Business & SaaS (6)
| File | Skill |
|------|-------|
| `saas-billing.md` | SaaS billing: Stripe subscriptions, usage metering |
| `saas-onboarding.md` | Onboarding: flows, activation metrics, checklists |
| `saas-feature-flags.md` | Feature flags: LaunchDarkly, GrowthBook, rollouts |
| `saas-analytics.md` | Analytics: PostHog, Mixpanel, Amplitude, funnels |
| `saas-ab-testing.md` | A/B testing: experiment design, statistical significance |
| `saas-email.md` | Transactional email: Resend, SendGrid, templates |

#### SEO & Performance (4)
| File | Skill |
|------|-------|
| `perf-web-vitals.md` | Core Web Vitals: LCP, INP, CLS — measurement + fixes |
| `perf-bundle.md` | Bundle: code splitting, tree shaking, lazy load |
| `seo-technical.md` | Technical SEO: sitemaps, robots.txt, structured data |
| `seo-content.md` | Content SEO: keyword research, on-page, linking |

#### Developer Tooling (5)
| File | Skill |
|------|-------|
| `tooling-typescript.md` | TypeScript: strict config, generics, utility types |
| `tooling-eslint.md` | ESLint: rule config, custom rules, flat config |
| `tooling-biome.md` | Biome: formatting, linting, migration from Prettier |
| `tooling-git.md` | Git: branching strategies, hooks, conventional commits |
| `tooling-bun.md` | Bun: runtime, package manager, bundler, test runner |

#### Internationalization (2)
| File | Skill |
|------|-------|
| `i18n-nextjs.md` | i18n in Next.js: next-intl, routing, pluralization |
| `i18n-general.md` | ICU messages, RTL, locale detection, date/number format |

#### Payment & Commerce (2)
| File | Skill |
|------|-------|
| `payment-stripe.md` | Stripe: Elements, webhooks, subscriptions, Connect |
| `payment-lemonsqueezy.md` | Lemon Squeezy: licensing, variants, webhooks |

#### Documentation & Writing (2)
| File | Skill |
|------|-------|
| `writing-technical.md` | Technical writing: docs, ADRs, RFCs, runbooks |
| `writing-marketing.md` | Marketing copy: CRO, AIDA, brand voice |

---

**Total: 108 skills** across 18 domains

---

## Phase 2 — CLI Tool

### Tech Stack
- **Runtime**: Bun
- **Language**: TypeScript (strict)
- **CLI framework**: Commander.js
- **Binary name**: `ck`
- **npm package**: `claudekit-cli`

### Commands

| Command | Flags | Behavior |
|---------|-------|---------|
| `ck init` | `--kit engineer`, `--global/-g`, `--yes/-y`, `--exclude <pattern>`, `--version <v>` | Detect `.claude/` → diff → merge/overwrite per-file → copy files → write `.ck.json` |
| `ck new <name>` | `--kit engineer`, `--dir <path>` | mkdir → git init → ck init |
| `ck doctor` | `--fix`, `--report` | Check Claude Code installed, `.claude/` structure, `.ck.json`, `settings.json` |
| `ck versions` | — | List available kit versions |
| `ck update` | — | `npm install -g claudekit-cli@latest` |
| `ck uninstall` | — | Remove `.claude/`, `CLAUDE.md`, `docs/`, `plans/`, `journals/` |

---

## Implementation Order

```
Phase 1a — Config files
  kit/CLAUDE.md
  kit/.claude/settings.json
  kit/.claude/.ck.json + .ckignore

Phase 1b — Core + Fix + Plan commands (highest value)
  All 18 core commands
  All 6 fix commands
  All 9 plan commands

Phase 1c — Git + Docs + Content + Design + Integrate + Skill commands
  3 git, 3 docs, 4 content, 6 design, 2 integrate, 2 skill

Phase 1d — All 34 agents

Phase 1e — 108 skills in domain batches
  Frontend → Backend → APIs → DBs → Auth → UI
  Mobile → AI → Cloud → DevOps → Arch → Testing
  SaaS → SEO/Perf → Tooling → i18n → Payments → Writing

Phase 2a — CLI scaffold
  cli/package.json, tsconfig.json, src/index.ts

Phase 2b — Utils
  installer.ts, merger.ts, backup.ts, platform.ts

Phase 2c — CLI commands
  init.ts, new.ts, doctor.ts, versions.ts, update.ts, uninstall.ts

Phase 2d — Build + test
```

---

## Verification

1. `cd cli && bun run build` — compiles without errors
2. `ck --version` — prints version
3. `ck init` in blank project → full `.claude/` + `CLAUDE.md` + `docs/` + `plans/` created
4. `ck init -g` → installs to `~/.claude/` globally
5. Open Claude Code → `/ck-help` lists all commands
6. `/docs:init` → generates 7 files in `docs/`
7. `/plan add login page` → 3 researchers spawn, plan saved in `plans/`
8. `/fix:types` → runs typecheck, fixes all errors
9. `/design:screenshot path/to/mockup.png` → generates React components
10. `/skill:create https://docs.polar.sh/llms.txt` → creates polar skill file
11. `ck doctor` → reports healthy installation
12. `ck uninstall` → removes all files cleanly

---

## Command Count Summary

| Category | Count |
|----------|-------|
| Core | 18 |
| Fix | 6 |
| Plan | 9 |
| Git | 3 |
| Docs | 3 |
| Content | 4 |
| Design | 6 |
| Integrate | 2 |
| Skill | 2 |
| **Total** | **53** |

---

## References

- [ClaudeKit Docs](https://docs.claudekit.cc)
- [mrgoonie/claudekit-cli](https://github.com/mrgoonie/claudekit-cli)
- [mrgoonie/claudekit-skills](https://github.com/mrgoonie/claudekit-skills)
- [duthaho/claudekit](https://github.com/duthaho/claudekit)
- [carlrannaberg/claudekit](https://github.com/carlrannaberg/claudekit)
