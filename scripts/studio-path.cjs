const { existsSync } = require("node:fs");
const { resolve } = require("node:path");

function resolveStudioDir(explicit, { root = resolve(__dirname, ".."), env = process.env } = {}) {
  const configured = explicit || env.HOOKY_STUDIO_DIR;
  const candidates = configured
    ? [resolve(configured)]
    : ["../Hooky-engine/hooky/web/static", "../Hooky/hooky/web/static"].map((path) => resolve(root, path));
  const destination = candidates.find((path) => existsSync(resolve(path, "index.html")));
  if (!destination) {
    throw new Error(`Studio index.html not found. Checked: ${candidates.join(", ")}. Pass the static directory as an argument or set HOOKY_STUDIO_DIR.`);
  }
  return destination;
}

module.exports = { resolveStudioDir };
