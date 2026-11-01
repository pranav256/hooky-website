"use client";

import { useState } from "react";
import Link from "next/link";
import { REPO_URL, CLONE_COMMAND } from "@/lib/constants";

type IconName = "arrow" | "check" | "copy" | "github" | "menu" | "spark" | "terminal" | "x";

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    copy: (
      <>
        <rect x="8" y="8" width="11" height="11" rx="2" />
        <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
      </>
    ),
    github: (
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.5S18.2.1 15 1.8a13.4 13.4 0 0 0-7 0C4.8.1 3.7.5 3.7.5A5 5 0 0 0 3.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4" />
    ),
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 17h16" />
      </>
    ),
    spark: (
      <>
        <path d="M12 2c.6 5.9 2.1 7.4 8 8-5.9.6-7.4 2.1-8 8-.6-5.9-2.1-7.4-8-8 5.9-.6 7.4-2.1 8-8Z" />
      </>
    ),
    terminal: (
      <>
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </>
    ),
    x: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const pipelineStages = [
  {
    id: "01",
    label: "01. Radar & Ingestion",
    title: "Channel Radar and Ingestion",
    desc: "Monitor favorite creator channels or provide direct YouTube URLs and local video files. Hooky tracks view velocity to pick winning videos automatically, with zero database overhead.",
    tags: ["yt-dlp", "View velocity", "channels.txt", "links.txt"],
    telemetry: `[radar] Scanning @hubermanlab (min_views=250000)
[radar] Discovered: "How to Optimize Dopamine" (1.4M views, +42k/day)
[intake] Downloaded 1080p source stream to .hooky-state/sources/
[status] Source validated: duration=01:42:18, audio=48kHz stereo`,
  },
  {
    id: "02",
    label: "02. Gemini 2.0 AI",
    title: "Semantic Hook Detection and Scoring",
    desc: "Google Gemini scans transcript narrative tension, conversational pacing, and payoffs. It ranks moments with a 1 to 99 virality score rather than crude volume spikes.",
    tags: ["google-genai", "gemini-3.8-flash", "Virality scoring", "Model fallback"],
    telemetry: `[gemini] Chunk analysis: 18,000 characters sent to gemini-3.8-flash
[gemini] Hook candidate #1: 00:14:08 -> 00:14:42 (Virality score: 98/100)
[reasoning] "Speaker shifts from problem setup to contrarian dopamine insight."
[selection] Isolated 3 high-retention clips (34s, 48s, 56s)`,
  },
  {
    id: "03",
    label: "03. Whisper Sub-Second",
    title: "Sub-Second Word-Level Transcription",
    desc: "Hooky fuses source YouTube captions with faster-whisper (int8 quantized for modest CPUs). Spoken words receive exact start and end millisecond timestamps.",
    tags: ["faster-whisper", "int8 quantized", "Microsecond sync", "Zero GPU required"],
    telemetry: `[transcription] Aligning audio track: 00:14:08 - 00:14:42
[whisper] Faster-Whisper (int8 compute, 2 threads): 142 words parsed
[alignment] Word "Dopamine" at 00:14:12.340 -> 00:14:12.780 (+0.0ms drift)
[cleanup] Filler words trimmed, silence gaps condensed`,
  },
  {
    id: "04",
    label: "04. Dynamic 9:16 Framing",
    title: "Active Speaker Tracking and Canvas Fit",
    desc: "Crops 16:9 widescreen footage into 9:16 vertical video. Choose between speaker auto-tracking, center crop, or canvas fit with a dynamic blurred background.",
    tags: ["Speaker tracking", "9:16 Portrait", "Gaussian blur canvas", "FFmpeg filter"],
    telemetry: `[framing] Mode selected: AUTO_TRACK (Speaker centered)
[crop] Smooth pan interpolation: X_center=960 -> 1080x1920 viewport
[filter] Scale=1080:1920:force_original_aspect_ratio=increase
[canvas] Gaussian blur backdrop generated at 1080x1920 60fps`,
  },
  {
    id: "05",
    label: "05. Hormozi Kinetic Captions",
    title: "Broadcast-Grade ASS Subtitle Engine",
    desc: "Burns word-by-word karaoke subtitles directly into the video. Active words pop with clean typography, subtle outlines, and drop shadows.",
    tags: ["ASS subtitles", "Hormozi preset", "Karaoke highlight", "Vector render"],
    telemetry: `[subtitles] Style: HORMOZI_POP | Font: Arial Bold | Outline: 4px
[stream] Rendering ASS vector script: 142 animated word events
[highlight] Active word pop animation applied with 0.12s decay
[burn] Libass hardware rasterizer: zero quality degradation`,
  },
  {
    id: "06",
    label: "06. Resumable Export & Publish",
    title: "Crash-Resilient FFmpeg and Safe Queue",
    desc: "Encodes at CRF 15 high-bitrate with atomic temporary file swapping and render_state.json checkpointing. Optional scheduler posts to Instagram Reels with human-like jitter.",
    tags: ["CRF 15", "Resumable render", "Instagram queue", "Anti-ban jitter"],
    telemetry: `[render] FFmpeg x264 encoding started: 1080x1920 @ 60fps
[state] Saved checkpoint to render_state.json (Frame 1,840/2,040)
[complete] Output saved to output/huberman_dopamine_clip1.mp4 (42MB)
[queue] Scheduled upload for Instagram Reels: Cooldown jitter 74 mins`,
  },
];

