import fs from "node:fs/promises";
import path from "node:path";
async function collectFiles(base, cursor = "") {
    const root = path.join(base, cursor);
    const entries = await fs.readdir(root, { withFileTypes: true }).catch(() => []);
    const out = [];
    for (const entry of entries) {
        const rel = path.join(cursor, entry.name);
        const full = path.join(base, rel);
        if (entry.isDirectory()) {
            out.push(...(await collectFiles(base, rel)));
        }
        else if (entry.isFile()) {
            out.push(rel);
        }
        else {
            const stat = await fs.stat(full);
            if (stat.isFile())
                out.push(rel);
        }
    }
    return out;
}
async function isSameFile(sourcePath, targetPath) {
    try {
        const [a, b] = await Promise.all([fs.readFile(sourcePath), fs.readFile(targetPath)]);
        return a.equals(b);
    }
    catch {
        return false;
    }
}
export async function getFileDiffs(sourceRoot, targetRoot) {
    const srcFiles = await collectFiles(sourceRoot);
    const diffs = [];
    for (const rel of srcFiles) {
        const target = path.join(targetRoot, rel);
        try {
            const stat = await fs.stat(target);
            if (!stat.isFile()) {
                diffs.push({ relPath: rel, targetExists: true, identical: false });
                continue;
            }
            const source = path.join(sourceRoot, rel);
            diffs.push({ relPath: rel, targetExists: true, identical: await isSameFile(source, target) });
        }
        catch {
            diffs.push({ relPath: rel, targetExists: false, identical: false });
        }
    }
    return diffs.sort((a, b) => a.relPath.localeCompare(b.relPath));
}
export async function findConflicts(sourceRoot, targetRoot) {
    const diffs = await getFileDiffs(sourceRoot, targetRoot);
    return diffs.filter((d) => d.targetExists && !d.identical).map((d) => d.relPath);
}
