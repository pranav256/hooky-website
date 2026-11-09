import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import studioPaths from "./studio-path.cjs";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destination = studioPaths.resolveStudioDir(process.argv[2]);
const result = spawnSync(process.execPath, [
  require.resolve("tailwindcss/lib/cli.js"),
  "-c", resolve(root, "studio.tailwind.config.cjs"),
  "-i", resolve(destination, "tailwind-source.css"),
  "-o", resolve(destination, "studio-tailwind.css"),
  "--minify",
], {
  cwd: root,
  env: { ...process.env, HOOKY_STUDIO_DIR: destination },
  stdio: "inherit",
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
