import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { installKit } from "../utils/installer.js";
import { getFileDiffs } from "../utils/merger.js";
import { backupPaths } from "../utils/backup.js";
import { getGlobalClaudeDir } from "../utils/platform.js";
async function readKitVersion(kitRoot) {
    const configPath = path.join(kitRoot, ".claude", ".ck.json");
    const raw = await fs.readFile(configPath, "utf8");
    const parsed = JSON.parse(raw);
    return parsed.version ?? "1.0.0";
}
async function resolveConflictActions(conflicts) {
    const skipPaths = new Set();
    if (conflicts.length === 0)
        return skipPaths;
    const rl = readline.createInterface({ input, output });
    let overwriteAll = false;
    let skipAll = false;
    try {
        for (const rel of conflicts) {
            if (overwriteAll)
                continue;
            if (skipAll) {
                skipPaths.add(rel);
                continue;
            }
            const answer = (await rl.question(`Conflict: ${rel}\nChoose [o]verwrite, [s]kip, overwrite [a]ll, skip a[l]l (default: s): `))
                .trim()
                .toLowerCase();
            if (answer === "a") {
                overwriteAll = true;
            }
            else if (answer === "l") {
                skipAll = true;
                skipPaths.add(rel);
            }
            else if (answer === "o") {
                // overwrite this file
            }
            else {
                skipPaths.add(rel);
            }
        }
    }
    finally {
        rl.close();
    }
    return skipPaths;
}
export async function runInit(options) {
    const filePath = fileURLToPath(import.meta.url);
    const cliRoot = path.resolve(path.dirname(filePath), "..", "..");
    const kitRoot = path.join(cliRoot, "kit");
    const targetRoot = options.global ? getGlobalClaudeDir() : process.cwd();
    if (options.global) {
        const globalClaudeDir = getGlobalClaudeDir();
        const diffs = await getFileDiffs(path.join(kitRoot, ".claude"), globalClaudeDir);
        const conflicts = diffs.filter((d) => d.targetExists && !d.identical).map((d) => d.relPath);
        let skipPaths = new Set();
        if (conflicts.length > 0 && !options.yes) {
            console.log(`Detected ${conflicts.length} changed global file conflicts.`);
            skipPaths = await resolveConflictActions(conflicts);
        }
        if (conflicts.length > 0 && skipPaths.size < conflicts.length) {
            const backup = await backupPaths(globalClaudeDir, ["."]);
            if (backup)
                console.log(`Backup created at ${backup}`);
        }
        await installKit({
            kitRoot,
            destinationRoot: globalClaudeDir,
            sourceSubdir: ".claude",
            extraExcludes: options.exclude ?? [],
            skipPaths: [...skipPaths]
        });
        console.log(`Installed global kit at ${globalClaudeDir}`);
        return;
    }
    const diffs = await getFileDiffs(kitRoot, targetRoot);
    const conflicts = diffs.filter((d) => d.targetExists && !d.identical).map((d) => d.relPath);
    let skipPaths = new Set();
    if (conflicts.length > 0 && !options.yes) {
        console.log(`Detected ${conflicts.length} local file conflicts.`);
        skipPaths = await resolveConflictActions(conflicts);
    }
    if (conflicts.length > 0 && skipPaths.size < conflicts.length) {
        const backup = await backupPaths(targetRoot, [".claude", "CLAUDE.md", "docs", "plans", "journals"]);
        if (backup)
            console.log(`Backup created at ${backup}`);
    }
    await installKit({
        kitRoot,
        destinationRoot: targetRoot,
        extraExcludes: options.exclude ?? [],
        skipPaths: [...skipPaths]
    });
    const version = options.version ?? (await readKitVersion(kitRoot));
    await fs.mkdir(path.join(targetRoot, ".claude"), { recursive: true });
    await fs.writeFile(path.join(targetRoot, ".claude", ".ck.json"), JSON.stringify({ version, kit: options.kit }, null, 2) + "\n", "utf8");
    console.log(`Installed ClaudeInOne (${options.kit}) v${version} in ${targetRoot}`);
}
