import { spawn } from "node:child_process";

export async function runUpdate(): Promise<void> {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  await new Promise<void>((resolve, reject) => {
    const child = spawn(npmCommand, ["install", "-g", "claudekit-cli@latest"], {
      stdio: "inherit"
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`npm exited with code ${code ?? "unknown"}`));
    });
  });
  console.log("ClaudeKit CLI updated to latest.");
}
