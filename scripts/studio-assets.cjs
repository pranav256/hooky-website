const { spawnSync } = require("node:child_process");
const { closeSync, copyFileSync, fstatSync, openSync } = require("node:fs");
const { resolve } = require("node:path");

const websiteRoot = resolve(__dirname, "..");

function resolveStudioDir(explicit, { root = websiteRoot, env = process.env } = {}) {
  const configured = explicit || env.HOOKY_STUDIO_DIR;
  const candidates = configured
    ? [resolve(configured)]
    : ["../Hooky-engine/hooky/web/static", "../Hooky/hooky/web/static"].map((path) => resolve(root, path));
  const destination = candidates.find((path) => {
    try {
      const descriptor = openSync(resolve(path, "index.html"), "r");
      try {
        return fstatSync(descriptor).isFile();
      } finally {
        closeSync(descriptor);
      }
    } catch {
      return false;
    }
  });
  if (!destination) {
    throw new Error(`Studio index.html not found. Checked: ${candidates.join(", ")}. Pass the static directory as an argument or set HOOKY_STUDIO_DIR.`);
  }
  return destination;
}

if (require.main === module) {
  const [action, directory] = process.argv.slice(2);
  if (action !== "sync" && action !== "css") {
    throw new Error("Usage: node scripts/studio-assets.cjs <sync|css> [Studio static directory]");
  }
  const destination = resolveStudioDir(directory);
  if (action === "sync") {
    for (const file of ["brand.css", "favicon.svg"]) {
      copyFileSync(resolve(websiteRoot, "public", file), resolve(destination, file));
    }
    console.log(`Hooky brand synced to ${destination}`);
  } else {
    const result = spawnSync(process.execPath, [
      require.resolve("tailwindcss/lib/cli.js"),
      "-c", resolve(websiteRoot, "studio.tailwind.config.cjs"),
      "-i", resolve(destination, "tailwind-source.css"),
      "-o", resolve(destination, "studio-tailwind.css"),
      "--minify",
    ], {
      cwd: websiteRoot,
      env: { ...process.env, HOOKY_STUDIO_DIR: destination },
      stdio: "inherit",
    });
    if (result.error) throw result.error;
    process.exitCode = result.status ?? 1;
  }
}

module.exports = { resolveStudioDir };
