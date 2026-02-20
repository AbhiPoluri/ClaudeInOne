import fs from "node:fs/promises";
import path from "node:path";
import { getGlobalClaudeDir } from "../utils/platform.js";
async function removeIfExists(target) {
    await fs.rm(target, { recursive: true, force: true });
}
export async function runUninstall(options) {
    const root = options.global ? getGlobalClaudeDir() : process.cwd();
    if (options.global) {
        await removeIfExists(path.join(root, "commands"));
        await removeIfExists(path.join(root, "agents"));
        await removeIfExists(path.join(root, "skills"));
        await removeIfExists(path.join(root, "settings.json"));
        await removeIfExists(path.join(root, ".ck.json"));
        await removeIfExists(path.join(root, ".ckignore"));
        console.log(`Removed ClaudeKit global files from ${root}`);
        return;
    }
    await removeIfExists(path.join(root, ".claude"));
    await removeIfExists(path.join(root, "CLAUDE.md"));
    await removeIfExists(path.join(root, "docs"));
    await removeIfExists(path.join(root, "plans"));
    await removeIfExists(path.join(root, "journals"));
    console.log(`Removed ClaudeKit files from ${root}`);
}
