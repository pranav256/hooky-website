const { resolveStudioDir } = require("./scripts/studio-path.cjs");
const studioDir = resolveStudioDir().replaceAll("\\", "/");
module.exports = {
  content: [
    `${studioDir}/index.html`,
    `${studioDir}/studio.js`,
  ],
  theme: {
    extend: {
      colors: {
        paper: "#101110",
        panel: "#191b18",
        cream: "#242721",
        ink: "#f3f5ec",
        acid: "#d2fa69",
        muted: "#969d8b",
        line: "#30342a",
        slate: {
          200: "#e2e5da",
          300: "#c6ccbd",
          400: "#b0b5a8",
          500: "#969d8b",
          600: "#879075",
        },
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
        mono: ["IBM Plex Mono", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
