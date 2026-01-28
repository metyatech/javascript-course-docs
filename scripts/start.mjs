import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const rawArgs = process.argv.slice(2);
let port = process.env.PORT;
const extraArgs = [];

for (let i = 0; i < rawArgs.length; i += 1) {
  const arg = rawArgs[i];
  if (arg === "--port" || arg === "-p") {
    const next = rawArgs[i + 1];
    if (next) {
      port = next;
      i += 1;
    }
    continue;
  }
  if (arg.startsWith("--port=")) {
    port = arg.split("=", 2)[1];
    continue;
  }
  extraArgs.push(arg);
}

if (!port) {
  port = "3000";
}

const isWindows = process.platform === "win32";
const extra = extraArgs.length > 0 ? ` ${extraArgs.join(" ")}` : "";

const require = createRequire(import.meta.url);
const detectPort = require("detect-port");

const desiredPort = port;
port = String(await detectPort({ port: Number(port) }));
if (port !== desiredPort) {
  console.log(`[start] Port ${desiredPort} is busy. Using ${port} instead.`);
}

const docsCmd = `npm run start:docusaurus -- --port ${port}${extra}`;
const serverCmd = "npm run server";

const spawnCommand = (command, stdio = "inherit") => {
  if (isWindows) {
    return spawn("cmd.exe", ["/d", "/s", "/c", command], { stdio });
  }
  return spawn("sh", ["-c", command], { stdio });
};

const docsProcess = spawnCommand(docsCmd, "inherit");
const serverProcess = spawnCommand(serverCmd, ["ignore", "inherit", "inherit"]);

let hasExited = false;

const shutdown = (code) => {
  if (hasExited) return;
  hasExited = true;
  try {
    docsProcess.kill();
  } catch {}
  try {
    serverProcess.kill();
  } catch {}
  process.exit(code ?? 1);
};

docsProcess.on("exit", (code) => shutdown(code));
serverProcess.on("exit", (code) => shutdown(code));