const capabilities = [
  {
    n: "01",
    title: "Visual Web Studio Cockpit",
    desc: "Run a local browser control room. Preview hook candidates, toggle framing modes, fine-nudge cut points by ±0.5s, and edit settings in real time.",
    tag: "PORTAL & EDITOR",
  },
  {
    n: "02",
    title: "Autonomous Batch Automation",
    desc: "Feed channel handles into channels.txt and walk away. Hooky discovers viral videos, extracts hooks, burns subtitles, and outputs clips while you sleep.",
    tag: "HEADLESS DAEMON",
  },
  {
    n: "03",
    title: "100% On-Device Privacy",
    desc: "Your raw video footage never touches a third-party cloud. Only lightweight text transcripts are sent to Gemini for hook selection. Zero cloud leaks.",
    tag: "LOCAL-FIRST",
  },
  {
    n: "04",
    title: "Kinetic Animated Subtitles",
    desc: "Powered by an Advanced SubStation Alpha (ASS) engine. Words highlight in real time in Hormozi, Clean, and Cyber Yellow presets.",
    tag: "WORD-LEVEL SYNC",
  },
  {
    n: "05",
    title: "Crash-Proof Resumable Render",
    desc: "Power outage or interrupted render? The cutter saves frame progress in render_state.json and resumes encoding without restarting from zero.",
    tag: "CRASH RESILIENT",
  },
  {
    n: "06",
    title: "Anti-Ban Social Queue",
    desc: "Durable queue with OS file locks, randomized 60 to 120 minute cooldown jitter, scheduled time windows, and uncertainty safeguards to avoid double-posts.",
    tag: "SAFE PUBLISHER",
  },
];

const comparisons = [
  ["Monthly cost", "$0, forever", "$19–99 / month"],
  ["Processing", "100% on your machine", "Uploaded to third-party cloud"],
  ["Usage limits", "Unlimited video minutes", "60–200 min / month credit caps"],
  ["Watermarks", "None, ever", "Watermarked on free plans"],
  ["Interface options", "Web studio + Headless CLI", "Browser cloud only"],
  ["Crash recovery", "Frame-level checkpoint resume", "Full upload restart"],
];

