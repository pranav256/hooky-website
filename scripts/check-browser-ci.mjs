import { spawn, spawnSync } from "node:child_process";
import { createWriteStream, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import studioPaths from "./studio-path.cjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const engine = resolve(studioPaths.resolveStudioDir(process.argv[2]), "../../..");
const require = createRequire(import.meta.url);
const isolated = mkdtempSync(resolve(tmpdir(), "hooky-browser-"));
const artifacts = resolve(root, ".design-review");
mkdirSync(artifacts, { recursive: true });
writeFileSync(resolve(isolated, ".env"), "GEMINI_API_KEY=\n");
writeFileSync(resolve(isolated, "channels.txt"), "");
writeFileSync(resolve(isolated, "links.txt"), "");
const children = [];
const logs = [];
const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) =>
  !/KEY|TOKEN|PASSWORD|SECRET|^HOOKY_|^STATE_DIR$|^OUTPUT_DIR$|^CHANNELS_FILE$|^LINKS_FILE$|^IG_/i.test(key)));
const freePort = async () => {
  const server = createServer();
  await new Promise((accept, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", accept); });
  const port = server.address().port;
  await new Promise((accept) => server.close(accept));
  return port;
};
const start = (command, args, cwd, env, label) => {
  const log = createWriteStream(resolve(artifacts, `${label}.log`));
  logs.push(log);
  const child = spawn(command, args, { cwd, env, detached: process.platform !== "win32", windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
  child.stdout.pipe(log, { end: false });
  child.stderr.pipe(log, { end: false });
  // Save a rejection handler immediately: a missing binary must not leave a server behind.
  child.done = new Promise((accept, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => code === 0 ? accept() : reject(new Error(`${label} exited (${code ?? signal}); see ${label}.log`)));
  });
  child.done.catch(() => {});
  children.push(child);
  return child;
};
const ready = async (url, child) => {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null || child.signalCode) await child.done;
    try { if ((await fetch(url, { signal: AbortSignal.timeout(1000) })).ok) return; } catch { /* still starting */ }
    await new Promise((accept) => setTimeout(accept, 250));
  }
  throw new Error(`Server did not become ready within 60s: ${url}`);
};
try {
  const websitePort = await freePort();
  const studioPort = await freePort();
  const website = `http://127.0.0.1:${websitePort}`;
  const studio = `http://127.0.0.1:${studioPort}`;
  const env = { ...cleanEnv, WEBSITE_URL: website, STUDIO_URL: studio };
  const web = start(process.execPath, [require.resolve("next/dist/bin/next"), "start", "-H", "127.0.0.1", "-p", String(websitePort)], root, env, "website-server");
  const python = process.env.ENGINE_PYTHON || resolve(engine, process.platform === "win32" ? ".venv/Scripts/python.exe" : ".venv/bin/python");
  const api = start(python, ["-m", "uvicorn", "hooky.web.server:app", "--host", "127.0.0.1", "--port", String(studioPort)], engine, {
    ...env, HOOKY_PROJECT_ROOT: isolated, HOOKY_SETTINGS_SNAPSHOT: "1", GEMINI_API_KEY: "", IG_PASSWORD: "",
    STATE_DIR: resolve(isolated, "state"), OUTPUT_DIR: resolve(isolated, "output"),
    CHANNELS_FILE: resolve(isolated, "channels.txt"), LINKS_FILE: resolve(isolated, "links.txt"),
  }, "studio-server");
  await Promise.all([ready(website, web), ready(studio, api)]);
  for (const script of ["check-ui", "check-improvements", "check-studio-workflow", "check-studio-features"]) {
    console.log(`Running ${script} against production website and isolated Studio`);
    await start(process.execPath, [resolve(root, `scripts/${script}.mjs`)], root, env, script).done;
  }
  console.log("Passed all browser checks; logs retained in .design-review.");
} finally {
  for (const child of children.reverse()) {
    if (!child.pid || child.exitCode !== null || child.signalCode) continue;
    if (process.platform === "win32") spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { windowsHide: true, stdio: "ignore" });
    else { try { process.kill(-child.pid, "SIGKILL"); } catch (error) { if (error.code !== "ESRCH") throw error; } }
    await child.done.catch(() => {});
  }
  for (const log of logs) await new Promise((accept) => log.end(accept));
  const cleanupTarget = relative(resolve(tmpdir()), resolve(isolated));
  if (!cleanupTarget || cleanupTarget.startsWith("..") || isAbsolute(cleanupTarget)) throw new Error("Refusing cleanup outside the temporary directory");
  rmSync(isolated, { recursive: true, force: true });
}
