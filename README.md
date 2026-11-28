<p align="center">
  <img src="public/favicon.svg" width="56" height="56" alt="Hooky logo">
</p>

<h1 align="center">Hooky website</h1>

<p align="center">
  <strong>A first look at the good parts.</strong><br>
  The landing page, searchable docs, and interactive Studio demo for Hooky.
</p>

<p align="center">
  <a href="https://hoooky.vercel.app">Visit the site</a> &middot;
  <a href="#run-locally">Run locally</a> &middot;
  <a href="https://github.com/pranav256/Hooky-engine">Engine source</a>
</p>

Built with Next.js 15, React 19, and TypeScript. The website introduces the workflow; the sample Studio uses illustrative content. Actual analysis and exports run in the authenticated local [Hooky Engine](https://github.com/pranav256/Hooky-engine).

## Run locally

Use Node.js 20, matching CI:

```sh
npm ci
npm run dev
```

Open **http://localhost:3000**. Set `NEXT_PUBLIC_SITE_URL` to your deployment's canonical URL when hosting elsewhere.

## Find your way around

| Area | What lives there |
| --- | --- |
| `src/app/page.tsx` | Landing page and product introduction |
| `src/app/docs/page.tsx` | Searchable setup and workflow documentation |
| `src/components/` | Site chrome, hero preview, and sample Studio |
| `public/brand.css` | Shared Ember colors and design values |
| `scripts/studio-assets.cjs` | Copies shared assets and compiles Studio styles |

Both apps use system fonts. Studio styles are compiled as CSS (Cascading Style Sheets). Image sources, sample-content notes, icon licenses, and theme attribution live in [public/SOURCES.md](public/SOURCES.md).

## Working with the engine

The website and local Studio are separate apps:

| App | Default address | Purpose |
| --- | --- | --- |
| This website | `http://localhost:3000` | Explore the product, docs, and sample editor |
| Hooky Engine Studio | `http://127.0.0.1:8000` | Analyze your sources and export real clips |

To try a real clip, follow the [engine quick start](https://github.com/pranav256/Hooky-engine#quick-start). Run its `doctor` command for local dependency checks, `setup` to configure the Gemini key, and `web` to open Studio. Paste a YouTube URL, detect hooks, adjust a moment, and export. AI analysis uses your Gemini account.

### Keep shared assets in step

The Studio asset tool checks `../Hooky-engine/hooky/web/static`, then the legacy `../Hooky/hooky/web/static`, independently of the invoking directory.

```sh
npm run sync:studio       # Copy brand.css and favicon.svg into the engine
npm run build:studio-css  # Compile the engine's Studio Tailwind CSS
```

An explicit path takes precedence over `HOOKY_STUDIO_DIR`, then sibling discovery. Both commands accept the same path argument; the directory must contain `index.html`. An invalid override fails rather than selecting another sibling.

```sh
npm run sync:studio -- /path/to/engine/hooky/web/static
npm run build:studio-css -- /path/to/engine/hooky/web/static
```

Argument paths are relative to the invoking directory. To call the tool from elsewhere, use absolute paths:

```sh
node /path/to/Hooky-website/scripts/studio-assets.cjs sync /path/to/engine/hooky/web/static
node /path/to/Hooky-website/scripts/studio-assets.cjs css /path/to/engine/hooky/web/static
```

## Before a pull request

```sh
npm run lint
npm run typecheck
npm run test:tooling
npm run build
```

For changes to browser workflows, install Chromium once and run the isolated browser checks:

```sh
npx playwright install chromium
npm run check:browser-ci
```

<details>
<summary>Browser hosts, fixtures, and failure evidence</summary>

`check:browser-ci` starts the production website and an isolated Studio on available loopback ports. It uses temporary settings, state, source lists, and output without real credentials. It runs `check:ui`, `check:improvements`, `check:studio-workflow`, `check:studio-features`, and `check:studio-projects`, then terminates both server process trees and removes temporary data on success or failure.

The runner uses the sibling engine's `.venv` Python. Set `ENGINE_PYTHON` to an absolute executable to override it. Install the engine's existing dependencies with `uv sync --locked --extra all --extra dev`. An explicit Studio path works with `npm run check:browser-ci -- /path/to/engine/hooky/web/static`.

Individual scripts accept `WEBSITE_URL` and `STUDIO_URL` when the hosts are already running. They intercept model/export API calls, reject unexpected routes, and check assets. The named-project check writes snapshots through the real API: standalone `npm run check:studio-projects` requires `STUDIO_URL` pointing to an isolated test Studio. The combined runner provides that isolation.

Coverage includes 390, 768, 1440, and 1728px widths; documentation search, reset, anchors, history, and clipboard; and Studio source-to-export fixtures. `check:studio-features` covers topic search, caption corrections, restoration of browser edits and job history, and corrected captions sent for export. Logs and failure screenshots stay in ignored `.design-review/` and are uploaded by CI on failure.

</details>

<details>
<summary>Pair the repositories in CI</summary>

Browser CI needs a **compatible full sibling commit SHA**. Set `HOOKY_ENGINE_REVISION` in this website's Actions variables, or pass `engine_revision` to workflow dispatch. The engine workflow uses `HOOKY_WEBSITE_REVISION` or `website_revision` in the other direction.

Browser jobs are skipped until a compatible SHA is supplied. Regular build/unit jobs remain available.

</details>

<details>
<summary>Optional real-media smoke in the engine</summary>

From the engine root, run:

```sh
HOOKY_MEDIA_SMOKE=1 uv run pytest tests/test_web_media_smoke.py --run-integration -m integration
```

PowerShell:

```powershell
$env:HOOKY_MEDIA_SMOKE='1'
uv run pytest tests/test_web_media_smoke.py --run-integration -m integration
```

This check uses a local FFmpeg fixture and the real shared caption/render path. It verifies fractional timing, burned caption pixels, center/fit framing, 1080×1920 output and duration, and failure/cancellation publishing. FFmpeg/FFprobe are required; ordinary tests skip it. Engine workflow dispatch can enable it independently of browser pairing. It never calls YouTube, Gemini, or Instagram.

</details>
