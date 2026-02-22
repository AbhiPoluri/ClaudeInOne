import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(scriptDir, "..");
const sourceKit = path.resolve(cliRoot, "..", "kit");
const localKit = path.join(cliRoot, "kit");
const stateFile = path.join(cliRoot, ".pack-state.json");

async function main() {
  const sourceStat = await fs.stat(sourceKit).catch(() => null);
  if (!sourceStat?.isDirectory()) {
    throw new Error(`Missing source kit directory at ${sourceKit}`);
  }

  const localStat = await fs.lstat(localKit).catch(() => null);
  if (localStat?.isSymbolicLink()) {
    const linkTarget = await fs.readlink(localKit);
    await fs.rm(localKit, { recursive: true, force: true });
    await fs.cp(sourceKit, localKit, { recursive: true, force: true });
    await fs.writeFile(
      stateFile,
      JSON.stringify({ restoreSymlinkTarget: linkTarget }, null, 2) + "\n",
      "utf8"
    );
    return;
  }

  if (!localStat) {
    await fs.cp(sourceKit, localKit, { recursive: true, force: true });
    await fs.writeFile(
      stateFile,
      JSON.stringify({ restoreMode: "delete-only" }, null, 2) + "\n",
      "utf8"
    );
  }
}

await main();
