const assert = require("node:assert/strict");
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join, resolve } = require("node:path");
const { test } = require("node:test");
const { resolveStudioDir } = require("./studio-path.cjs");

test("studio tools find current and legacy siblings and honor explicit overrides", (t) => {
  const workspace = mkdtempSync(join(tmpdir(), "hooky-paths-"));
  t.after(() => rmSync(workspace, { recursive: true, force: true }));
  const root = join(workspace, "Hooky-website");
  const options = { root, env: {} };
  const createStudio = (name) => {
    const path = join(workspace, name, "hooky", "web", "static");
    mkdirSync(path, { recursive: true });
    writeFileSync(join(path, "index.html"), "studio");
    return path;
  };
  assert.throws(() => resolveStudioDir(undefined, options), /HOOKY_STUDIO_DIR/);
  const legacy = createStudio("Hooky");
  assert.equal(resolveStudioDir(undefined, options), legacy);
  const current = createStudio("Hooky-engine");
  assert.equal(resolveStudioDir(undefined, options), current);
  const custom = createStudio("Custom Engine With Spaces");
  assert.equal(resolveStudioDir(undefined, { root, env: { HOOKY_STUDIO_DIR: custom } }), custom);
  assert.equal(resolveStudioDir(legacy, { root, env: { HOOKY_STUDIO_DIR: custom } }), legacy);
  assert.throws(() => resolveStudioDir(resolve(workspace, "missing"), options), /not found/);
  const previousCwd = process.cwd();
  try {
    process.chdir(workspace);
    assert.equal(resolveStudioDir("Custom Engine With Spaces/hooky/web/static", options), custom);
  } finally {
    process.chdir(previousCwd);
  }
});
