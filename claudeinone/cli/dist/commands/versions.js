import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const execFileAsync = promisify(execFile);
async function readJson(filePath) {
    try {
        return JSON.parse(await fs.readFile(filePath, "utf8"));
    }
    catch {
        return null;
    }
}
export async function runVersions() {
    const filePath = fileURLToPath(import.meta.url);
    const cliRoot = path.resolve(path.dirname(filePath), "..", "..");
    const pkg = await readJson(path.join(cliRoot, "package.json"));
    const kit = await readJson(path.join(cliRoot, "kit", ".claude", ".ck.json"));
    console.log(`cli-installed: ${pkg?.version ?? "unknown"}`);
    console.log(`kit-bundled: ${kit?.version ?? "unknown"}`);
    try {
        const { stdout } = await execFileAsync("npm", ["view", "claudeinone-cli", "versions", "--json"], { timeout: 10_000 });
        const parsed = JSON.parse(stdout.trim());
        const versions = Array.isArray(parsed) ? parsed : [parsed];
        const latest = versions[versions.length - 1];
        console.log(`registry-latest: ${latest}`);
        console.log("registry-versions:");
        for (const version of versions.slice(-15)) {
            console.log(` - ${version}`);
        }
    }
    catch {
        console.log("registry-latest: unavailable");
    }
}
