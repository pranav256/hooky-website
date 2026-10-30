# Hooky Web — Interactive Showcase & Documentation

The official web application and interactive visual studio for [**Hooky**](https://github.com/pranav256/Hooky), the 100% free and open-source autonomous AI video clipper and shorts generator.

Built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, and **@vercel/analytics**.

---

## ⚡ Features Showcased

- **Interactive 16:9 to 9:16 Visual Studio**: Live kinetic subtitle preview with word-by-word synchronized timing.
- **Framing & Speaker Tracking Modes**: Switch between `Center Crop` (portrait speaker focus) and `Canvas Fit` (dual-speaker ambient blur layout).
- **6 Subtitle Presets**: Hormozi Classic, Warm Titanium, Clean Studio, Minimal Editorial, Cyber Emerald, and Crimson Impact.
- **Authentic Gemini Hook Visualizer**: Timeline arc snapping directly to natural sentence pause boundaries (zero artificial virality formulas).
- **Terminal CLI Simulator**: Real-time tabs showing `./hooky.sh make`, `preview`, `parts`, and `doctor`.
- **Zero Heavy Assets**: 120 kB ultra-lightweight bundle optimized for instant 100/100 Lighthouse performance.

---

## 🚀 Quick Start (Local Development)

```bash
# Clone this repository
git clone https://github.com/pranav256/hooky-website.git
cd hooky-website

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Production Build

```bash
npm run build
npm run start
```

---

## ☁️ Deploy to Vercel

This repository is optimized for 1-click deployment on [Vercel](https://vercel.com):

1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import `pranav256/hooky-website`.
3. Framework Preset: **Next.js** (detected automatically).
4. Click **Deploy**.

---

## 🔗 Related Repositories

- **Core Engine & CLI**: [pranav256/Hooky](https://github.com/pranav256/Hooky) (Python, faster-whisper, Gemini 2.0 Flash, FFmpeg)

---

## 📄 License

MIT © [Pranav](https://github.com/pranav256)
