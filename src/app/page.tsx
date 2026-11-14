"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Crop,
  Film,
  FolderOpen,
  HardDrive,
  Radio,
  Search,
  SlidersHorizontal,
  Subtitles,
  Terminal,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { HeroPreview } from "@/components/hero-preview";
import { StudioDemo } from "@/components/studio-demo";
import { INSTALL_COMMANDS, REPO_URL } from "@/lib/constants";
import "./home.css";

const features = [
  {
    icon: Search,
    title: "Find a moment about anything.",
    body: "Add a clip topic to guide hook detection through the transcript. Review the suggestions before you export.",
    detail: "Topic-guided clipping",
    href: "/docs#topic-clipping",
  },
  {
    icon: Subtitles,
    title: "Get the words right.",
    body: "Search caption phrases, correct a name or a line, and preview the changes. Your corrections carry through to the exported clip.",
    detail: "Searchable, editable captions",
    href: "/docs#caption-editing",
  },
  {
    icon: FolderOpen,
    title: "Pick up where you left off.",
    body: "Save a named project with its source, moments, timing, captions and styling. Reopen it after a Studio restart.",
    detail: "Named local projects",
    href: "/docs#named-projects",
  },
];
const steps = [
  {
    n: "01",
    title: "Bring the long version.",
    body: "Paste a YouTube URL in Studio. The CLI also accepts local video files.",
    example: "An interview, a podcast, a deep dive",
    icon: Film,
  },
  {
    n: "02",
    title: "Choose the part that matters.",
    body: "Detect hooks with an optional topic. Read the transcript, choose a moment and adjust the cut.",
    example: "04:12 → 04:46 / 34 seconds",
    icon: Search,
  },
  {
    n: "03",
    title: "Finish it in your style.",
    body: "Correct captions, choose center crop or fit, and render a vertical MP4 on your machine.",
    example: "9:16 / MP4 / No watermark",
    icon: Crop,
  },
];
const faqs = [
  {
    q: "Is Hooky really free?",
    a: "Hooky is free, open-source software under the MIT license. There are no software subscriptions, watermarks or software minute caps. AI hook detection uses your Gemini API key; Google’s API pricing and quotas apply.",
  },
  {
    q: "What stays on my machine?",
    a: "Video processing, transcription, rendering and saved projects run locally. Transcript text is sent to Google Gemini for AI moment selection. Downloading YouTube sources and optional publishing also use external services.",
  },
  {
    q: "Do I need a powerful computer?",
    a: "Hooky runs on Windows, macOS and Linux with Python 3.10 or newer and FFmpeg. A GPU is optional. Processing time depends on hardware, source length and settings. Smaller Whisper models suit modest machines.",
  },
  {
    q: "Can I edit what the AI picks?",
    a: "Yes. Review suggested moments, adjust start and end times, search and correct caption phrases, choose framing and subtitle styles, then export a clip. If a topic finds no matches, try a broader topic or leave it empty.",
  },
  {
    q: "What does a saved project include?",
    a: "The source URL, topic, suggested moments, selected moment, timing, caption corrections, framing and subtitle choices. Projects survive Studio restarts and history cleanup. They do not back up media or sync to the cloud; the source must remain available to export.",
  },
  {
    q: "Is the studio on this page a real editor?",
    a: "It’s an interactive sample tour. Sample saves last only for this page visit. Install Hooky to open the real Studio at 127.0.0.1:8000 and work with your own videos.",
  },
];

