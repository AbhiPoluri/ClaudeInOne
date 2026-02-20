import fs from "node:fs/promises";
import path from "node:path";

async function exists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

export async function backupPaths(baseDir: string, relativePaths: string[]): Promise<string | null> {
  const existing = [] as string[];
  for (const rel of relativePaths) {
    const full = path.join(baseDir, rel);
    if (await exists(full)) existing.push(rel);
  }

  if (existing.length === 0) return null;

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(baseDir, `.claude.backup.${stamp}`);
  await fs.mkdir(backupDir, { recursive: true });

  for (const rel of existing) {
    const src = path.join(baseDir, rel);
    const dest = path.join(backupDir, rel);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.cp(src, dest, { recursive: true, force: true });
  }

  return backupDir;
}
