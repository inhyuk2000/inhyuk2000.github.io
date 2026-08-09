import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function run(command, args, opts = {}) {
  const child = spawn(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: true,
    ...opts,
  });
  return child;
}

// Ensure context exists before servers start
const prep = run("node", ["scripts/build-agent-context.mjs"]);
await new Promise((resolve, reject) => {
  prep.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`agent-context exit ${code}`))));
});

const api = run("node", ["scripts/local-agent-api.mjs"]);
const hugo = run("hugo", ["server", "--disableFastRender"]);

function shutdown() {
  api.kill("SIGTERM");
  hugo.kill("SIGTERM");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

hugo.on("exit", (code) => {
  api.kill("SIGTERM");
  process.exit(code ?? 0);
});
api.on("exit", (code) => {
  if (code && code !== 0) {
    console.error(`[dev] agent-api exited with ${code}`);
  }
});