export default function Home() {
  const [os, setOs] = useState<"unix" | "windows">("unix");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  useEffect(() => {
    if (/Win/i.test(navigator.userAgent)) setOs("windows");
  }, []);
  const commands = INSTALL_COMMANDS[os];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(commands);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  };
  return (
    <div id="top" className="website">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">
        <section className="hero-section">
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="live-dot" /> Open-source video clipper
              </p>
              <h1>
                Long story.
                <br />
                <span>Short form.</span>
              </h1>
              <p className="hero-description">
                Turn long videos into captioned shorts. Find moments by topic,
                refine the cut, and save your work in a local Studio.
              </p>
              <div className="hero-buttons">
                <a className="button button-accent" href="#install">
                  Get Hooky <ArrowUpRight size={18} />
                </a>
                <a className="button button-outline" href="#cockpit">
                  Try the sample Studio <ArrowDown size={16} />
                </a>
              </div>
              <p className="hero-footnote">
                <Check size={15} /> Free software · No watermark · Windows,
                macOS &amp; Linux
              </p>
            </div>
            <HeroPreview />
          </div>
          <div className="hero-rail">
            <span>Built for interviews, podcasts and ideas worth sharing.</span>
            <span>Shorts / Reels / TikTok</span>
          </div>
        </section>

        <section id="capabilities" className="section features-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Inside Hooky</p>
              <h2>
                A better way to
                <br />
                find your next cut.
              </h2>
            </div>
            <p>
              AI helps you find a starting point. Studio gives you the controls
              to finish it.
            </p>
          </div>
          <div className="feature-list">
            {features.map(({ icon: Icon, title, body, detail, href }, i) => (
              <article className="feature-row" key={title}>
                <div className="feature-label">
                  <Icon size={22} />
                  <span>{detail}</span>
                </div>
                <div>
                  <span className="feature-number">0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
                <Link
                  href={href}
                  aria-label={`Read about ${detail.toLowerCase()}`}
                >
                  <ArrowUpRight size={22} />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="section workflow-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">From source to short</p>
              <h2>Three steps. Your final call.</h2>
            </div>
            <Link className="text-action" href="/docs#quickstart">
              Read the quickstart <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="workflow-grid">
            {steps.map(({ n, title, body, example, icon: Icon }) => (
              <article className="workflow-step" key={n}>
                <div className="step-top">
                  <span>{n}</span>
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
                <span className="step-example">{example}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="cockpit" className="section studio-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The local Studio</p>
              <h2>The cut is yours.</h2>
            </div>
            <p>
              Try topic filtering, change a caption, then save and reopen a
              sample project. This tour uses sample data.
            </p>
          </div>
          <StudioDemo />
          <div className="studio-details">
            <span>
              <Crop size={16} /> Center crop &amp; fit
            </span>
            <span>
              <Subtitles size={16} /> Caption presets
            </span>
            <span>
              <FolderOpen size={16} /> Saved projects
            </span>
            <Link href="/docs#web-studio">
              Read the Studio guide <ArrowUpRight size={15} />
            </Link>
          </div>
        </section>

        <section className="toolkit-section">
          <div className="section toolkit-inner">
            <div>
              <p className="eyebrow">The rest of your toolkit</p>
              <h2>More than a single cut.</h2>
            </div>
            <div className="toolkit-grid">
              <article>
                <Radio size={22} />
                <h3>Channel radar</h3>
                <p>
                  Keep a local list of YouTube channels and discover videos to
                  run through the pipeline.
                </p>
              </article>
              <article>
                <Terminal size={22} />
                <h3>A scriptable CLI</h3>
                <p>
                  Process local files, run the parts pipeline, and schedule jobs
                  from your terminal.
                </p>
              </article>
              <article>
                <SlidersHorizontal size={22} />
                <h3>Practical controls</h3>
                <p>
                  Choose model and render settings, check dependencies, review
                  output, and cancel or retry jobs.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="compare" className="section ownership-section">
          <div className="ownership-copy">
            <p className="eyebrow">Own your workflow</p>
            <h2>
              Your machine.
              <br />
              Your creative toolkit.
            </h2>
            <p>
              Local transcription and rendering. Projects saved on disk. Source
              code you can inspect and change.
            </p>
            <a
              href={REPO_URL}
              className="text-action"
              target="_blank"
              rel="noreferrer"
            >
              Explore the engine on GitHub <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="ownership-proof">
            <span className="eyebrow">Software price</span>
            <div className="price-display">
              $0<span> / MIT licensed</span>
            </div>
            <ul>
              <li>
                <Check size={16} /> No software minute limits
              </li>
              <li>
                <Check size={16} /> No watermark on exported clips
              </li>
              <li>
                <HardDrive size={16} /> CPU rendering supported; GPU optional
              </li>
            </ul>
            <p className="api-note">
              AI moment selection sends transcript text to Gemini using your
              key. Google’s pricing and quotas apply.
            </p>
          </div>
        </section>

        <section id="install" className="section install-section">
          <div className="install-intro">
            <p className="eyebrow">Get started</p>
            <h2>Make your first cut.</h2>
            <p>
              Clone Hooky and check your dependencies. Then run setup, add your
              Gemini key, and launch Studio.
            </p>
            <div className="install-requirements">
              <strong>You’ll need</strong>
              <p>
                Git · Python 3.10+ · FFmpeg
                <br />
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                >
                  A Gemini API key <ArrowUpRight size={13} />
                </a>{" "}
                for AI selection
              </p>
            </div>
            <Link className="text-action" href="/docs#quickstart">
              Full setup instructions <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="install-terminal">
            <div className="terminal-bar">
              <span>
                <Terminal size={16} /> Clone &amp; check dependencies
              </span>
              <span>01 / 03</span>
            </div>
            <div className="os-tabs" role="group" aria-label="Operating system">
              {(["unix", "windows"] as const).map((value) => (
                <button
                  key={value}
                  className={os === value ? "active" : ""}
                  aria-pressed={os === value}
                  onClick={() => {
                    setOs(value);
                    setCopyState("idle");
                  }}
                >
                  {value === "unix" ? "macOS / Linux" : "Windows"}
                </button>
              ))}
            </div>
            <div className="terminal-code">
              <pre>{commands}</pre>
            </div>
            <div className="terminal-bottom">
              <span>Run in {os === "unix" ? "Terminal" : "PowerShell"}.</span>
              <button
                onClick={copy}
                className="button button-outline button-small"
              >
                {copyState === "copied" ? (
                  <Check size={15} />
                ) : (
                  <Copy size={15} />
                )}
                {copyState === "copied" ? "Copied" : "Copy commands"}
              </button>
            </div>
            <p className="copy-feedback" role="status">
              {copyState === "error"
                ? "Clipboard unavailable. Select and copy the commands above."
                : copyState === "copied"
                  ? "Commands copied. Paste them into your terminal."
                  : "The doctor command checks your environment."}
            </p>
            <div className="install-next">
              <span>
                <b>02</b> Configure{" "}
                <code>
                  {os === "unix" ? "./main.sh setup" : ".\\main.ps1 setup"}
                </code>
              </span>
              <span>
                <b>03</b> Launch{" "}
                <code>
                  {os === "unix" ? "./main.sh web" : ".\\main.ps1 web"}
                </code>
              </span>
            </div>
          </div>
        </section>

        <section className="section faq-section">
          <div className="faq-heading">
            <p className="eyebrow">Before you install</p>
            <h2>A few useful answers.</h2>
            <p>
              More questions?{" "}
              <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">
                Ask on GitHub <ArrowUpRight size={13} />
              </a>
            </p>
          </div>
          <div className="faq-accordion">
            {faqs.map((faq, i) => (
              <div
                className={`faq-row ${openFaq === i ? "open" : ""}`}
                key={faq.q}
              >
                <h3>
                  <button
                    id={`faq-question-${i}`}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} />
                  </button>
                </h3>
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  hidden={openFaq !== i}
                >
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="closing-section">
          <div>
            <p className="eyebrow">Your next short starts here</p>
            <h2>Keep the good parts.</h2>
          </div>
          <a className="button button-accent" href="#install">
            Get Hooky <ArrowUpRight size={18} />
          </a>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
