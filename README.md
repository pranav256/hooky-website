# Hooky

The website for [Hooky](https://github.com/pranav256/Hooky), a free, open-source AI video clipper. Built with Next.js 15, React 19, TypeScript, and Tailwind. Includes an interactive sample studio, documentation, and a shared identity for Hooky's real local web studio.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Launch the real studio from the sibling Hooky project with `./main.sh web` or `.\main.ps1 web` on Windows. It runs at http://127.0.0.1:8000.

```sh
npm run lint
npm run typecheck
npm run build
npm run start
```

Set `NEXT_PUBLIC_SITE_URL` to the deployment's canonical URL when hosting elsewhere.

The shared brand lives in `public/brand.css`. With Hooky in `../Hooky`, use:

```sh
npm run sync:studio
npm run build:studio-css
```

For another directory, pass its static folder to `node scripts/sync-studio-brand.mjs /path/to/Hooky/hooky/web/static` and update `studio.tailwind.config.cjs` accordingly.

To check the interface, start both servers, install Playwright's browser (`npx playwright install chromium`), and run `npm run check:ui`. The checks cover responsive layouts, docs, the sample tour, navigation, copying commands, all five studio views, and intercepted analysis/export workflows. They don't process videos or change settings. `WEBSITE_URL` and `STUDIO_URL` can override the preview addresses.

To refresh licensed sample imagery and compressed font assets:

```sh
uv run --no-project --with fonttools --with brotli python scripts/fetch-assets.py
npm run sync:studio
node scripts/render-og.mjs
```

See [DESIGN.md](DESIGN.md) for design decisions and review status, and [public/SOURCES.md](public/SOURCES.md) for asset provenance. Hooky uses a Gemini API key for moment selection; Google's API pricing and quotas apply. Local transcription and video rendering don't require a software subscription.
