import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(scriptDir, "..");
const localKit = path.join(cliRoot, "kit");
const stateFile = path.join(cliRoot, ".pack-state.json");

async function main() {
  const stateRaw = await fs.readFile(stateFile, "utf8").catch(() => null);
  if (!stateRaw) return;

  const state = JSON.parse(stateRaw);

  if (state.restoreSymlinkTarget) {
    await fs.rm(localKit, { recursive: true, force: true });
    await fs.symlink(state.restoreSymlinkTarget, localKit, "dir");
  } else if (state.restoreMode === "delete-only") {
    await fs.rm(localKit, { recursive: true, force: true });
  }

  await fs.rm(stateFile, { force: true });
}

await main();
