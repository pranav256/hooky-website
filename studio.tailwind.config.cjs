const { resolveStudioDir } = require("./scripts/studio-path.cjs");
const studioDir = resolveStudioDir().replaceAll("\\", "/");
module.exports = {
  content: [`${studioDir}/index.html`, `${studioDir}/studio.js`],
  theme: {
    extend: {
      colors: {
        paper: "var(--hooky-bg)",
        panel: "var(--hooky-panel)",
        cream: "var(--hooky-raised)",
        ink: "var(--hooky-text)",
        acid: "var(--hooky-accent)",
        muted: "var(--hooky-muted)",
        line: "var(--hooky-line)",
        slate: {
          200: "var(--hooky-text)",
          300: "var(--hooky-secondary)",
          400: "var(--hooky-secondary)",
          500: "var(--hooky-muted)",
          600: "var(--hooky-muted)",
        },
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
        mono: ["ui-monospace", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
