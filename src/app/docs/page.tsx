"use client";

import { useState } from "react";
import Link from "next/link";
import { REPO_URL, SITE_URL } from "@/lib/constants";

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  if (name === "arrow") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    );
  }
  if (name === "copy") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    );
  }
  if (name === "check") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    );
  }
  if (name === "github") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }
  if (name === "spark") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
      </svg>
    );
  }
  if (name === "terminal") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    );
  }
  return null;
}

const SECTIONS = [
  { id: "quickstart", label: "Quickstart & Setup", icon: "terminal" },
  { id: "pipeline", label: "The Autonomous Pipeline", icon: "spark" },
  { id: "web-studio", label: "Web Studio Manual", icon: "terminal" },
  { id: "cli", label: "CLI Reference", icon: "terminal" },
  { id: "config", label: "Config & Environment", icon: "terminal" },
  { id: "subtitles", label: "Subtitles & Styling", icon: "spark" },
  { id: "faq", label: "FAQ & Troubleshooting", icon: "terminal" },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("quickstart");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const filteredSections = searchQuery.trim()
    ? SECTIONS.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.includes(searchQuery.toLowerCase()))
    : SECTIONS;

  return (
    <div className="site-shell docs-page">
      {/* Top Docs Navigation */}
      <header className="nav-wrap">
        <Link className="wordmark" href="/">
          <span className="mark">H</span>
          <span>HOOKY</span>
          <span className="docs-badge">DOCS</span>
        </Link>
        <div className="nav-actions">
          <Link className="text-link" href="/">
            ← Back to Home
          </Link>
          <a className="github-link" href={REPO_URL} target="_blank" rel="noreferrer">
            <Icon name="github" /> GitHub
          </a>
          <a className="mini-cta" href="/#install">
            Get Hooky <Icon name="arrow" />
          </a>
        </div>
      </header>

      {/* Docs Body Layout */}
      <div className="docs-container">
        {/* Left Sticky Sidebar */}
        <aside className="docs-sidebar">
          <div className="docs-search-box">
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="docs-search-input"
            />
          </div>

          <div className="docs-nav-list">
            <span className="docs-nav-category">DOCUMENTATION</span>
            {filteredSections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={() => setActiveSection(sec.id)}
                className={`docs-sidebar-link ${activeSection === sec.id ? "active" : ""}`}
              >
                {sec.label}
              </a>
            ))}
          </div>

          <div className="docs-sidebar-footer">
            <p className="docs-meta-text">Hooky Engine v2.4.0</p>
            <p className="docs-meta-sub">MIT Licensed · Open Source</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="docs-main">
          {/* SECTION 1: QUICKSTART */}
          <section id="quickstart" className="docs-section">
            <div className="docs-header">
              <span className="docs-tag">GETTING STARTED</span>
              <h1>Quickstart Guide</h1>
              <p className="docs-lede">
                Hooky is an autonomous, terminal-first AI video clipper and local Web Studio. It ingests long YouTube videos or local MP4 files, extracts high-retention hooks with Google Gemini 2.0, generates word-level animated subtitles with Whisper, and renders 9:16 vertical videos using FFmpeg—all on your own machine.
              </p>
            </div>

            <div className="doc-callout tip">
              <strong>Automated setup</strong>
              <p>You do not need to install Python virtual environments, pip packages, or FFmpeg manually. The <code>main.sh</code> and <code>main.ps1</code> scripts detect missing prerequisites and install them automatically.</p>
            </div>

            <h2>1. Installation</h2>
            <p>Clone the repository and launch the all-in-one runner for your operating system:</p>

            <div className="code-block">
              <div className="code-header">
                <span>macOS / Linux</span>
                <button
                  onClick={() => handleCopy("git clone https://github.com/pranav256/Hooky.git && cd Hooky && ./main.sh", "install-sh")}
                >
                  <Icon name={copiedKey === "install-sh" ? "check" : "copy"} size={14} />
                  {copiedKey === "install-sh" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre>
                <code>{`git clone https://github.com/pranav256/Hooky.git
cd Hooky
./main.sh`}</code>
              </pre>
            </div>

            <div className="code-block">
              <div className="code-header">
                <span>Windows (PowerShell)</span>
                <button
                  onClick={() => handleCopy("git clone https://github.com/pranav256/Hooky.git; cd Hooky; .\\main.ps1", "install-ps1")}
                >
                  <Icon name={copiedKey === "install-ps1" ? "check" : "copy"} size={14} />
                  {copiedKey === "install-ps1" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre>
                <code>{`git clone https://github.com/pranav256/Hooky.git
cd Hooky
Set-ExecutionPolicy -Scope Process Bypass
.\\main.ps1`}</code>
              </pre>
            </div>

            <h2>2. What happens on the first run?</h2>
            <ol className="docs-steps-list">
              <li>
                <strong>FFmpeg Check:</strong> Auto-installs FFmpeg &amp; FFprobe using Homebrew (macOS), apt/dnf/pacman (Linux), or winget (Windows).
              </li>
              <li>
                <strong>Package Manager:</strong> Installs <code>uv</code> (the ultra-fast Python package installer) if not present.
              </li>
              <li>
                <strong>Virtual Environment:</strong> Creates <code>.venv</code> and installs exact locked dependencies in ~5 seconds.
              </li>
              <li>
                <strong>Configuration:</strong> Auto-generates your local <code>.env</code> file from <code>.env.example</code>.
              </li>
              <li>
                <strong>Web Studio Launch:</strong> Boots the Web Studio at <code>http://127.0.0.1:8000</code> and pops open your default web browser!
              </li>
            </ol>
          </section>

          {/* SECTION 2: THE AUTONOMOUS PIPELINE */}
          <section id="pipeline" className="docs-section">
            <div className="docs-header">
              <span className="docs-tag">ARCHITECTURE</span>
              <h1>The Autonomous Pipeline</h1>
              <p className="docs-lede">
                Understanding how Hooky transforms a 2-hour long horizontal podcast into multiple viral 9:16 Shorts with zero human intervention.
              </p>
            </div>

            <div className="pipeline-flow-diagram">
              <div className="flow-step">
                <span className="flow-number">01</span>
                <h4>Discovery / Radar</h4>
                <p>Scans <code>channels.txt</code> or accepts raw URLs in <code>links.txt</code>.</p>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">02</span>
                <h4>Gemini 2.0 AI</h4>
                <p>Semantic narrative analysis, tension curves &amp; virality scoring (1-99).</p>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">03</span>
                <h4>Whisper Sync</h4>
                <p>Word-level microsecond alignment fusing source captions + int8 Whisper.</p>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">04</span>
                <h4>9:16 Framing</h4>
                <p>Active speaker auto-tracking, dynamic blur canvas, or centered crop.</p>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">05</span>
                <h4>Caption Burn</h4>
                <p>Hormozi kinetic pop subtitles rendered via vector ASS stream.</p>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">06</span>
                <h4>Atomic Export</h4>
                <p>Crash-proof FFmpeg render with <code>render_state.json</code> resumption.</p>
              </div>
            </div>

            <h2>Why local-first processing matters</h2>
            <div className="docs-grid-two">
              <div className="docs-card">
                <h3>Data privacy and security</h3>
                <p>
                  Cloud clipping SaaS platforms require uploading gigabytes of your raw video footage to third-party cloud buckets. Hooky keeps 100% of your video files on your local drive. Only the text transcript is sent to Google Gemini for hook selection.
                </p>
              </div>
              <div className="docs-card">
                <h3>Zero minute caps and zero fees</h3>
                <p>
                  Cloud tools charge $19–$99/month and throttle you with 60–120 minute monthly limits. Hooky is MIT-licensed, completely free, and has zero limits. Process 100 hours of video every day at zero software cost.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3: WEB STUDIO MANUAL */}
          <section id="web-studio" className="docs-section">
            <div className="docs-header">
              <span className="docs-tag">USER INTERFACE</span>
              <h1>Web Studio Manual</h1>
              <p className="docs-lede">
                The built-in Web Studio gives you a visual cockpit to preview hook recommendations, trim timestamps, test framing modes, and manage settings.
              </p>
            </div>

            <h2>Launching the Studio</h2>
            <p>Run the launcher without arguments or specify the <code>web</code> command:</p>
            <div className="code-block">
              <pre><code>./main.sh web</code></pre>
            </div>

            <h2>Core Web Studio Features</h2>
            <ul className="docs-feature-list">
              <li>
                <strong>Dual-Mode Visual Stage:</strong> Seamlessly toggle between the live YouTube video player and the 9:16 Canvas Simulator with animated avatars.
              </li>
              <li>
                <strong>Intelligent Framing Selector:</strong>
                <ul>
                  <li><code>Auto-Track (Speaker)</code>: Detects speaker position and applies smooth horizontal panning to keep faces centered.</li>
                  <li><code>Fit (Gaussian Blur)</code>: Fits the full 16:9 video in the center while generating a dynamic blurred background.</li>
                  <li><code>Center Crop (9:16)</code>: Directly crops the middle 1080×1920 region.</li>
                </ul>
              </li>
              <li>
                <strong>Kinetic Subtitle Preview:</strong> Real-time word highlight playback matching the Hormozi, Clean, and Yellow subtitle engines.
              </li>
              <li>
                <strong>±0.5s Timestamp Nudge Controls:</strong> Granular precision to fine-tune hook entry and exit cut points down to the millisecond.
              </li>
              <li>
                <strong>Settings Manager:</strong> View and edit your <code>.env</code> file with automatic credential masking (<code>••••••••</code>) for Instagram passwords and API keys.
              </li>
              <li>
                <strong>Output Gallery:</strong> Instant in-browser playback for all rendered MP4 clips with one-click file download.
              </li>
            </ul>

            <div className="doc-callout security">
              <strong>Local security and token authentication</strong>
              <p>
                Web Studio binds strictly to loopback (<code>127.0.0.1</code>), generates a cryptographically secure one-time session token on each launch, and enforces strict Host/Origin validation to protect against malicious web scripts or DNS rebinding.
              </p>
            </div>
          </section>

          {/* SECTION 4: CLI REFERENCE */}
          <section id="cli" className="docs-section">
            <div className="docs-header">
              <span className="docs-tag">TERMINAL REFERENCE</span>
              <h1>CLI Command Reference</h1>
              <p className="docs-lede">
                Every feature in Hooky can be scripted headlessly or scheduled via cron / Task Scheduler.
              </p>
            </div>

            <div className="cli-command-card">
              <div className="cli-header">
                <code>./main.sh web</code>
                <span className="cli-tag">PORTAL</span>
              </div>
              <p>Launches the FastAPI Web Studio server, generates session credentials, and opens your default browser at <code>http://127.0.0.1:8000</code>.</p>
            </div>

            <div className="cli-command-card">
              <div className="cli-header">
                <code>./main.sh make</code>
                <span className="cli-tag">AUTOMATION</span>
              </div>
              <p>Autonomous batch clipping engine. Reads handles from <code>channels.txt</code> and links from <code>links.txt</code>, extracts top viral moments, downloads source media, burns subtitles, and outputs finished 9:16 clips to <code>output/</code>.</p>
            </div>

            <div className="cli-command-card">
              <div className="cli-header">
                <code>./main.sh doctor</code>
                <span className="cli-tag">DIAGNOSTICS</span>
              </div>
              <p>Performs a comprehensive environment audit: verifies FFmpeg/FFprobe binaries, checks CUDA/hardware acceleration, validates Python packages, and makes a lightweight test ping with your Gemini API key.</p>
            </div>

            <div className="cli-command-card">
              <div className="cli-header">
                <code>./main.sh channels</code>
                <span className="cli-tag">RADAR</span>
              </div>
              <p>Inspects all YouTube channels listed in <code>channels.txt</code>, fetches view velocity, filters videos exceeding view thresholds, and populates the clipping queue.</p>
            </div>

            <div className="cli-command-card">
              <div className="cli-header">
                <code>./main.sh parts [URL or file.mp4]</code>
                <span className="cli-tag">SERIES</span>
              </div>
              <p>Splits long interviews or stories into a serialized "Part 1, Part 2, Part 3..." series, using sentence and scene boundaries to avoid cutting speakers mid-sentence.</p>
            </div>

            <div className="cli-command-card">
              <div className="cli-header">
                <code>./main.sh queue</code>
                <span className="cli-tag">PUBLISHER</span>
              </div>
              <p>Inspects the local Instagram publishing queue, checks pending clips, schedules upload windows, and runs the safe-pacing jitter scheduler.</p>
            </div>
          </section>

          {/* SECTION 5: CONFIG & ENVIRONMENT */}
          <section id="config" className="docs-section">
            <div className="docs-header">
              <span className="docs-tag">CONFIGURATION</span>
              <h1>Config &amp; Environment</h1>
              <p className="docs-lede">
                Customize Hooky's AI models, FFmpeg quality profiles, subtitle typography, and Instagram safe posting windows.
              </p>
            </div>

            <h2><code>.env</code> Configuration Keys</h2>
            <div className="docs-table-wrap">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Variable</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>GEMINI_API_KEY</code></td>
                    <td>—</td>
                    <td>Google Gemini API key (free from Google AI Studio).</td>
                  </tr>
                  <tr>
                    <td><code>GEMINI_MODEL</code></td>
                    <td><code>gemini-3.8-flash</code></td>
                    <td>Primary Gemini model for transcript reasoning and viral scoring.</td>
                  </tr>
                  <tr>
                    <td><code>GEMINI_MODEL_FALLBACKS</code></td>
                    <td><code>gemini-3.1-flash-lite</code></td>
                    <td>Automatic fallback chain if rate limits or quota caps are hit.</td>
                  </tr>
                  <tr>
                    <td><code>QUALITY</code></td>
                    <td><code>highest</code></td>
                    <td><code>highest</code> (CRF 15, medium preset) or <code>high</code> (CRF 20, fast encode).</td>
                  </tr>
                  <tr>
                    <td><code>WHISPER_MODEL</code></td>
                    <td><code>tiny</code></td>
                    <td>Whisper model size: <code>tiny</code>, <code>base</code>, or <code>small</code>.</td>
                  </tr>
                  <tr>
                    <td><code>WHISPER_COMPUTE</code></td>
                    <td><code>int8</code></td>
                    <td>Quantization mode. <code>int8</code> runs smoothly on modest CPUs with ~4GB RAM.</td>
                  </tr>
                  <tr>
                    <td><code>SUB_STYLE</code></td>
                    <td><code>hormozi</code></td>
                    <td>Subtitle preset: <code>hormozi</code>, <code>clean</code>, or <code>yellow</code>.</td>
                  </tr>
                  <tr>
                    <td><code>SUB_FONT</code></td>
                    <td><code>Arial</code></td>
                    <td>Font family for burned ASS subtitles.</td>
                  </tr>
                  <tr>
                    <td><code>PARTS_BACKGROUND</code></td>
                    <td><code>blur</code></td>
                    <td>Background for 9:16 portrait fit: <code>blur</code> (Gaussian) or <code>plain</code>.</td>
                  </tr>
                  <tr>
                    <td><code>IG_USERNAME</code> / <code>IG_PASSWORD</code></td>
                    <td>—</td>
                    <td>Optional Instagram credentials for autonomous Reels publishing.</td>
                  </tr>
                  <tr>
                    <td><code>QUEUE_MIN_GAP_MINUTES</code></td>
                    <td><code>60</code></td>
                    <td>Minimum randomized cooldown interval between social uploads.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2><code>channels.txt</code> Radar Syntax</h2>
            <p>Add YouTube channel handles to monitor and auto-clip top performers:</p>
            <div className="code-block">
              <pre><code>{`# Syntax: @handle | limit=N min_views=N
@hubermanlab | limit=3 min_views=250000
https://www.youtube.com/@TheDiaryOfACEO | limit=2 min_views=500000
@lexfridman | limit=1`}</code></pre>
            </div>

            <h2><code>links.txt</code> Direct Ingestion Syntax</h2>
            <p>Target specific YouTube URLs or local video files with inline overrides:</p>
            <div className="code-block">
              <pre><code>{`# Syntax: URL_OR_PATH | clips=N | min=S max=S | style=STYLE
https://www.youtube.com/watch?v=dQw4w9WgXcQ | clips=auto | style=hormozi
D:/Videos/Podcast_Episode_42.mp4 | clips=5 | min=20 max=55 | style=yellow`}</code></pre>
            </div>
          </section>

          {/* SECTION 6: SUBTITLES & STYLING */}
          <section id="subtitles" className="docs-section">
            <div className="docs-header">
              <span className="docs-tag">ANIMATION &amp; CAPTIONS</span>
              <h1>Subtitles &amp; Styling</h1>
              <p className="docs-lede">
                Hooky features a specialized Advanced SubStation Alpha (ASS) engine that generates broadcast-grade, word-by-word animated karaoke subtitles.
              </p>
            </div>

            <div className="docs-grid-three">
              <div className="style-card hormozi">
                <span className="style-badge">PRESET</span>
                <h3>Hormozi Kinetic Pop</h3>
                <p>High-energy uppercase typography, bold font weights, and an acid-green active word highlight pop.</p>
                <div className="style-preview hormozi-preview">
                  YOU DON&apos;T NEED MORE CONTENT.<br />
                  <span className="pop-word">YOU NEED BETTER MOMENTS.</span>
                </div>
              </div>

              <div className="style-card clean">
                <span className="style-badge">PRESET</span>
                <h3>Editorial Clean</h3>
                <p>Understated elegance with a translucent dark backing pill, mixed-case lettering, and white accent highlights.</p>
                <div className="style-preview clean-preview">
                  <span>Every story has a punchline. Find it.</span>
                </div>
              </div>

              <div className="style-card yellow">
                <span className="style-badge">PRESET</span>
                <h3>Cyberpunk Yellow</h3>
                <p>Neon yellow highlight with black drop shadows and monospace framing for tech, gaming, and developer clips.</p>
                <div className="style-preview yellow-preview">
                  <code>[00:14] HIGHEST_RETENTION_HOOK</code>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 7: FAQ & TROUBLESHOOTING */}
          <section id="faq" className="docs-section">
            <div className="docs-header">
              <span className="docs-tag">SUPPORT</span>
              <h1>FAQ &amp; Troubleshooting</h1>
              <p className="docs-lede">
                Answers to common questions regarding hardware, quotas, and troubleshooting.
              </p>
            </div>

            <div className="faq-list">
              <div className="faq-item">
                <h3>Do I need an NVIDIA GPU to run Hooky?</h3>
                <p>
                  <strong>No.</strong> Hooky was specifically engineered with lightweight defaults (Whisper <code>int8</code> quantization and multi-threaded FFmpeg CPU encoding). It runs comfortably on standard 4GB RAM laptops with dual-core processors. If an NVIDIA GPU with CUDA is present, Hooky automatically detects it for faster rendering.
                </p>
              </div>

              <div className="faq-item">
                <h3>How much does the Google Gemini API cost?</h3>
                <p>
                  <strong>$0 for standard usage.</strong> Google AI Studio provides a generous free tier for Gemini models (like <code>gemini-3.8-flash</code> and <code>gemini-3.1-flash-lite</code>). Hooky only sends transcript text (roughly two small API calls per video), so you can process dozens of videos daily without exceeding free limits.
                </p>
              </div>

              <div className="faq-item">
                <h3>How does Hooky prevent Instagram bans?</h3>
                <p>
                  Hooky incorporates human-like jitter intervals (60–120 minutes between posts), configurable posting hour windows (e.g. 5 PM to midnight), and atomic upload locks. It marks posts with an uncertain outcome state rather than immediately retrying, preventing accidental double-posts.
                </p>
              </div>

              <div className="faq-item">
                <h3>What should I do if FFmpeg is missing?</h3>
                <p>
                  Run <code>./main.sh doctor</code> (or <code>.\main.ps1 doctor</code>). The launcher will detect that FFmpeg is missing and offer to install it automatically via your system package manager.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Docs Footer */}
      <footer>
        <div>
          <Link className="wordmark" href="/">
            <span className="mark">H</span>
            <span>HOOKY</span>
          </Link>
          <p>Autonomous AI video clipper. Open-source and local-first.</p>
        </div>
        <div className="footer-links">
          <Link href="/">Home</Link>
          <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">Issues</a>
        </div>
        <p className="copyright">MIT LICENSE · PRANAV256</p>
      </footer>
    </div>
  );
}
