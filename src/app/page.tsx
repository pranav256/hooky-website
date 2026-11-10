"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Code2,
  HardDrive,
  Infinity as InfinityIcon,
  Layers,
  ScanFace,
  Sparkles,
  Subtitles,
  Terminal,
  WandSparkles,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import { ClipCollage } from "@/components/clip-collage";
import { StudioDemo } from "@/components/studio-demo";
import { HookyMark } from "@/components/brand";
import { INSTALL_COMMANDS, REPO_URL } from "@/lib/constants";
const steps = [
  {
    n: "01",
    title: "Give it the long version.",
    body: "Drop in a YouTube link or feed the pipeline a local video. Podcasts, interviews, deep dives. Start with what you already make.",
    icon: Layers,
    tag: "YOUR VIDEO, YOUR STARTING POINT",
  },
  {
    n: "02",
    title: "Find the can’t-skip parts.",
    body: "AI reads your transcript to find compelling moments. Review the suggestions, adjust the cut, and make the final call.",
    icon: Sparkles,
    tag: "AI FINDS. YOU DECIDE.",
  },
  {
    n: "03",
    title: "Make it a short story.",
    body: "Reframe for vertical video, add word-level captions, and render on your machine. Ready for Shorts, Reels, or TikTok.",
    icon: WandSparkles,
    tag: "ONE CLIP. EVERY FEED.",
  },
];
const faqs = [
  {
    q: "Is Hooky really free?",
    a: "Hooky is free, open-source software under the MIT license. There are no subscriptions, watermarks, or software usage caps. AI hook detection uses your Google Gemini API key; Google’s API pricing and quotas apply.",
  },
  {
    q: "What stays on my machine?",
    a: "Video processing, transcription, and rendering run locally. Transcript text is sent to Google Gemini for AI moment selection. Downloading YouTube sources and optional publishing also use external services.",
  },
  {
    q: "Do I need a powerful computer?",
    a: "Hooky runs on Windows, macOS, and Linux with Python 3.10 or newer and FFmpeg. A GPU is optional. Processing time depends on your hardware, source length, and settings; smaller Whisper models work better on modest machines.",
  },
  {
    q: "Can I edit what the AI picks?",
    a: "Yes. The local web studio lets you review hook candidates, inspect transcripts, adjust start and end times, choose framing and subtitle styles, and export individual clips.",
  },
  {
    q: "Is the studio on this page a real editor?",
    a: "It’s an interactive sample tour so you can explore the controls. Install Hooky to open the real studio in your browser at 127.0.0.1:8000 and work with your videos.",
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
    const nodes = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);
  const commands = INSTALL_COMMANDS[os];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(commands);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    setTimeout(() => setCopyState("idle"), 3000);
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
              <div className="hero-eyebrow">
                <span className="live-dot" />
                <span>OPEN SOURCE. WIDE OPEN POSSIBILITIES.</span>
              </div>
              <h1>
                Long story.
                <br />
                <span className="hero-accent">
                  Short form<span className="hero-period">.</span>
                </span>
              </h1>
              <p className="hero-description">
                Your best moments are already in there.
                <br />
                Hooky finds them, frames them, and turns long videos into
                shorts.
              </p>
              <div className="hero-buttons">
                <a className="button button-accent" href="#install">
                  Make your first clip <ArrowUpRight size={20} />
                </a>
                <a className="button button-quiet" href="#cockpit">
                  Explore the studio <ArrowDown size={16} />
                </a>
              </div>
              <div className="hero-footnote">
                <CheckCircle2 size={13} />
                <span>Free software.</span>
                <span>No watermarks.</span>
                <span>Yours to keep.</span>
              </div>
              <div className="hero-bottom">
                <span>BUILT FOR THE WAY YOU CREATE.</span>
                <span className="hero-platforms">
                  SHORTS <span>/</span> REELS <span>/</span> TIKTOK
                </span>
              </div>
            </div>
            <ClipCollage />
          </div>
          <div className="hero-rail">
            <span>FROM THE FULL STORY TO THE FIRST THREE SECONDS.</span>
            <span>
              SCROLL TO FIND THE GOOD PARTS <ArrowDown size={13} />
            </span>
          </div>
        </section>
        <section
          id="capabilities"
          className="benefit-strip"
          aria-label="Hooky benefits"
        >
          <div>
            <HardDrive size={19} />
            <span>Runs on your machine</span>
          </div>
          <div>
            <InfinityIcon size={22} />
            <span>No software minute caps</span>
          </div>
          <div>
            <Subtitles size={19} />
            <span>Captions with character</span>
          </div>
          <div>
            <Code2 size={19} />
            <span>Open source. All yours.</span>
          </div>
        </section>
        <section id="workflow" className="section workflow-section">
          <div className="section-heading reveal">
            <div>
              <p className="overline">
                <span>01 /</span> THE PROCESS
              </p>
              <h2>
                Less timeline.
                <br />
                More <span className="serif-word">spotlight.</span>
              </h2>
            </div>
            <p>
              You make the long-form magic.
              <br />
              Let Hooky handle the short-form heavy lifting.
            </p>
          </div>
          <div className="workflow-grid">
            {steps.map(({ n, title, body, icon: Icon, tag }) => (
              <article className="workflow-step reveal" key={n}>
                <div className="step-top">
                  <span>{n}</span>
                  <Icon size={23} />
                </div>
                <div
                  className={`step-illustration step-${n}`}
                  aria-hidden="true"
                >
                  {n === "01" ? (
                    <>
                      <div className="source-thumbnail">
                        <img
                          src="/images/landscape.jpg"
                          alt=""
                          width="1000"
                          height="667"
                          loading="lazy"
                        />
                        <span>THE FULL STORY</span>
                        <span>32:18</span>
                      </div>
                      <div className="source-label">
                        <Layers size={13} /> episode-024.mp4 <Check size={13} />
                      </div>
                    </>
                  ) : n === "02" ? (
                    <>
                      <div className="selection-wave">
                        {Array.from({ length: 36 }, (_, i) => (
                          <i
                            key={i}
                            style={{ height: `${15 + ((i * 19) % 65)}%` }}
                          />
                        ))}
                      </div>
                      <div className="selection-window">
                        <span>
                          <Sparkles size={12} /> MOMENT FOUND
                        </span>
                        <i />
                      </div>
                      <div className="wave-times">
                        <span>04:12</span>
                        <span>04:46</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mini-clip">
                        <img
                          src="/images/portrait.jpg"
                          alt=""
                          width="1000"
                          height="1000"
                          loading="lazy"
                        />
                        <strong>
                          WORTH
                          <br />
                          <span>WATCHING.</span>
                        </strong>
                      </div>
                      <div className="mini-clip-label">
                        <ArrowUpRight size={18} />
                        <span>
                          REFRAMED.
                          <br />
                          RECAPTIONED.
                          <br />
                          READY.
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
                <span className="step-tag">{tag}</span>
              </article>
            ))}
          </div>
        </section>
        <section id="cockpit" className="section studio-section">
          <div className="section-heading reveal">
            <div>
              <p className="overline">
                <span>02 /</span> YOUR CREATIVE CONTROL ROOM
              </p>
              <h2>
                Meet your new
                <br />
                <span className="serif-word">favorite tab.</span>
              </h2>
            </div>
            <div>
              <p>
                All the clever stuff, with you in control.
                <br />
                Pick a moment. Change its look. Make it yours.
              </p>
              <span className="try-hint">
                <span className="live-dot" /> TRY THE CONTROLS BELOW
              </span>
            </div>
          </div>
          <div className="reveal">
            <StudioDemo />
          </div>
          <div className="studio-details">
            <span>
              <ScanFace size={16} /> Smart reframing
            </span>
            <span>
              <Subtitles size={16} /> Word-level captions
            </span>
            <span>
              <Terminal size={16} /> A CLI for the power users
            </span>
            <Link href="/docs#web-studio">
              Go deeper into the studio <ArrowUpRight size={14} />
            </Link>
          </div>
        </section>
        <section className="ownership-section" id="compare">
          <div className="ownership-inner">
            <div className="ownership-copy reveal">
              <p className="overline">
                <span>03 /</span> BUILT DIFFERENT, ON PURPOSE
              </p>
              <h2>
                Your footage.
                <br />
                Your machine.
                <br />
                <span>Your rules.</span>
              </h2>
              <p>
                No monthly plan to cancel. No watermark to crop out. No software
                credits to count. Just an open-source tool that belongs in your
                creative toolkit.
              </p>
              <a
                className="text-action"
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
              >
                Go ahead. Look under the hood. <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="ownership-proof reveal">
              <span className="proof-label">THE PRICE OF CREATIVE FREEDOM</span>
              <div className="price-display">
                <span>$</span>0<span className="price-period">.</span>
              </div>
              <p>Free software. Full creative control.</p>
              <div className="ownership-checks">
                <span>
                  <Check size={16} /> No watermarks or software minute limits
                </span>
                <span>
                  <Check size={16} /> Local transcription and rendering
                </span>
                <span>
                  <Check size={16} /> MIT licensed. Modify it. Make it yours.
                </span>
                <span>
                  <Check size={16} /> Windows, macOS, and Linux
                </span>
              </div>
              <span className="api-note">
                AI selection uses your Gemini API key.
                <br />
                Google’s API pricing and quotas apply.
              </span>
              <HookyMark className="ownership-mark" />
            </div>
          </div>
        </section>
        <section id="install" className="section install-section">
          <div className="install-intro reveal">
            <p className="overline">
              <span>04 /</span> YOUR NEXT GOOD IDEA STARTS HERE
            </p>
            <h2>
              Let’s make
              <br />
              the <span className="serif-word">cut.</span>
              <span className="install-arrow">↗</span>
            </h2>
            <p>
              Clone it. Launch it. Create something.
              <br />
              Check dependencies, configure your key, then open the local
              studio.
            </p>
            <div className="install-requirements">
              <span>YOU’LL NEED</span>
              <p>
                Git · Python 3.10+ · FFmpeg
                <br />A{" "}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                >
                  Gemini API key <ArrowUpRight size={11} />
                </a>{" "}
                for AI moment selection
              </p>
            </div>
            <Link className="text-action" href="/docs">
              Need a hand? Read the setup guide <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="install-terminal reveal">
            <div className="terminal-bar">
              <span>
                <Terminal size={15} /> HELLO, HOOKY.
              </span>
              <span>QUICKSTART</span>
            </div>
            <div className="os-tabs" role="group" aria-label="Operating system">
              <button
                className={os === "unix" ? "active" : ""}
                aria-pressed={os === "unix"}
                onClick={() => {
                  setOs("unix");
                  setCopyState("idle");
                }}
              >
                macOS / Linux
              </button>
              <button
                className={os === "windows" ? "active" : ""}
                aria-pressed={os === "windows"}
                onClick={() => {
                  setOs("windows");
                  setCopyState("idle");
                }}
              >
                Windows
              </button>
            </div>
            <div className="terminal-code">
              <p className="terminal-comment">
                # A little setup. A lot of possibility.
              </p>
              <pre>
                {commands.split("\n").map((line, i) => (
                  <span key={line}>
                    <i>{os === "unix" ? "$" : ">"}</i>
                    {line}
                    {i < commands.split("\n").length - 1 ? "\n" : ""}
                  </span>
                ))}
              </pre>
            </div>
            <div className="terminal-bottom">
              <span>
                <span className="live-dot" /> YOUR MACHINE IS THE STUDIO.
              </span>
              <button
                onClick={copy}
                className="button button-outline button-small"
              >
                {copyState === "copied" ? (
                  <Check size={14} />
                ) : (
                  <Copy size={14} />
                )}{" "}
                {copyState === "copied" ? "Copied!" : "Copy commands"}
              </button>
            </div>
            <p className="copy-feedback" role="status">
              {copyState === "error"
                ? "Clipboard unavailable. Select and copy the commands above."
                : copyState === "copied"
                  ? "Commands copied. Paste them into your terminal."
                  : "Run in Terminal or PowerShell. Follow the launcher’s setup prompts."}
            </p>
          </div>
        </section>
        <section className="section faq-section">
          <div className="faq-heading reveal">
            <p className="overline">BEFORE YOU HIT RECORD</p>
            <h2>
              A few good
              <br />
              <span className="serif-word">questions.</span>
            </h2>
            <p>
              Anything else?{" "}
              <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">
                Ask on GitHub ↗
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
          <span className="overline">MAKE THE MOST OF WHAT YOU MAKE.</span>
          <a href="#install">
            Stay creative.
            <br />
            <span>Get hooky.</span>
            <ArrowUpRight aria-hidden="true" />
          </a>
          <span className="closing-label">THE GOOD PARTS ARE WAITING.</span>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
