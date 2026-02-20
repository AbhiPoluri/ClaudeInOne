import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

export interface DoctorOptions {
  fix?: boolean;
  report?: boolean;
}

interface CheckResult {
  name: string;
  ok: boolean;
  details?: string;
}

const execFileAsync = promisify(execFile);

async function exists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

export async function runDoctor(options: DoctorOptions): Promise<void> {
  const cwd = process.cwd();
  const checks: CheckResult[] = [];
  const issues: string[] = [];

  try {
    await execFileAsync("claude", ["--version"], { timeout: 5_000 });
    checks.push({ name: "claude executable", ok: true });
  } catch {
    checks.push({ name: "claude executable", ok: false, details: "Claude Code CLI is not available in PATH." });
    issues.push("Install Claude Code CLI and ensure `claude --version` works.");
  }

  const claudeDir = path.join(cwd, ".claude");
  const hasClaudeDir = await exists(claudeDir);
  checks.push({ name: ".claude directory", ok: hasClaudeDir });

  const required = [
    path.join(claudeDir, "commands"),
    path.join(claudeDir, "agents"),
    path.join(claudeDir, "skills"),
    path.join(claudeDir, "settings.json"),
    path.join(claudeDir, ".ck.json")
  ];

  for (const req of required) {
    checks.push({ name: path.relative(cwd, req), ok: await exists(req) });
  }

  const rootRequired = [
    path.join(cwd, "CLAUDE.md"),
    path.join(cwd, "docs"),
    path.join(cwd, "plans"),
    path.join(cwd, "journals")
  ];
  for (const req of rootRequired) {
    checks.push({ name: path.relative(cwd, req), ok: await exists(req) });
  }

  if (options.fix) {
    await fs.mkdir(path.join(claudeDir, "commands"), { recursive: true });
    await fs.mkdir(path.join(claudeDir, "agents"), { recursive: true });
    await fs.mkdir(path.join(claudeDir, "skills"), { recursive: true });
    await fs.mkdir(path.join(cwd, "docs"), { recursive: true });
    await fs.mkdir(path.join(cwd, "plans"), { recursive: true });
    await fs.mkdir(path.join(cwd, "journals"), { recursive: true });

    const ckJson = path.join(claudeDir, ".ck.json");
    if (!(await exists(ckJson))) {
      await fs.writeFile(ckJson, JSON.stringify({ version: "1.0.0", kit: "claudeinone" }, null, 2) + "\n", "utf8");
    }

    const settings = path.join(claudeDir, "settings.json");
    if (!(await exists(settings))) {
      await fs.writeFile(settings, JSON.stringify({ hooks: { preTool: [], postTool: [] }, permissions: { default: "ask", allow: [] } }, null, 2) + "\n", "utf8");
    }

    const claudeMd = path.join(cwd, "CLAUDE.md");
    if (!(await exists(claudeMd))) {
      await fs.writeFile(claudeMd, "# ClaudeInOne\n", "utf8");
    }
  }

  const failed = checks.filter((c) => !c.ok);
  if (options.report) {
    console.log(JSON.stringify({ ok: failed.length === 0, checks, issues }, null, 2));
    return;
  }

  for (const check of checks) {
    console.log(`${check.ok ? "OK" : "FAIL"}  ${check.name}`);
  }

  if (failed.length > 0) {
    console.log("Doctor found issues. Re-run with --fix to repair basic structure.");
    process.exitCode = 1;
  } else {
    console.log("Doctor check passed.");
  }
}
