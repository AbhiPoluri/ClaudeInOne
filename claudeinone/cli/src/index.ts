#!/usr/bin/env node
import { Command } from "commander";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runInit } from "./commands/init.js";
import { runNew } from "./commands/new.js";
import { runDoctor } from "./commands/doctor.js";
import { runVersions } from "./commands/versions.js";
import { runUpdate } from "./commands/update.js";
import { runUninstall } from "./commands/uninstall.js";

const program = new Command();

function resolveCliVersion(): string {
  try {
    const thisFile = fileURLToPath(import.meta.url);
    const packageJsonPath = path.join(path.dirname(thisFile), "..", "package.json");
    const raw = fs.readFileSync(packageJsonPath, "utf8");
    const parsed = JSON.parse(raw) as { version?: string };
    return parsed.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

program.name("co").description("ClaudeInOne CLI").version(resolveCliVersion());

program
  .command("init")
  .option("--kit <kit>", "kit name", "claudeinone")
  .option("-g, --global", "install globally into ~/.claude")
  .option("-y, --yes", "overwrite without interactive prompts")
  .option("--exclude <pattern...>", "extra files/directories to exclude")
  .option("--version <version>", "override kit version metadata")
  .action(async (opts) => {
    await runInit({
      kit: opts.kit,
      global: Boolean(opts.global),
      yes: Boolean(opts.yes),
      exclude: opts.exclude,
      version: opts.version
    });
  });

program
  .command("new <name>")
  .option("--kit <kit>", "kit name", "claudeinone")
  .option("--dir <path>", "base directory")
  .action(async (name, opts) => {
    await runNew(name, { kit: opts.kit, dir: opts.dir });
  });

program
  .command("doctor")
  .option("--fix", "repair basic structure")
  .option("--report", "emit JSON report")
  .action(async (opts) => {
    await runDoctor({ fix: Boolean(opts.fix), report: Boolean(opts.report) });
  });

program.command("versions").action(async () => runVersions());
program.command("update").action(async () => runUpdate());
program
  .command("uninstall")
  .option("-g, --global", "remove global install")
  .action(async (opts) => runUninstall({ global: Boolean(opts.global) }));

program.parseAsync(process.argv);