const runnerTabs = [
  {
    id: "quickstart",
    label: "./main.sh",
    summary: "All-in-one launcher. Auto-verifies FFmpeg & uv, syncs environment, and opens Web Studio in your browser.",
    cmd: "./main.sh",
  },
  {
    id: "web",
    label: "./main.sh web",
    summary: "Directly starts the local Web Studio portal at http://127.0.0.1:8000 with a secure session token.",
    cmd: "./main.sh web",
  },
  {
    id: "make",
    label: "./main.sh make",
    summary: "Runs the autonomous end-to-end batch clipping engine across all channels and links.",
    cmd: "./main.sh make",
  },
  {
    id: "doctor",
    label: "./main.sh doctor",
    summary: "System health check: audits Python, FFmpeg, Whisper, and live Gemini API connectivity.",
    cmd: "./main.sh doctor",
  },
  {
    id: "channels",
    label: "channels.txt",
    summary: "Channel radar file syntax. Monitors YouTube handles and filters top videos by view count.",
    cmd: "@hubermanlab | limit=3 min_views=250000",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [activeRunnerTab, setActiveRunnerTab] = useState(0);
  const [copiedRunner, setCopiedRunner] = useState(false);
  const [mode, setMode] = useState<"crop" | "canvas">("crop");
  const [caption, setCaption] = useState<"bold" | "clean" | "mono">("bold");
  const [engineTab, setEngineTab] = useState<"studio" | "settings" | "radar">("studio");

  const copyCommand = async () => {
    await navigator.clipboard?.writeText(`${CLONE_COMMAND} && cd Hooky && ./main.sh`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const copyRunnerCmd = async (cmd: string) => {
    await navigator.clipboard?.writeText(cmd);
    setCopiedRunner(true);
    window.setTimeout(() => setCopiedRunner(false), 1800);
  };

  return (
    <div className="site-shell">
      {/* Navigation */}
      <header className="nav-wrap">
        <a className="wordmark" href="#top" aria-label="Hooky home">
          <span className="mark">H</span>
          <span>HOOKY</span>
        </a>
        <nav
          className={menuOpen ? "nav-links open" : "nav-links"}
          aria-label="Primary navigation"
        >
          <a href="#workflow" onClick={() => setMenuOpen(false)}>
            Workflow
          </a>
          <a href="#capabilities" onClick={() => setMenuOpen(false)}>
            Capabilities
          </a>
          <a href="#cockpit" onClick={() => setMenuOpen(false)}>
            Cockpit
          </a>
          <Link href="/docs" onClick={() => setMenuOpen(false)}>
            Docs
          </Link>
          <a href="#compare" onClick={() => setMenuOpen(false)}>
            Compare
          </a>
          <a href="#install" onClick={() => setMenuOpen(false)}>
            Install
          </a>
        </nav>
        <div className="nav-actions">
          <Link className="text-link" href="/docs">
            Docs <Icon name="arrow" />
          </Link>
          <a
            className="github-link"
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="github" /> GitHub
          </a>
          <a className="mini-cta" href="#install">
            Get Hooky <Icon name="arrow" />
          </a>
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <Icon name={menuOpen ? "x" : "menu"} size={20} />
          </button>
        </div>
      </header>

      <main id="top">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> Autonomous video clipper. 100% on your machine.
            </p>
            <h1>
              One long video.
              <br />
              <em>Only the good parts.</em>
            </h1>
            <p className="hero-lede">
              Hooky scans hours of long-form podcasts and interviews, extracts high-retention hooks with Gemini AI, synchronizes animated captions via Whisper, and renders 9:16 vertical clips locally.
            </p>
            <div className="hero-actions">
              <a className="primary-cta" href="#install">
                Install for free <Icon name="arrow" />
              </a>
              <Link className="text-link" href="/docs">
                Read documentation <Icon name="arrow" />
              </Link>
            </div>
            <p className="microcopy">
              MIT licensed · macOS, Windows &amp; Linux · Zero subscription
            </p>
          </div>

          {/* Authentic Studio Preview */}
          <div id="studio" className="studio-scene">
            <div className="studio" aria-label="Hooky web studio preview">
              <div className="studio-bar">
                <div className="traffic">
                  <i />
                  <i />
                  <i />
                </div>
                <span className="studio-bar-title">hooky / web-studio</span>
                <span className="live-badge">
                  <span className="status-dot" /> 98 virality score
                </span>
              </div>
              <div className="studio-body">
                <aside className="studio-controls">
                  <div>
                    <label>Framing</label>
                    <button
                      className={mode === "crop" ? "selected" : ""}
                      onClick={() => setMode("crop")}
                    >
                      <span>Auto-track</span>
                      <small>9:16</small>
                    </button>
                    <button
                      className={mode === "canvas" ? "selected" : ""}
                      onClick={() => setMode("canvas")}
                    >
                      <span>Canvas fit</span>
                      <small>blur</small>
                    </button>
                  </div>
                  <div>
                    <label>Subtitles</label>
                    {(["bold", "clean", "mono"] as const).map((item) => (
                      <button
                        key={item}
                        className={caption === item ? "selected" : ""}
                        onClick={() => setCaption(item)}
                      >
                        <span>
                          {item === "bold"
                            ? "Hormozi pop"
                            : item === "clean"
                              ? "Clean line"
                              : "Cyber mono"}
                        </span>
                      </button>
                    ))}
                  </div>
                </aside>
                <div className="preview-stage">
                  <div className={`video-frame ${mode}`}>
                    <div className="person person-one">
                      <span />
                    </div>
                    <div className="person person-two">
                      <span />
                    </div>
                    <div className={`caption ${caption}`}>
                      You don’t need more content.
                      <br />
                      <strong>You need better moments.</strong>
                    </div>
                    <span className="crop-tag">
                      {mode === "crop" ? "Active speaker" : "Canvas fit"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="timeline">
                <div className="timeline-meta">
                  <span>Viral hook candidate #1</span>
                  <strong>00:14:08 — 00:14:42 (+34s)</strong>
                </div>
                <div className="waveform">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <i key={i} style={{ height: `${20 + ((i * 23) % 72)}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proof Strip */}
        <section className="proof-strip" aria-label="Product benefits">
          <div>
            <strong>$0</strong>
            <span>No subscription or caps</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>Local video rendering</span>
          </div>
          <div>
            <strong>3x</strong>
            <span>Reframing modes</span>
          </div>
          <div>
            <strong>∞</strong>
            <span>Unlimited minutes</span>
          </div>
        </section>

        {/* SECTION: INTERACTIVE PIPELINE WORKFLOW */}
        <section className="section" id="workflow">
          <div className="section-heading">
            <p className="kicker">The autonomous pipeline</p>
            <h2>
              Under the hood of
              <br />
              the Hooky engine
            </h2>
            <p>
              Six automated stages from raw YouTube link to broadcast-ready 9:16 Shorts with burned animated subtitles. Click any stage to inspect the execution telemetry.
            </p>
          </div>

          <div className="workflow-explorer">
            <div className="workflow-tabs-bar">
              {pipelineStages.map((stage, idx) => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(idx)}
                  className={`workflow-tab-btn ${activeStage === idx ? "active" : ""}`}
                >
                  <span className="tab-n">{stage.id}</span>
                  <span>{stage.label.split(". ")[1]}</span>
                </button>
              ))}
            </div>

            <div className="workflow-panel">
              <div className="workflow-panel-copy">
                <div className="stage-eyebrow">
                  <span className="status-dot" /> Stage {pipelineStages[activeStage].id} of 06
                </div>
                <h3>{pipelineStages[activeStage].title}</h3>
                <p>{pipelineStages[activeStage].desc}</p>
                <div className="workflow-tags">
                  {pipelineStages[activeStage].tags.map((tag) => (
                    <span key={tag} className="workflow-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="workflow-telemetry-box">
                <div className="telemetry-header">
                  <span>Engine telemetry</span>
                  <span className="telemetry-status">100% local</span>
                </div>
                <div className="telemetry-content">
                  {pipelineStages[activeStage].telemetry}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: CAPABILITIES GRID */}
        <section className="section" id="capabilities">
          <div className="section-heading">
            <p className="kicker">Engine capabilities</p>
            <h2>
              Built for creators,
              <br />
              studios and automators
            </h2>
            <p>
              Everything you need to run high-volume clipping workflows without paying SaaS subscriptions or exposing your raw video footage.
            </p>
          </div>

          <div className="capabilities-grid">
            {capabilities.map((cap) => (
              <div className="cap-card" key={cap.n}>
                <div className="cap-header">
                  <span className="cap-number">{cap.n}</span>
                  <div className="cap-icon">
                    <Icon name="spark" size={14} />
                  </div>
                </div>
                <h3>{cap.title}</h3>
                <p>{cap.desc}</p>
                <div className="cap-footer">{cap.tag}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: ENGINE PHOTO SHOWCASE */}
        <section className="section" id="cockpit">
          <div className="section-heading">
            <p className="kicker">Local Web Cockpit</p>
            <h2>
              The real studio.
              <br />
              Running on your machine.
            </h2>
            <p>
              An autonomous control portal served at <code>http://127.0.0.1:8000</code>. Inspect AI-detected hooks, fine-tune cut boundaries, monitor creator channels, and export vertical 9:16 reels with zero cloud dependencies.
            </p>
          </div>

          <div className="engine-showcase-container">
            {/* Tab Selector */}
            <div className="engine-tabs-bar">
              <button
                onClick={() => setEngineTab("studio")}
                className={`engine-tab-btn ${engineTab === "studio" ? "active" : ""}`}
              >
                <Icon name="spark" size={14} />
                <span>Studio Workbench</span>
              </button>
              <button
                onClick={() => setEngineTab("settings")}
                className={`engine-tab-btn ${engineTab === "settings" ? "active" : ""}`}
              >
                <Icon name="terminal" size={14} />
                <span>Settings &amp; Fallbacks</span>
              </button>
              <button
                onClick={() => setEngineTab("radar")}
                className={`engine-tab-btn ${engineTab === "radar" ? "active" : ""}`}
              >
                <Icon name="check" size={14} />
                <span>Channel Radar</span>
              </button>
            </div>

            {/* Tab Active Image */}
            <div className="engine-photo-frame">
              {engineTab === "studio" && (
                <img
                  src="/images/engine_studio.png"
                  alt="Hooky Web Studio Interface"
                  className="engine-img"
                />
              )}
              {engineTab === "settings" && (
                <img
                  src="/images/engine_settings.png"
                  alt="Hooky Settings Editor"
                  className="engine-img"
                />
              )}
              {engineTab === "radar" && (
                <img
                  src="/images/engine_radar.png"
                  alt="Hooky Channel Radar Monitor"
                  className="engine-img"
                />
              )}
            </div>

            <div className="engine-photo-meta">
              <span>
                {engineTab === "studio" && "Interactive Hook Workbench — Dual 9:16 Canvas Simulator & Speech Pause Boundary Trimmer"}
                {engineTab === "settings" && "Environment Configuration (.env) — Gemini API Key, Model Fallbacks, Thread Allocation"}
                {engineTab === "radar" && "Autonomous Channel Radar (channels.txt) — Automated Creator Discovery & View Velocity Tracking"}
              </span>
              <span className="url tabular">http://127.0.0.1:8000</span>
            </div>
          </div>
        </section>

        {/* SECTION: MANIFESTO */}
        <section className="manifesto">
          <div className="manifesto-inner">
            <div className="manifesto-label">
              Local-first by design
            </div>
            <blockquote>
              “Your raw footage belongs on <em>your</em> machine.”
            </blockquote>
            <p>
              Hooky sends only transcript text for semantic analysis. Video
              processing, caption rendering, and final exports stay with you.
            </p>
          </div>
        </section>

        {/* SECTION: COMPARISON */}
        <section className="comparison section" id="compare">
          <div className="comparison-copy">
            <p className="kicker">A better default</p>
            <h2>
              Software you own.
              <br />
              Not another tab you rent.
            </h2>
            <p>
              Cloud video tools add queues, caps, and an expensive monthly bill. Hooky uses
              the hardware already on your desk.
            </p>
            <Link className="text-link" href="/docs">
              Read technical comparison <Icon name="arrow" />
            </Link>
          </div>
          <div className="compare-table">
            <div className="compare-head">
              <span>Capability</span>
              <strong>Hooky</strong>
              <span>Cloud tools</span>
            </div>
            {comparisons.map(([feature, hooky, cloud]) => (
              <div className="compare-row" key={feature}>
                <span>{feature}</span>
                <strong>
                  <Icon name="check" size={14} /> {hooky}
                </strong>
                <span>{cloud}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: COMMAND RUNNER & QUICK DOCS */}
        <section className="section" id="docs">
          <div className="section-heading">
            <p className="kicker">Quick docs and commands</p>
            <h2>
              Run from terminal
              <br />
              or launch the studio
            </h2>
            <p>
              Hooky provides a unified CLI and Web Studio. Inspect common commands below or view the complete documentation manual.
            </p>
          </div>

          <div className="command-runner-wrap">
            <div className="runner-tabs-bar">
              {runnerTabs.map((tab, idx) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveRunnerTab(idx)}
                  className={`runner-tab ${activeRunnerTab === idx ? "active" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="runner-body">
              <p className="runner-summary">{runnerTabs[activeRunnerTab].summary}</p>
              <div className="runner-command-row">
                <code>{runnerTabs[activeRunnerTab].cmd}</code>
                <button onClick={() => copyRunnerCmd(runnerTabs[activeRunnerTab].cmd)}>
                  <Icon name={copiedRunner ? "check" : "copy"} size={13} />
                  {copiedRunner ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "28px", textAlign: "center" }}>
            <Link className="primary-cta" href="/docs">
              Browse full documentation <Icon name="arrow" />
            </Link>
          </div>
        </section>

        {/* SECTION: INSTALL */}
        <section className="install section" id="install">
          <div className="install-copy">
            <p className="kicker">Get started</p>
            <h2>
              Your first clip is
              <br />
              one command away
            </h2>
            <p>
              Clone the repo, run the single-command launcher, and Hooky installs all prerequisites and opens the Web Studio in your browser.
            </p>
          </div>
          <div className="terminal">
            <div className="terminal-top">
              <span>Terminal</span>
              <span>~/projects</span>
            </div>
            <div className="command">
              <span>$</span>
              <code>{CLONE_COMMAND}</code>
            </div>
            <div className="command">
              <span>$</span>
              <code>cd Hooky &amp;&amp; ./main.sh</code>
            </div>
            <button onClick={copyCommand}>
              <Icon name={copied ? "check" : "copy"} />{" "}
              {copied ? "Copied" : "Copy commands"}
            </button>
            <p>
              <Icon name="check" size={13} /> Auto-detects OS: macOS/Linux uses <code>./main.sh</code>, Windows uses <code>.\main.ps1</code>.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div>
          <a className="wordmark" href="#top">
            <span className="mark">H</span>
            <span>HOOKY</span>
          </a>
          <p>Autonomous AI video clipper. Open source and local-first.</p>
        </div>
        <div className="footer-links">
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <Link href="/docs">
            Docs
          </Link>
          <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">
            Issues
          </a>
        </div>
        <p className="copyright">MIT LICENSE · PRANAV256</p>
      </footer>
    </div>
  );
}
