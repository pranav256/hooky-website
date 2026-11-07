"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  Pause,
  Play,
  ScanFace,
  Sparkles,
  VolumeX,
} from "lucide-react";
export function ClipCollage() {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [frame, setFrame] = useState<"track" | "fit">("track");
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(media.matches);
      if (media.matches) setPlaying(false);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!playing || reduced) return;
    const t = setInterval(() => setProgress((p) => (p + 1) % 100), 180);
    return () => clearInterval(t);
  }, [playing, reduced]);
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--pointer-x",
      `${((event.clientX - bounds.left) / bounds.width - 0.5) * 8}deg`,
    );
    event.currentTarget.style.setProperty(
      "--pointer-y",
      `${-((event.clientY - bounds.top) / bounds.height - 0.5) * 5}deg`,
    );
  };
  return (
    <div
      className={`clip-collage ${playing ? "is-playing" : ""}`}
      ref={root}
      onPointerMove={move}
      onPointerLeave={() => {
        root.current?.style.setProperty("--pointer-x", "0deg");
        root.current?.style.setProperty("--pointer-y", "0deg");
      }}
      aria-label="Interactive example of Hooky vertical clips"
    >
      <div className="collage-grid" aria-hidden="true" />
      <div className="collage-label">
        <span className="live-dot" /> LONG FORM → SHORT FORM
      </div>
      <div className="collage-orbit" aria-hidden="true" />
      <div className="clip-card clip-card-back">
        <img
          src="/images/mountains.jpg"
          alt="A mountain beneath a star-filled sky"
          width="1000"
          height="667"
        />
        <span className="clip-topline">
          TRAVEL JOURNAL <ArrowUpRight size={12} />
        </span>
        <div className="clip-quote">
          Go somewhere
          <br />
          <em>unexpected.</em>
        </div>
        <span className="clip-bottomline">
          00:28 <span>9:16</span>
        </span>
      </div>
      <div className="clip-card clip-card-side">
        <img
          src="/images/landscape.jpg"
          alt="Golden light across a green landscape"
          width="1000"
          height="667"
        />
        <span className="clip-topline">
          OUTSIDE THE LINES <ArrowUpRight size={12} />
        </span>
        <div className="clip-quote">
          LESS SCROLL.
          <br />
          <strong>MORE SOUL.</strong>
        </div>
        <span className="clip-bottomline">
          00:42 <span>9:16</span>
        </span>
      </div>
      <div
        className={`clip-card clip-card-main ${frame === "fit" ? "canvas-fit" : ""}`}
      >
        <img
          src="/images/portrait.jpg"
          alt="Sample portrait used to demonstrate speaker framing"
          width="1000"
          height="1000"
          fetchPriority="high"
        />
        <div className="tracking-corners" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
        <span className="clip-topline">
          <span className="live-dot" /> THE CREATIVE MIND <VolumeX size={13} />
        </span>
        <div className="clip-quote">
          <span>MAKE SOMETHING</span>
          <strong>{progress < 50 ? "WORTH" : "YOU’RE"}</strong>
          <strong className="caption-highlight">
            {progress < 50 ? "WATCHING." : "PROUD OF."}
          </strong>
        </div>
        <div className="clip-playback">
          <button
            aria-label={
              reduced
                ? "Show next sample caption"
                : playing
                  ? "Pause sample animation"
                  : "Play sample animation"
            }
            onClick={() =>
              reduced
                ? setProgress((p) => (p + 50) % 100)
                : setPlaying(!playing)
            }
          >
            {reduced ? (
              <ChevronRight size={16} />
            ) : playing ? (
              <Pause size={14} fill="currentColor" />
            ) : (
              <Play size={14} fill="currentColor" />
            )}
          </button>
          <span className="clip-progress">
            <i style={{ width: `${progress}%` }} />
          </span>
          <span>00:{String(Math.floor(progress * 0.34)).padStart(2, "0")}</span>
        </div>
      </div>
      <div className="detected-float">
        <span className="detected-icon">
          <Sparkles size={17} />
        </span>
        <div>
          <strong>A good moment, found.</strong>
          <span>AI-selected · Sample preview</span>
        </div>
        <span className="detected-check">✓</span>
      </div>
      <button
        className="framing-float"
        onClick={() => setFrame(frame === "track" ? "fit" : "track")}
        aria-label={`Framing: ${frame === "track" ? "Speaker tracking" : "Canvas fit"}. Click to switch.`}
      >
        <ScanFace size={17} />
        <span>{frame === "track" ? "Speaker tracking" : "Canvas fit"}</span>
        <span className="framing-dimension">9:16</span>
      </button>
      <div className="collage-note">EXAMPLE CLIPS · YOUR CONTENT GOES HERE</div>
    </div>
  );
}
