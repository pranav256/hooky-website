import { useState, type CSSProperties } from "react"

const repo = "https://github.com/pranav256/Hooky"
const command = "git clone https://github.com/pranav256/Hooky.git"

type IconName = "arrow" | "check" | "copy" | "github" | "menu" | "play" | "spark" | "x"

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
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
    play: <path d="m9 7 8 5-8 5Z" />,
    spark: (
      <>
        <path d="M12 2c.6 5.9 2.1 7.4 8 8-5.9.6-7.4 2.1-8 8-.6-5.9-2.1-7.4-8-8 5.9-.6 7.4-2.1 8-8Z" />
        <path d="M19 17v5M16.5 19.5h5" />
      </>
    ),
    x: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

const steps = [
  {
    n: "01",
    title: "Find the moment",
    text: "Gemini reads the whole transcript for complete ideas, tension, and payoff—not clickbait scores.",
  },
  {
    n: "02",
    title: "Frame the speaker",
    text: "Smart crop follows the voice. Canvas mode keeps wide, two-person conversations intact.",
  },
  {
    n: "03",
    title: "Make it readable",
    text: "Word-level timing turns faster-whisper transcripts into six animated caption styles.",
  },
  {
    n: "04",
    title: "Render locally",
    text: "FFmpeg exports polished 9:16 video on your machine. No uploads, queues, or minute limits.",
  },
]

