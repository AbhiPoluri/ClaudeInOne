import fs from "node:fs/promises";
import path from "node:path";

export interface FileDiff {
  relPath: string;
  targetExists: boolean;
  identical: boolean;
}

async function collectFiles(base: string, cursor = ""): Promise<string[]> {
  const root = path.join(base, cursor);
  const entries = await fs.readdir(root, { withFileTypes: true }).catch(() => []);
  const out: string[] = [];

  for (const entry of entries) {
    const rel = path.join(cursor, entry.name);
    const full = path.join(base, rel);
    if (entry.isDirectory()) {
      out.push(...(await collectFiles(base, rel)));
    } else if (entry.isFile()) {
      out.push(rel);
    } else {
      const stat = await fs.stat(full);
      if (stat.isFile()) out.push(rel);
    }
  }

  return out;
}

async function isSameFile(sourcePath: string, targetPath: string): Promise<boolean> {
  try {
    const [a, b] = await Promise.all([fs.readFile(sourcePath), fs.readFile(targetPath)]);
    return a.equals(b);
  } catch {
    return false;
  }
}

export async function getFileDiffs(sourceRoot: string, targetRoot: string): Promise<FileDiff[]> {
  const srcFiles = await collectFiles(sourceRoot);
  const diffs: FileDiff[] = [];

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
    } catch {
      diffs.push({ relPath: rel, targetExists: false, identical: false });
    }
  }

  return diffs.sort((a, b) => a.relPath.localeCompare(b.relPath));
}

export async function findConflicts(sourceRoot: string, targetRoot: string): Promise<string[]> {
  const diffs = await getFileDiffs(sourceRoot, targetRoot);
  return diffs.filter((d) => d.targetExists && !d.identical).map((d) => d.relPath);
}
