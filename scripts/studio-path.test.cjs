const assert = require("node:assert/strict");
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join, resolve } = require("node:path");
const { test } = require("node:test");
const { resolveStudioDir } = require("./studio-assets.cjs");

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

for (const source of ["explicit", "environment"]) {
  test(`studio tools reject an index.html directory in an ${source} override`, (t) => {
    const workspace = mkdtempSync(join(tmpdir(), "hooky-paths-"));
    t.after(() => rmSync(workspace, { recursive: true, force: true }));
    const root = join(workspace, "Hooky-website");
    const invalid = join(workspace, "Invalid Studio");
    mkdirSync(join(invalid, "index.html"), { recursive: true });
    const valid = join(workspace, "Hooky-engine", "hooky", "web", "static");
    mkdirSync(valid, { recursive: true });
    writeFileSync(join(valid, "index.html"), "studio");
    const env = { HOOKY_STUDIO_DIR: source === "explicit" ? valid : invalid };

    assert.throws(() => resolveStudioDir(source === "explicit" ? invalid : undefined, { root, env }), {
      message: `Studio index.html not found. Checked: ${invalid}. Pass the static directory as an argument or set HOOKY_STUDIO_DIR.`,
    });
  });
}

test("studio tools skip an index.html directory in the preferred sibling", (t) => {
  const workspace = mkdtempSync(join(tmpdir(), "hooky-paths-"));
  t.after(() => rmSync(workspace, { recursive: true, force: true }));
  const root = join(workspace, "Hooky-website");
  const current = join(workspace, "Hooky-engine", "hooky", "web", "static");
  mkdirSync(join(current, "index.html"), { recursive: true });
  const legacy = join(workspace, "Hooky", "hooky", "web", "static");
  mkdirSync(legacy, { recursive: true });
  writeFileSync(join(legacy, "index.html"), "studio");

  assert.equal(resolveStudioDir(undefined, { root, env: {} }), legacy);
});

function resolverWithSimulatedFs(t, methods) {
  const fs = require("node:fs");
  for (const [name, implementation] of Object.entries({
    statSync: () => ({ isFile: () => true }),
    accessSync: () => {},
    ...methods,
  })) {
    t.mock.method(fs, name, implementation);
  }
  const modulePath = require.resolve("./studio-assets.cjs");
  delete require.cache[modulePath];
  t.after(() => { delete require.cache[modulePath]; });
  return require(modulePath).resolveStudioDir;
}

for (const source of ["explicit", "environment"]) {
  test(`studio tools fail closed on simulated EACCES read-open denial in an ${source} override`, (t) => {
    const root = resolve("simulated-website");
    const denied = resolve("simulated-denied-studio");
    const opened = [];
    const closed = [];
    const resolveWithDenial = resolverWithSimulatedFs(t, {
      openSync: (path, flags) => {
        opened.push([path, flags]);
        throw Object.assign(new Error("Simulated read-open denial; not a Windows ACL reproduction"), { code: "EACCES" });
      },
      closeSync: (fd) => closed.push(fd),
    });
    const env = { HOOKY_STUDIO_DIR: source === "explicit" ? resolve("simulated-valid-studio") : denied };

    assert.throws(() => resolveWithDenial(source === "explicit" ? denied : undefined, { root, env }), {
      message: `Studio index.html not found. Checked: ${denied}. Pass the static directory as an argument or set HOOKY_STUDIO_DIR.`,
    });
    assert.deepEqual(opened, [[resolve(denied, "index.html"), "r"]]);
    assert.deepEqual(closed, []);
  });
}

test("studio tools fall back after simulated preferred-sibling EACCES read-open denial", (t) => {
  const root = resolve("simulated-website");
  const preferred = resolve(root, "../Hooky-engine/hooky/web/static");
  const legacy = resolve(root, "../Hooky/hooky/web/static");
  const opened = [];
  const closed = [];
  const resolveWithDenial = resolverWithSimulatedFs(t, {
    openSync: (path, flags) => {
      opened.push([path, flags]);
      if (path === resolve(preferred, "index.html")) {
        throw Object.assign(new Error("Simulated read-open denial"), { code: "EACCES" });
      }
      return 0;
    },
    fstatSync: (fd) => {
      assert.equal(fd, 0);
      return { isFile: () => true };
    },
    closeSync: (fd) => closed.push(fd),
  });

  assert.equal(resolveWithDenial(undefined, { root, env: {} }), legacy);
  assert.deepEqual(opened, [[resolve(preferred, "index.html"), "r"], [resolve(legacy, "index.html"), "r"]]);
  assert.deepEqual(closed, [0]);
});

for (const outcome of ["regular file", "directory", "fstat error", "close error"]) {
  test(`studio tools close simulated descriptor 0 on ${outcome}`, (t) => {
    const configured = resolve("simulated-studio");
    const closed = [];
    const inspected = [];
    const resolveWithDescriptor = resolverWithSimulatedFs(t, {
      openSync: () => 0,
      fstatSync: (fd) => {
        inspected.push(fd);
        if (outcome === "fstat error") throw Object.assign(new Error("Simulated fstat failure"), { code: "EIO" });
        return { isFile: () => outcome !== "directory" };
      },
      closeSync: (fd) => {
        closed.push(fd);
        if (outcome === "close error") throw Object.assign(new Error("Simulated close failure"), { code: "EIO" });
      },
    });
    const options = { env: {} };

    if (outcome === "regular file") {
      assert.equal(resolveWithDescriptor(configured, options), configured);
    } else {
      assert.throws(() => resolveWithDescriptor(configured, options), {
        message: `Studio index.html not found. Checked: ${configured}. Pass the static directory as an argument or set HOOKY_STUDIO_DIR.`,
      });
    }
    assert.deepEqual(inspected, [0]);
    assert.deepEqual(closed, [0]);
  });
}
