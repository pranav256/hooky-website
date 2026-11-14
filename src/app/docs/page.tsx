"use client";

import { useEffect, useRef, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { INSTALL_COMMANDS } from "@/lib/constants";

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  if (name === "arrow") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    );
  }
  if (name === "copy") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    );
  }
  if (name === "check") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
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
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
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
  { id: "topic-clipping", label: "Topic clipping", icon: "spark" },
  { id: "caption-editing", label: "Caption corrections", icon: "spark" },
  { id: "named-projects", label: "Named projects", icon: "terminal" },
  { id: "cli", label: "CLI Reference", icon: "terminal" },
  { id: "config", label: "Config & Environment", icon: "terminal" },
  { id: "subtitles", label: "Subtitles & Styling", icon: "spark" },
  { id: "faq", label: "FAQ & Troubleshooting", icon: "terminal" },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("quickstart");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchText, setSearchText] = useState<Record<string, string>>({});
  const searchInput = useRef<HTMLInputElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const sections = SECTIONS.map((section) =>
      document.getElementById(section.id),
    );
    setSearchText(
      Object.fromEntries(
        SECTIONS.map((section, index) => [
          section.id,
          `${section.label} ${sections[index]?.textContent || ""}`
            .toLowerCase()
            .replace(/\s+/g, " "),
        ]),
      ),
    );
    let frame = 0;
    const updateSection = () => {
      frame = 0;
      const scrollPadding =
        parseFloat(
          getComputedStyle(document.documentElement).scrollPaddingTop,
        ) || 0;
      const current = sections
        .filter(
          (section) =>
            section &&
            section.getBoundingClientRect().top <=
              scrollPadding +
                (parseFloat(getComputedStyle(section).scrollMarginTop) || 0) +
                1,
        )
        .at(-1);
      setActiveSection(current?.id || "quickstart");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateSection);
    };
    const onHashChange = () => {
      const id = window.location.hash.slice(1);
      if (SECTIONS.some((section) => section.id === id)) setActiveSection(id);
      else onScroll();
    };
    onHashChange();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("resize", onScroll);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const handleCopy = async (text: string, key: string) => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
    } catch {
      setCopiedKey("clipboard-error");
    }
    copyTimer.current = setTimeout(() => setCopiedKey(null), 2500);
  };

  const searchWords = searchQuery
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const filteredSections = searchWords.length
    ? SECTIONS.filter((section) =>
        searchWords.every((word) =>
          `${section.id} ${searchText[section.id] || section.label.toLowerCase()}`.includes(
            word,
          ),
        ),
      )
    : SECTIONS;

  return (
    <div id="top" className="site-shell docs-page">
      <a className="skip-link" href="#docs-content">
        Skip to documentation
      </a>
      <SiteHeader docs />

      {/* Docs Body Layout */}
      <div className="docs-container">
        {/* Left Sticky Sidebar */}
        <aside className="docs-sidebar">
          <div className="docs-search-box">
            <input
              ref={searchInput}
              type="search"
              aria-label="Search documentation"
              aria-controls="docs-section-links"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="docs-search-input"
            />
            {searchWords.length > 0 && (
              <div className="docs-search-feedback">
                <span role="status">
                  {filteredSections.length} matching{" "}
                  {filteredSections.length === 1 ? "section" : "sections"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    searchInput.current?.focus();
                  }}
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          <nav
            id="docs-section-links"
            className="docs-nav-list"
            aria-label="Documentation sections"
          >
            <span className="docs-nav-category">DOCUMENTATION</span>
            <div className="docs-section-links">
              {filteredSections.length === 0 && (
                <p className="docs-search-empty">
                  No sections found. Try “setup” or “captions”.
                </p>
              )}
              {filteredSections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={() => setActiveSection(sec.id)}
                  aria-current={
                    activeSection === sec.id ? "location" : undefined
                  }
                  className={`docs-sidebar-link ${activeSection === sec.id ? "active" : ""}`}
                >
                  {sec.label}
                </a>
              ))}
            </div>
          </nav>

          <div className="docs-sidebar-footer">
            <p className="docs-meta-text">Hooky Engine 1.0.0</p>
            <p className="docs-meta-sub">MIT Licensed · Open Source</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main id="docs-content" className="docs-main" tabIndex={-1}>
          {copiedKey === "clipboard-error" && (
            <p role="status" className="doc-callout">
              Clipboard unavailable. Select and copy the command text.
            </p>
          )}
          {/* SECTION 1: QUICKSTART */}
          <section id="quickstart" className="docs-section">
            <div className="docs-header">
              <span className="docs-tag">Getting started</span>
              <h1>
                Make your <span className="serif-word">first cut.</span>
              </h1>
              <p className="docs-lede">
                Hooky turns long videos into vertical clips. Use the local web
                studio or command line to find moments with Gemini, add
                word-level captions with Whisper, and render with FFmpeg. Video
                processing stays on your machine; transcript text is sent to
                Gemini for AI selection.
              </p>
            </div>

            <div className="doc-callout tip">
              <strong>Automated setup</strong>
              <p>
                The <code>main.sh</code> and <code>main.ps1</code> launchers
                manage Python dependencies and check prerequisites. Run{" "}
                <code>doctor</code> first and follow any instructions for your
                operating system, then use <code>setup</code> to configure
                Hooky.
              </p>
            </div>

            <h2>1. Installation</h2>
            <p>
              Clone the repository and launch the all-in-one runner for your
              operating system:
            </p>

            <div className="code-block">
              <div className="code-header">
                <span>macOS / Linux</span>
                <button
                  onClick={() =>
                    handleCopy(INSTALL_COMMANDS.unix, "install-sh")
                  }
                >
                  <Icon
                    name={copiedKey === "install-sh" ? "check" : "copy"}
                    size={14}
                  />
                  {copiedKey === "install-sh" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre>
                <code>{INSTALL_COMMANDS.unix}</code>
              </pre>
            </div>

            <div className="code-block">
              <div className="code-header">
                <span>Windows (PowerShell)</span>
                <button
                  onClick={() =>
                    handleCopy(INSTALL_COMMANDS.windows, "install-ps1")
                  }
                >
                  <Icon
                    name={copiedKey === "install-ps1" ? "check" : "copy"}
                    size={14}
                  />
                  {copiedKey === "install-ps1" ? "Copied" : "Copy"}
                </button>
              </div>
              <pre>
                <code>{INSTALL_COMMANDS.windows}</code>
              </pre>
            </div>

            <h2>2. Check your system and API key</h2>
            <p>
              Doctor checks local dependencies without calling Gemini. Fix
              missing dependencies, then save <code>GEMINI_API_KEY</code> with{" "}
              <code>./main.sh setup</code> or <code>.\main.ps1 setup</code>. A
              missing key does not block Doctor.
            </p>
            <h2>3. Analyze and export your first clip</h2>
            <p>
              Open Studio with <code>./main.sh web</code> or{" "}
              <code>.\main.ps1 web</code>. Paste a YouTube URL and choose Detect
              hooks. Select a moment, edit timing, then Export clip. Retrieve
              the MP4 in Output Gallery or <code>output/</code>.
            </p>
            <h2>What the launcher prepares</h2>
            <ol className="docs-steps-list">
              <li>
                <strong>FFmpeg Check:</strong> Auto-installs FFmpeg &amp;
                FFprobe using Homebrew (macOS), apt/dnf/pacman (Linux), or
                winget (Windows).
              </li>
              <li>
                <strong>Package Manager:</strong> Installs <code>uv</code> (the
                ultra-fast Python package installer) if not present.
              </li>
              <li>
                <strong>Virtual Environment:</strong> Creates <code>.venv</code>{" "}
                and installs the project dependencies.
              </li>
              <li>
                <strong>Configuration:</strong> Auto-generates your local{" "}
                <code>.env</code> file from <code>.env.example</code>.
              </li>
              <li>
                <strong>Web Studio Launch:</strong> Boots the Web Studio at{" "}
                <code>http://127.0.0.1:8000</code> and pops open your default
                web browser!
              </li>
            </ol>
          </section>

          {/* SECTION 2: THE AUTONOMOUS PIPELINE */}
          <section id="pipeline" className="docs-section">
            <div className="docs-header">
              <span className="docs-tag">ARCHITECTURE</span>
              <h2 className="docs-section-title">The Autonomous Pipeline</h2>
              <p className="docs-lede">
                Follow a source from discovery and transcript analysis to
                selected moments, captions, and vertical exports.
              </p>
            </div>

            <div className="pipeline-flow-diagram">
              <div className="flow-step">
                <span className="flow-number">01</span>
                <h4>Discovery / Radar</h4>
                <p>
                  Scans <code>channels.txt</code> or accepts raw URLs in{" "}
                  <code>links.txt</code>.
                </p>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">02</span>
                <h4>Gemini AI</h4>
                <p>
                  Transcript analysis and moment scoring to help you select
                  clips.
                </p>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">03</span>
                <h4>Whisper Sync</h4>
                <p>
                  Word-level timing from source captions and local Whisper
                  transcription.
                </p>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">04</span>
                <h4>9:16 Framing</h4>
                <p>
                  Choose automatic framing, a blurred fit canvas, or a centered
                  crop.
                </p>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">05</span>
                <h4>Caption Burn</h4>
                <p>
                  Hormozi kinetic pop subtitles rendered via vector ASS stream.
                </p>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <span className="flow-number">06</span>
                <h4>Atomic Export</h4>
                <p>
                  Validated FFmpeg output is published after encoding. Studio
                  jobs interrupted by a restart can be retried explicitly.
                </p>
              </div>
            </div>

            <h2>Why local-first processing matters</h2>
            <div className="docs-grid-two">
              <div className="docs-card">
                <h3>Data privacy and security</h3>
                <p>
                  Cloud clipping SaaS platforms require uploading gigabytes of
                  your raw video footage to third-party cloud buckets. Hooky
                  keeps 100% of your video files on your local drive. Only the
                  text transcript is sent to Google Gemini for hook selection.
                </p>
              </div>
              <div className="docs-card">
                <h3>Zero minute caps and zero fees</h3>
                <p>
                  Hooky is free software under the MIT license, with no software
                  minute caps or watermarks. Processing speed depends on your
                  hardware. AI selection uses your Gemini API key, so
                  Google&apos;s API pricing and quotas apply.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3: WEB STUDIO MANUAL */}
          <section id="web-studio" className="docs-section">
            <div className="docs-header">
              <span className="docs-tag">USER INTERFACE</span>
              <h2 className="docs-section-title">Web Studio Manual</h2>
              <p className="docs-lede">
                Use the local Studio to find moments by topic, adjust timing,
                correct captions, choose framing and save named projects. You
                review the cut before exporting an MP4.
              </p>
            </div>

            <h2>Launching the Studio</h2>
            <p>
              Run the launcher without arguments or specify the <code>web</code>{" "}
              command:
            </p>
            <div className="code-block">
              <pre>
                <code>./main.sh web</code>
              </pre>
            </div>

            <div className="docs-image-card">
              <img
                src="/images/engine_studio.webp"
                alt="Current Hooky Studio with project saves and topic-guided selection using sample data"
                width={1440}
                height={1000}
                loading="lazy"
              />
              <div className="docs-image-meta">
                <span>Current local Studio with illustrative sample data</span>
                <span style={{ color: "var(--accent)" }}>
                  http://127.0.0.1:8000
                </span>
              </div>
            </div>

            <h2>Core Web Studio Features</h2>
            <ul className="docs-feature-list">
              <li>
                <strong>Topic-guided detection:</strong> Enter an optional clip
                topic before Detect hooks. Review matching moments and any
                fallback notice.{" "}
                <a href="#topic-clipping">Read the topic guide.</a>
              </li>
              <li>
                <strong>Caption corrections:</strong> Search phrases and edit
                their text while keeping their source timing. Reset a phrase to
                its original text.{" "}
                <a href="#caption-editing">Read the caption guide.</a>
              </li>
              <li>
                <strong>Named projects:</strong> Save your source, moments,
                timing, corrections and styling to disk. Reopen a project after
                restarting Studio.{" "}
                <a href="#named-projects">Read the project guide.</a>
              </li>
              <li>
                <strong>Source and style previews:</strong> Toggle between
                source playback and a sample caption canvas. The canvas previews
                subtitle styling; the exported MP4 shows the actual framing and
                timing.
              </li>
              <li>
                <strong>Intelligent Framing Selector:</strong>
                <ul>
                  <li>
                    <code>Auto</code>: Uses the source analysis recommendation.
                    Choose Fit to preserve multiple speakers or slides.
                  </li>
                  <li>
                    <code>Fit (Gaussian Blur)</code>: Fits the full 16:9 video
                    in the center while generating a dynamic blurred background.
                  </li>
                  <li>
                    <code>Center Crop (9:16)</code>: Directly crops the middle
                    region and renders a vertical 9:16 clip. This is a fixed
                    center crop; it does not track a moving speaker.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Subtitle styles:</strong> Preview Hormozi, Clean, and
                Yellow captions before exporting. Preview animation respects
                reduced motion.
              </li>
              <li>
                <strong>Editable timing:</strong> Enter start and end seconds,
                or nudge either boundary by 0.5 seconds. Export uses your edited
                range.
              </li>
              <li>
                <strong>Settings Manager:</strong> View and edit your{" "}
                <code>.env</code> file with automatic credential masking (
                <code>••••••••</code>) for Instagram passwords and API keys.
              </li>
              <li>
                <strong>Output Gallery:</strong> Instant in-browser playback for
                all rendered MP4 clips with one-click file download.
              </li>
            </ul>

            <div className="docs-grid-two docs-screenshots">
              <div className="docs-image-card" style={{ margin: 0 }}>
                <img
                  src="/images/engine_settings.webp"
                  alt="Hooky Settings Editor"
                  width={1440}
                  height={1000}
                  loading="lazy"
                />
                <div className="docs-image-meta">
                  <span>Environment Configuration (.env)</span>
                </div>
              </div>
              <div className="docs-image-card" style={{ margin: 0 }}>
                <img
                  src="/images/engine_radar.webp"
                  alt="Hooky Channel Radar Monitor"
                  width={1440}
                  height={1000}
                  loading="lazy"
                />
                <div className="docs-image-meta">
                  <span>Channel Radar (channels.txt)</span>
                </div>
              </div>
            </div>

            <div className="doc-callout security">
              <strong>Local security and token authentication</strong>
              <p>
                Web Studio binds strictly to loopback (<code>127.0.0.1</code>),
                generates a cryptographically secure one-time session token on
                each launch, and enforces strict Host/Origin validation to
                protect against malicious web scripts or DNS rebinding.
              </p>
            </div>
          </section>

          <section id="topic-clipping" className="docs-section">
            <div className="docs-header">
              <span className="docs-tag">Find a moment</span>
              <h2 className="docs-section-title">Topic-guided clipping</h2>
              <p className="docs-lede">
                Give hook detection a subject to look for across the transcript,
                such as “pricing mistakes” or “getting started”.
              </p>
            </div>
            <ol className="docs-feature-list">
              <li>Paste a YouTube source URL into Studio.</li>
              <li>
                Enter an optional <strong>Clip topic</strong>, then choose{" "}
                <strong>Detect hooks</strong>. Leave it empty for general moment
                selection.
              </li>
              <li>
                Review the suggested moments, read their dialogue and adjust the
                start/end times.
              </li>
            </ol>
            <p>
              Topic detection considers transcript chunks and can return up to
              four non-overlapping suggestions between 8 and 90 seconds.
              Suggestions are starting points; their scores do not predict
              views.
            </p>
            <div className="doc-callout">
              <strong>No matches or unavailable AI</strong>
              <p>
                If Gemini cannot complete selection, Studio labels a
                word-matching fallback. If no moments match, broaden the topic
                or clear it and try again. An empty result is not a finished
                clip.
              </p>
            </div>
            <p>
              The topic guides <strong>Detect hooks</strong>; it does not
              silently change the separate parts pipeline or channel workflow.
              Source preparation may reuse a recent cache, but rendering time
              still depends on your source, hardware and settings.
            </p>
          </section>

          <section id="caption-editing" className="docs-section">
            <div className="docs-header">
              <span className="docs-tag">Refine the words</span>
              <h2 className="docs-section-title">
                Search and correct captions
              </h2>
              <p className="docs-lede">
                Fix a name, spelling or phrase before it is burned into the
                exported clip.
              </p>
            </div>
            <ol className="docs-feature-list">
              <li>Select a moment and open its caption phrases.</li>
              <li>
                Search for the words you want to correct. Search filters the
                phrases; it does not delete them.
              </li>
              <li>
                Edit the phrase text. Preview the caption style and use
                <strong> Reset</strong> to restore the original when needed.
              </li>
              <li>
                Inspect the cut and export. Hooky applies your corrected caption
                text to the MP4 while preserving source timing.
              </li>
            </ol>
            <p>
              The original source cues remain unchanged. Corrections belong to
              your Studio work and can be saved in a named project. Source
              playback and the caption styling canvas are separate previews;
              review the exported MP4 for actual framing and timing.
            </p>
            <div className="doc-callout">
              <strong>If the source or selection changed</strong>
              <p>
                Studio rejects outdated caption edits instead of applying them
                to different source cues. Reopen the current moment and review
                its phrases before making corrections again.
              </p>
            </div>
          </section>

          <section id="named-projects" className="docs-section">
            <div className="docs-header">
              <span className="docs-tag">Continue your work</span>
              <h2 className="docs-section-title">Named local projects</h2>
              <p className="docs-lede">
                Save a cut deliberately, give it a name, and reopen it next time
                you use Studio.
              </p>
            </div>
            <ul className="docs-feature-list">
              <li>
                <strong>Save project:</strong> Saves the current project,
                including later changes.
              </li>
              <li>
                <strong>Save as new:</strong> Creates a separate snapshot for a
                different cut or styling variation.
              </li>
              <li>
                <strong>Open project:</strong> Restores the source URL, topic,
                all suggested moments, selected moment, timing, caption
                corrections, framing and subtitle choices.
              </li>
            </ul>
            <p>
              Projects use versioned JSON files in{" "}
              <code>STATE_DIR/web_projects</code>, separate from job history and
              temporary source caches. They survive Studio restarts and history
              cleanup. Keep this directory if you move your Hooky state to
              another machine.
            </p>
            <div className="doc-callout">
              <strong>A project is an editing snapshot</strong>
              <p>
                It does not back up source media or copy projects to the cloud.
                The source must still be available when you export. Browser
                draft recovery helps with an interrupted tab; use Save project
                for a deliberate disk save.
              </p>
            </div>
            <p>
              If another tab saved a newer project revision, Studio blocks an
              outdated overwrite. Open the latest saved project before
              continuing, or use Save as new to preserve your separate changes.
            </p>
          </section>

          {/* SECTION 4: CLI REFERENCE */}
          <section id="cli" className="docs-section">
            <div className="docs-header">
              <span className="docs-tag">TERMINAL REFERENCE</span>
              <h2 className="docs-section-title">CLI Command Reference</h2>
              <p className="docs-lede">
                Every feature in Hooky can be scripted headlessly or scheduled
                via cron / Task Scheduler.
              </p>
            </div>

            <div className="cli-command-card">
              <div className="cli-header">
                <code>./main.sh web</code>
                <span className="cli-tag">PORTAL</span>
              </div>
              <p>
                Launches the FastAPI Web Studio server, generates session
                credentials, and opens your default browser at{" "}
                <code>http://127.0.0.1:8000</code>.
              </p>
            </div>

            <div className="cli-command-card">
              <div className="cli-header">
                <code>./main.sh make</code>
                <span className="cli-tag">AUTOMATION</span>
              </div>
              <p>
                Autonomous batch clipping engine. Reads handles from{" "}
                <code>channels.txt</code> and links from <code>links.txt</code>,
                extracts top viral moments, downloads source media, burns
                subtitles, and outputs finished 9:16 clips to{" "}
                <code>output/</code>.
              </p>
            </div>

            <div className="cli-command-card">
              <div className="cli-header">
                <code>./main.sh doctor</code>
                <span className="cli-tag">DIAGNOSTICS</span>
              </div>
              <p>
                Checks FFmpeg/FFprobe and local Python dependencies without a
                live API call. <code>./main.sh doctor live</code> explicitly
                tests your Gemini key and model availability.
              </p>
            </div>

            <div className="cli-command-card">
              <div className="cli-header">
                <code>./main.sh channels</code>
                <span className="cli-tag">RADAR</span>
              </div>
              <p>
                Shows active entries in <code>channels.txt</code>. Use{" "}
                <code>./main.sh make</code> to discover videos and process the
                source queue.
              </p>
            </div>

            <div className="cli-command-card">
              <div className="cli-header">
                <code>./main.sh parts [URL or file.mp4]</code>
                <span className="cli-tag">SERIES</span>
              </div>
              <p>
                Splits long interviews or stories into a serialized &quot;Part
                1, Part 2, Part 3...&quot; series, using sentence and scene
                boundaries to avoid cutting speakers mid-sentence.
              </p>
            </div>

            <div className="cli-command-card">
              <div className="cli-header">
                <code>./main.sh queue</code>
                <span className="cli-tag">PUBLISHER</span>
              </div>
              <p>
                Shows the local Instagram publishing queue. Publishing is a
                separate, explicit <code>./main.sh post</code> command.
              </p>
            </div>
          </section>

          {/* SECTION 5: CONFIG & ENVIRONMENT */}
          <section id="config" className="docs-section">
            <div className="docs-header">
              <span className="docs-tag">CONFIGURATION</span>
              <h2 className="docs-section-title">Config &amp; Environment</h2>
              <p className="docs-lede">
                Customize Hooky&apos;s AI models, FFmpeg quality profiles,
                subtitle typography, and Instagram safe posting windows.
              </p>
            </div>

            <h2>
              <code>.env</code> Configuration Keys
            </h2>
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
                    <td>
                      <code>GEMINI_API_KEY</code>
                    </td>
                    <td>—</td>
                    <td>Google Gemini API key (free from Google AI Studio).</td>
                  </tr>
                  <tr>
                    <td>
                      <code>GEMINI_MODEL</code>
                    </td>
                    <td>
                      <code>gemini-3.8-flash</code>
                    </td>
                    <td>
                      Primary Gemini model for transcript reasoning and viral
                      scoring.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>GEMINI_MODEL_FALLBACKS</code>
                    </td>
                    <td>
                      <code>gemini-3.1-flash-lite,gemini-flash-latest</code>
                    </td>
                    <td>
                      Automatic fallback chain if rate limits or quota caps are
                      hit.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>QUALITY</code>
                    </td>
                    <td>
                      <code>highest</code>
                    </td>
                    <td>
                      Source download profile: <code>highest</code> uses up to
                      1440p for long videos and 2160p for short videos;{" "}
                      <code>high</code> uses 1080p and 1440p. Exports remain
                      1080×1920.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>WHISPER_MODEL</code>
                    </td>
                    <td>
                      <code>tiny</code>
                    </td>
                    <td>
                      Whisper model size: <code>tiny</code>, <code>base</code>,
                      or <code>small</code>.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>WHISPER_COMPUTE</code>
                    </td>
                    <td>
                      <code>int8</code>
                    </td>
                    <td>
                      CPU quantization mode. Memory and speed depend on the
                      model and source duration.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>SUB_STYLE</code>
                    </td>
                    <td>
                      <code>hormozi</code>
                    </td>
                    <td>
                      Common presets: <code>hormozi</code>, <code>clean</code>,
                      and <code>yellow</code>. Run <code>./main.sh styles</code>
                      to list all supported presets and aliases.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>SUB_FONT</code>
                    </td>
                    <td>
                      <code>Preset font</code>
                    </td>
                    <td>Font family for burned ASS subtitles.</td>
                  </tr>
                  <tr>
                    <td>
                      <code>PARTS_BACKGROUND</code>
                    </td>
                    <td>
                      <code>blur</code>
                    </td>
                    <td>
                      Background for 9:16 portrait fit: <code>blur</code>{" "}
                      (Gaussian) or <code>plain</code>.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>IG_USERNAME</code> / <code>IG_PASSWORD</code>
                    </td>
                    <td>—</td>
                    <td>
                      Optional Instagram credentials for autonomous Reels
                      publishing.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>QUEUE_MIN_GAP_MINUTES</code>
                    </td>
                    <td>
                      <code>60</code>
                    </td>
                    <td>
                      Minimum randomized cooldown interval between social
                      uploads.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>
              <code>channels.txt</code> Radar Syntax
            </h2>
            <p>
              Add YouTube channel handles to monitor and auto-clip top
              performers:
            </p>
            <div className="code-block">
              <pre>
                <code>{`# Syntax: @handle | limit=N | min_views=N | scan=N
@hubermanlab | limit=3 | min_views=250000 | scan=20
https://www.youtube.com/@TheDiaryOfACEO | limit=2 | min_views=500000
@lexfridman | limit=1`}</code>
              </pre>
            </div>

            <h2>
              <code>links.txt</code> Direct Ingestion Syntax
            </h2>
            <p>
              Target specific YouTube URLs or local video files with inline
              overrides:
            </p>
            <div className="code-block">
              <pre>
                <code>{`# Syntax: URL_OR_PATH | clips=N | min=S max=S | style=STYLE
https://www.youtube.com/watch?v=dQw4w9WgXcQ | clips=auto | style=hormozi
D:/Videos/Podcast_Episode_42.mp4 | clips=5 | min=20 max=55 | style=yellow`}</code>
              </pre>
            </div>
          </section>

          {/* SECTION 6: SUBTITLES & STYLING */}
          <section id="subtitles" className="docs-section">
            <div className="docs-header">
              <span className="docs-tag">ANIMATION &amp; CAPTIONS</span>
              <h2 className="docs-section-title">Subtitles &amp; Styling</h2>
              <p className="docs-lede">
                Hooky features a specialized Advanced SubStation Alpha (ASS)
                engine that generates broadcast-grade, word-by-word animated
                karaoke subtitles.
              </p>
            </div>

            <div className="docs-grid-three">
              <div className="style-card hormozi">
                <span className="style-badge">PRESET</span>
                <h3>Hormozi Kinetic Pop</h3>
                <p>
                  High-energy uppercase typography, bold font weights, and an
                  yellow active word highlights.
                </p>
                <div className="style-preview hormozi-preview">
                  YOU DON&apos;T NEED MORE CONTENT.
                  <br />
                  <span className="pop-word">YOU NEED BETTER MOMENTS.</span>
                </div>
              </div>

              <div className="style-card clean">
                <span className="style-badge">PRESET</span>
                <h3>Editorial Clean</h3>
                <p>
                  Smaller mixed-case white lettering with soft amber word
                  highlights and a dark outline.
                </p>
                <div className="style-preview clean-preview">
                  <span>Every story has a punchline. Find it.</span>
                </div>
              </div>

              <div className="style-card yellow">
                <span className="style-badge">PRESET</span>
                <h3>Cyberpunk Yellow</h3>
                <p>
                  Bright yellow word highlights, bold Montserrat lettering, and
                  black outlines for readable captions.
                </p>
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
              <h2 className="docs-section-title">FAQ &amp; Troubleshooting</h2>
              <p className="docs-lede">
                Answers to common questions regarding hardware, quotas, and
                troubleshooting.
              </p>
            </div>

            <div className="faq-list">
              <div className="faq-item">
                <h3>Do I need an NVIDIA GPU to run Hooky?</h3>
                <p>
                  <strong>No.</strong> Local transcription uses Whisper on the
                  CPU with <code>int8</code> by default. Rendering uses FFmpeg
                  CPU encoding. Processing speed and memory use depend on your
                  machine, source duration, and model size.
                </p>
              </div>

              <div className="faq-item">
                <h3>How much does the Google Gemini API cost?</h3>
                <p>
                  Hooky uses your Gemini API key for transcript analysis.
                  Available models, free allowances, pricing, and quotas depend
                  on your Google project. Check Google AI Studio before running
                  analysis; Hooky does not guarantee free API usage.
                </p>
              </div>

              <div className="faq-item">
                <h3>How does publishing handle retries?</h3>
                <p>
                  Hooky incorporates human-like jitter intervals (60–120 minutes
                  between posts), configurable posting hour windows (e.g. 5 PM
                  to midnight), and atomic upload locks. It marks posts with an
                  uncertain outcome state rather than immediately retrying,
                  reducing accidental double-posts. Publishing still follows
                  Instagram&apos;s rules and cannot guarantee account safety.
                </p>
              </div>

              <div className="faq-item">
                <h3>What should I do if FFmpeg is missing?</h3>
                <p>
                  Run <code>./main.sh doctor</code> (or{" "}
                  <code>.\main.ps1 doctor</code>). The launcher will detect that
                  FFmpeg is missing and offer to install it automatically via
                  your system package manager.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
