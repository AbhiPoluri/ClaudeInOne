import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { runInit } from "./init.js";
const execFileAsync = promisify(execFile);
export async function runNew(name, options) {
    const baseDir = options.dir ? path.resolve(options.dir) : process.cwd();
    const projectDir = path.join(baseDir, name);
    await fs.mkdir(projectDir, { recursive: true });
    try {
        await execFileAsync("git", ["init"], { cwd: projectDir });
    }
    catch {
        // Git init is best-effort.
    }
    const previousCwd = process.cwd();
    process.chdir(projectDir);
    try {
        await runInit({ kit: options.kit, yes: true });
    }
    finally {
        process.chdir(previousCwd);
    }
    console.log(`Created new ClaudeInOne project at ${projectDir}`);
}
