import path from "node:path";
import os from "node:os";
export function getGlobalClaudeDir() {
    if (process.platform === "win32") {
        const base = process.env.LOCALAPPDATA ?? path.join(os.homedir(), "AppData", "Local");
        return path.join(base, ".claude");
    }
    return path.join(os.homedir(), ".claude");
}
