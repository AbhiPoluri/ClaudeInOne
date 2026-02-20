import fs from "node:fs/promises";
import path from "node:path";

function normalizePatterns(patterns: string[]): string[] {
  return patterns.map((p) => p.trim()).filter(Boolean);
}

function shouldSkip(relPath: string, patterns: string[]): boolean {
  const p = relPath.replaceAll("\\", "/");
  return patterns.some((pattern) => {
    const v = pattern.replaceAll("\\", "/");
    return p === v || p.startsWith(`${v}/`) || path.basename(p) === v;
  });
}

async function readIgnoreFile(kitRoot: string): Promise<string[]> {
  const ignorePath = path.join(kitRoot, ".claude", ".ckignore");
  try {
    const raw = await fs.readFile(ignorePath, "utf8");
    return raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
  } catch {
    return [];
  }
}

async function copyRecursive(srcRoot: string, currentSrc: string, destRoot: string, patterns: string[]): Promise<void> {
  const entries = await fs.readdir(currentSrc, { withFileTypes: true });
  for (const entry of entries) {
    const src = path.join(currentSrc, entry.name);
    const rel = path.relative(srcRoot, src);
    if (shouldSkip(rel, patterns)) continue;

    const dest = path.join(destRoot, rel);
    if (entry.isDirectory()) {
      await fs.mkdir(dest, { recursive: true });
      await copyRecursive(srcRoot, src, destRoot, patterns);
    } else if (entry.isFile() || entry.isSymbolicLink()) {
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.cp(src, dest, { force: true, dereference: false });
    }
  }
}

export interface InstallOptions {
  kitRoot: string;
  destinationRoot: string;
  sourceSubdir?: string;
  extraExcludes?: string[];
  skipPaths?: string[];
}

export async function installKit(options: InstallOptions): Promise<void> {
  const sourceRoot = options.sourceSubdir
    ? path.join(options.kitRoot, options.sourceSubdir)
    : options.kitRoot;
  const ignores = await readIgnoreFile(options.kitRoot);
  const patterns = normalizePatterns([...(options.extraExcludes ?? []), ...(options.skipPaths ?? []), ...ignores]);
  await fs.mkdir(options.destinationRoot, { recursive: true });
  await copyRecursive(sourceRoot, sourceRoot, options.destinationRoot, patterns);
}