const comparisons = [
  ["Monthly cost", "$0, forever", "$19–99 / month"],
  ["Processing", "On your machine", "Third-party cloud"],
  ["Usage limits", "None", "Credit or minute caps"],
  ["Interfaces", "Web studio + CLI", "Browser only"],
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState<"crop" | "canvas">("crop")
  const [caption, setCaption] = useState<"bold" | "clean" | "mono">("bold")
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const copyCommand = async () => {
    await navigator.clipboard?.writeText(`${command} && cd Hooky && ./main.sh`)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="site-shell">
      <header className="nav-wrap">
        <a className="wordmark" href="#top" aria-label="Hooky home">
          <span className="mark">
            <span>H</span>
          </span>
          <span>HOOKY</span>
        </a>
        <nav
          className={menuOpen ? "nav-links open" : "nav-links"}
          aria-label="Primary navigation"
        >
          <a href="#how" onClick={() => setMenuOpen(false)}>
            How it works
          </a>
          <a href="#compare" onClick={() => setMenuOpen(false)}>
            Why local
          </a>
          <a href="#install" onClick={() => setMenuOpen(false)}>
            Install
          </a>
          <a className="mobile-github" href={repo}>
            GitHub
          </a>
        </nav>
        <div className="nav-actions">
          <a
            className="github-link"
            href={repo}
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
            <Icon name={menuOpen ? "x" : "menu"} size={22} />
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> Open source. Runs locally.
            </p>
            <h1>
              One long video.
              <br />
              <em>Only the good parts.</em>
            </h1>
            <p className="hero-lede">
              Hooky finds the moments worth watching, reframes them for vertical
              video, and adds captions—without sending your footage to a cloud.
            </p>
            <div className="hero-actions">
              <a className="primary-cta" href="#install">
                Install for free <Icon name="arrow" />
              </a>
              <a
                className="text-link"
                href={repo}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="github" /> View source
              </a>
            </div>
            <p className="microcopy">
              MIT licensed · macOS, Windows & Linux · no credit card
            </p>
          </div>

          <div
            className="studio-scene"
            style={
              {
                "--tilt-x": `${tilt.x}deg`,
                "--tilt-y": `${tilt.y}deg`,
              } as CSSProperties
            }
            onPointerMove={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect()
              const x = (event.clientX - bounds.left) / bounds.width - 0.5
              const y = (event.clientY - bounds.top) / bounds.height - 0.5
              setTilt({ x: y * -7, y: x * 9 })
            }}
            onPointerLeave={() => setTilt({ x: 0, y: 0 })}
          >
            <div className="orbit-card orbit-card-one" aria-hidden="true">
              <span>9:16</span>
            </div>
            <div className="orbit-card orbit-card-two" aria-hidden="true">
              <Icon name="spark" size={24} />
            </div>
            <div className="orbit-ring" aria-hidden="true" />
            <div
              className="studio"
              aria-label="Interactive Hooky studio preview"
            >
              <div className="studio-bar">
                <div className="traffic">
                  <i />
                  <i />
                  <i />
                </div>
                <span>hooky / studio</span>
                <span className="live">
                  <i /> LIVE PREVIEW
                </span>
              </div>
              <div className="studio-body">
                <aside className="studio-controls">
                  <div>
                    <label>FRAME</label>
                    <button
                      className={mode === "crop" ? "selected" : ""}
                      onClick={() => setMode("crop")}
                    >
                      <span>Portrait crop</span>
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
                    <label>CAPTION</label>
                    {(["bold", "clean", "mono"] as const).map((item) => (
                      <button
                        key={item}
                        className={caption === item ? "selected" : ""}
                        onClick={() => setCaption(item)}
                      >
                        <span>
                          {item === "bold"
                            ? "Bold pop"
                            : item === "clean"
                              ? "Clean line"
                              : "Mono cut"}
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
                      {mode === "crop" ? "ACTIVE SPEAKER" : "FULL FRAME"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="timeline">
                <div className="timeline-meta">
                  <span>Potential hook detected</span>
                  <strong>00:14:08 — 00:14:42</strong>
                </div>
                <div className="waveform">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <i key={i} style={{ height: `${20 + ((i * 23) % 72)}%` }} />
                  ))}
                </div>
                <div className="selection" />
              </div>
            </div>
          </div>
        </section>

        <section className="proof-strip" aria-label="Product benefits">
          <div>
            <strong>$0</strong>
            <span>No subscription</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>Local rendering</span>
          </div>
          <div>
            <strong>6</strong>
            <span>Caption styles</span>
          </div>
          <div>
            <strong>∞</strong>
            <span>Video minutes</span>
          </div>
        </section>

        <section className="process section" id="how">
          <div className="section-heading">
            <p className="kicker">THE PIPELINE</p>
            <h2>
              From two hours
              <br />
              to thirty seconds.
            </h2>
            <p>
              Four steps. One local workflow. No tedious timeline scrubbing.
            </p>
          </div>
          <div className="steps">
            {steps.map((step) => (
              <article key={step.n}>
                <span>{step.n}</span>
                <div className="step-icon">
                  <Icon
                    name={
                      step.n === "01"
                        ? "spark"
                        : step.n === "04"
                          ? "check"
                          : "arrow"
                    }
                  />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="manifesto">
          <div className="manifesto-label">
            LOCAL-FIRST
            <br />
            BY DESIGN
          </div>
          <blockquote>
            “Your raw footage belongs on <em>your</em> machine.”
          </blockquote>
          <p>
            Hooky sends only transcript text for semantic analysis. Video
            processing, caption rendering, and final exports stay with you.
          </p>
        </section>

        <section className="comparison section" id="compare">
          <div className="comparison-copy">
            <p className="kicker">A BETTER DEFAULT</p>
            <h2>
              Software you own.
              <br />
              Not another tab you rent.
            </h2>
            <p>
              Cloud video tools add queues, caps, and a monthly bill. Hooky uses
              the hardware already on your desk.
            </p>
            <a
              className="text-link dark"
              href={repo}
              target="_blank"
              rel="noreferrer"
            >
              Read the code <Icon name="arrow" />
            </a>
          </div>
          <div className="compare-table">
            <div className="compare-head">
              <span>CAPABILITY</span>
              <strong>HOOKY</strong>
              <span>CLOUD TOOLS</span>
            </div>
            {comparisons.map(([feature, hooky, cloud]) => (
              <div className="compare-row" key={feature}>
                <span>{feature}</span>
                <strong>
                  <Icon name="check" size={16} /> {hooky}
                </strong>
                <span>{cloud}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="install section" id="install">
          <div className="install-copy">
            <p className="kicker">GET STARTED</p>
            <h2>
              Your first clip is
              <br />
              one command away.
            </h2>
            <p>
              Clone the repo, run the launcher, and Hooky opens its local studio
              in your browser.
            </p>
          </div>
          <div className="terminal">
            <div className="terminal-top">
              <span>TERMINAL</span>
              <span>~/projects</span>
            </div>
            <div className="command">
              <span>$</span>
              <code>{command}</code>
            </div>
            <div className="command">
              <span>$</span>
              <code>cd Hooky && ./main.sh</code>
            </div>
            <button onClick={copyCommand}>
              <Icon name={copied ? "check" : "copy"} />{" "}
              {copied ? "Copied" : "Copy commands"}
            </button>
            <p>
              <Icon name="check" size={15} /> Auto-detects your OS and installs
              dependencies.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <div>
          <a className="wordmark inverse" href="#top">
            <span className="mark">
              <span>H</span>
            </span>
            <span>HOOKY</span>
          </a>
          <p>Make the cut. Keep the footage.</p>
        </div>
        <div className="footer-links">
          <a href={repo}>GitHub</a>
          <a href={`${repo}#readme`}>Docs</a>
          <a href={`${repo}/issues`}>Issues</a>
        </div>
        <p className="copyright">OPEN SOURCE · MIT LICENSE</p>
      </footer>
    </div>
  )
}

export default App
