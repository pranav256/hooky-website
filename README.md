# Hooky website

Next.js 15, React 19 and TypeScript website for [Hooky Engine](https://github.com/pranav256/Hooky-engine). The sample studio is separate from the authenticated local engine.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Set `NEXT_PUBLIC_SITE_URL` to the deployment's canonical URL when hosting elsewhere.

For a first engine run, clone `https://github.com/pranav256/Hooky-engine.git`, enter `Hooky-engine`, then run `./main.sh doctor` (`.\main.ps1 doctor` on Windows; run `Set-ExecutionPolicy -Scope Process Bypass` first). Doctor checks local dependencies without a live Gemini call. Run the launcher's `setup` command to configure `GEMINI_API_KEY`, then `web` to open http://127.0.0.1:8000. Paste a YouTube URL, detect hooks, edit a selected moment's timing, export, and retrieve the MP4 in Output Gallery or the configured output folder. Gemini pricing and quotas apply to AI analysis.

The shared Lumen Dark tokens live in `public/brand.css`; both apps use system fonts. Both Studio tools first resolve `../Hooky-engine/hooky/web/static`, then the legacy `../Hooky/hooky/web/static`, independently of the invoking working directory:

```sh
npm run sync:studio
npm run build:studio-css
```

An explicit static directory takes precedence and must contain `index.html`; an invalid override fails rather than choosing another sibling. Both tools accept the same argument or `HOOKY_STUDIO_DIR`. Paths supplied as arguments are relative to the invoking directory, so absolute paths work from anywhere; no Tailwind config edit is needed:

```sh
node /path/to/Hooky-website/scripts/sync-studio-brand.mjs /path/to/engine/hooky/web/static
node /path/to/Hooky-website/scripts/build-studio-css.mjs /path/to/engine/hooky/web/static
```

```sh
npm run lint
npm run typecheck
npm run test:tooling
npm run build
npx playwright install chromium
npm run check:browser-ci
```

`check:browser-ci` starts the production website and an isolated Studio on available loopback ports, with temporary settings, state, source lists and output, without real credentials. It runs `check:ui`, `check:improvements`, `check:studio-workflow`, and `check:studio-features`, then terminates both server process trees and removes temporary data on success or failure. It uses the sibling engine's `.venv` Python; set `ENGINE_PYTHON` to an absolute Python executable to override it. The engine needs its existing web dependencies installed (`uv sync --locked --extra all --extra dev`). Pass an explicit Studio directory with `npm run check:browser-ci -- /path/to/engine/hooky/web/static`.

Individual browser scripts support `WEBSITE_URL` and `STUDIO_URL` when both hosts are already running. They intercept API reads and mutations, reject unexpected routes, check asset loading, and leave user settings/media untouched. Checks cover 390, 768, 1440 and 1728px, documentation search/reset/anchors/history/clipboard, Studio states and source-to-export fixtures. The Studio feature check also covers topic search, caption corrections, session/history restoration and edited export payloads; run it separately with `npm run check:studio-features`. Logs and failure screenshots are retained in ignored `.design-review/` and uploaded by CI on failure.

Each repo's browser CI requires a **compatible full sibling commit SHA**. Configure `HOOKY_ENGINE_REVISION` in this website's Actions variables, or pass `engine_revision` to workflow dispatch. The engine workflow similarly uses `HOOKY_WEBSITE_REVISION` or `website_revision`. Browser jobs are skipped until a compatible SHA is supplied; regular build/unit jobs remain available.

The engine's separate offline media smoke uses a local FFmpeg fixture and the real shared caption/render path. From the engine root, run `HOOKY_MEDIA_SMOKE=1 uv run pytest tests/test_web_media_smoke.py --run-integration -m integration` (PowerShell: `$env:HOOKY_MEDIA_SMOKE='1'; uv run pytest tests/test_web_media_smoke.py --run-integration -m integration`). It verifies fractional timing, burned caption pixels, center/fit framing, 1080×1920 duration, and failure/cancellation publishing. FFmpeg/FFprobe are required; ordinary tests skip it. Engine workflow dispatch can opt into it independently of browser pairing. It never calls YouTube, Gemini or Instagram.

See [public/SOURCES.md](public/SOURCES.md) for the licensed image sources and theme attribution.
