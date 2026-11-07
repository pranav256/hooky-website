"use client";
import { useState } from "react";
import {
  ArrowDownToLine,
  Check,
  CheckCircle2,
  Film,
  Folder,
  Play,
  Radio,
  ScanFace,
  Settings2,
  Sparkles,
  Subtitles,
  X,
} from "lucide-react";
import Link from "next/link";
import { HookyMark } from "./brand";
const moments = [
  {
    title: "Make something worth watching",
    quote: "The best work starts when you stop waiting for permission.",
    score: 94,
    time: "04:12",
    duration: "34s",
    image: "portrait",
  },
  {
    title: "Get out of your own way",
    quote: "You don’t have to have it all figured out to begin.",
    score: 89,
    time: "12:38",
    duration: "42s",
    image: "landscape",
  },
  {
    title: "A different kind of perspective",
    quote: "Sometimes the next step is simply looking up.",
    score: 86,
    time: "21:05",
    duration: "28s",
    image: "mountains",
  },
];
export function StudioDemo() {
  const [selected, setSelected] = useState(0),
    [style, setStyle] = useState("bold"),
    [frame, setFrame] = useState("auto"),
    [notice, setNotice] = useState(false),
    [active, setActive] = useState("studio");
  const moment = moments[selected];
  return (
    <div className="studio-demo">
      <div className="demo-titlebar">
        <div className="demo-brand">
          <HookyMark /> hooky<span>studio</span>
        </div>
        <span className="demo-version">INTERACTIVE TOUR</span>
        <span className="demo-engine">
          <span className="live-dot" /> Local engine
        </span>
      </div>
      <div className="demo-shell">
        <aside className="demo-sidebar">
          <div className="demo-workspace">WORKSPACE</div>
          {[
            { id: "studio", label: "Studio", icon: Film },
            { id: "radar", label: "Channel radar", icon: Radio },
            { id: "gallery", label: "Your clips", icon: Folder },
            { id: "settings", label: "Settings", icon: Settings2 },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={active === id ? "active" : ""}
              onClick={() => {
                setActive(id);
                setNotice(false);
              }}
              aria-pressed={active === id}
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}
          <div className="demo-sidebar-bottom">
            <span className="live-dot" /> ON YOUR MACHINE
          </div>
        </aside>
        <div className="demo-main">
          {active === "studio" ? (
            <>
              <div className="demo-heading">
                <div>
                  <span className="overline">
                    THE CREATIVE MIND / EPISODE 024
                  </span>
                  <h3>The good parts.</h3>
                </div>
                <button
                  className="button button-accent button-small"
                  onClick={() => setNotice(true)}
                >
                  <ArrowDownToLine size={14} />
                  Export clip
                </button>
              </div>
              <div className="demo-source">
                <Film size={15} />
                <span>the-creative-mind-024.mp4</span>
                <span>32:18</span>
                <span className="demo-source-ready">
                  <CheckCircle2 size={13} /> Analysis complete
                </span>
              </div>
              <div className="demo-workbench">
                <div className="demo-moments">
                  <div className="demo-panel-title">
                    Your moments <span>03</span>
                  </div>
                  {moments.map((m, i) => (
                    <button
                      key={m.title}
                      className={`moment-card ${selected === i ? "selected" : ""}`}
                      onClick={() => {
                        setSelected(i);
                        setNotice(false);
                      }}
                      aria-pressed={selected === i}
                    >
                      <span className="moment-number">0{i + 1}</span>
                      <span className="moment-info">
                        <strong>{m.title}</strong>
                        <span>
                          {m.time} <span>·</span> {m.duration}
                        </span>
                      </span>
                      <span className="moment-score">
                        {m.score}
                        <Sparkles size={10} />
                      </span>
                    </button>
                  ))}
                  <p className="score-note">
                    AI scores help you choose.
                    <br />
                    They don’t predict performance.
                  </p>
                  <div className="demo-transcript">
                    <span className="demo-panel-title">The opening line</span>
                    <p>“{moment.quote}”</p>
                  </div>
                </div>
                <div className="demo-preview-area">
                  <div className="demo-panel-title">
                    Clip preview <span>1080 × 1920</span>
                  </div>
                  <div className={`demo-preview frame-${frame}`}>
                    <img
                      src={`/images/${moment.image}.jpg`}
                      alt="Sample clip preview"
                      loading="lazy"
                      width="1000"
                      height="1000"
                    />
                    <span className="demo-preview-tag">
                      <ScanFace size={11} />
                      {frame === "auto" ? "Speaker tracking" : "Canvas fit"}
                    </span>
                    <div className={`demo-caption caption-${style}`}>
                      {moment.title.split(" ").slice(0, -2).join(" ")}
                      <strong>
                        {moment.title.split(" ").slice(-2).join(" ")}
                      </strong>
                    </div>
                    <span className="demo-play">
                      <Play size={14} fill="currentColor" />
                    </span>
                  </div>
                </div>
                <div className="demo-inspector">
                  <div className="demo-panel-title">Make it yours</div>
                  <label>Framing</label>
                  <div className="demo-segmented">
                    {["auto", "fit"].map((f) => (
                      <button
                        key={f}
                        aria-pressed={frame === f}
                        className={frame === f ? "active" : ""}
                        onClick={() => setFrame(f)}
                      >
                        {f === "auto" ? "Auto" : "Canvas"}
                      </button>
                    ))}
                  </div>
                  <label>
                    <Subtitles size={12} /> Caption style
                  </label>
                  {["bold", "clean", "minimal"].map((s) => (
                    <button
                      key={s}
                      className={`demo-style ${style === s ? "active" : ""}`}
                      onClick={() => setStyle(s)}
                      aria-pressed={style === s}
                    >
                      <span className={`style-sample sample-${s}`}>Aa</span>
                      <span>
                        {s === "bold"
                          ? "Bold pop"
                          : s === "clean"
                            ? "Clean line"
                            : "Minimal"}
                      </span>
                      {style === s && <Check size={12} />}
                    </button>
                  ))}
                  <div className="demo-output-spec">
                    <span>OUTPUT</span>
                    <strong>Vertical video</strong>
                    <span>9:16 · MP4 · No watermark</span>
                  </div>
                </div>
              </div>
              <div className="demo-timeline">
                <span>{moment.time}</span>
                <div className="demo-wave">
                  {Array.from({ length: 70 }, (_, i) => (
                    <i
                      key={i}
                      style={{ height: `${16 + ((i * 17 + 23) % 74)}%` }}
                    />
                  ))}
                </div>
                <span>{moment.duration}</span>
              </div>
            </>
          ) : (
            <div className="demo-alt">
              <span className="overline">EXPLORE HOOKY</span>
              <h3>
                {active === "radar"
                  ? "Let the next video find you."
                  : active === "gallery"
                    ? "A home for every good moment."
                    : "Your creative defaults."}
              </h3>
              <p>
                {active === "radar"
                  ? "Follow YouTube channels and discover videos to clip. The local studio saves your channel list and runs the pipeline on your machine."
                  : active === "gallery"
                    ? "Preview your finished clips, play them back, and find the files on your own machine. No cloud storage required."
                    : "Choose your AI model, subtitle style, framing, and rendering settings. Your configuration stays in your local Hooky project."}
              </p>
              <div className="demo-alt-visual">
                {active === "radar" ? (
                  <>
                    <Radio size={35} />
                    <span>@your-favorite-creator</span>
                    <span className="live-dot" />
                  </>
                ) : active === "gallery" ? (
                  <>
                    <Folder size={35} />
                    <span>output / your-next-great-clip.mp4</span>
                  </>
                ) : (
                  <>
                    <Settings2 size={35} />
                    <span>Framing: auto · Captions: bold</span>
                  </>
                )}
              </div>
              <Link href="/docs#web-studio" className="text-action">
                Read the studio guide →
              </Link>
              <button
                className="button button-outline"
                onClick={() => setActive("studio")}
              >
                Back to clip editor
              </button>
            </div>
          )}
          {notice && (
            <div className="demo-notice" role="status">
              <Sparkles size={18} />
              <div>
                <strong>Ready to make your own?</strong>
                <p>
                  This is a sample tour. Install Hooky to analyze and export
                  your videos.
                </p>
                <Link href="#install">Get Hooky for free →</Link>
              </div>
              <button
                aria-label="Dismiss export message"
                onClick={() => setNotice(false)}
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="demo-statusbar">
        <span>
          <span className="live-dot" /> SAMPLE PROJECT
        </span>
        <span>
          Preview the controls. Install Hooky to work with your footage.
        </span>
        <span>LOCAL-FIRST, ALWAYS.</span>
      </div>
    </div>
  );
}
