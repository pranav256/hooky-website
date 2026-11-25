"use client";

import { useEffect, useState } from "react";
import { Film, Subtitles } from "lucide-react";

export function HeroPreview() {
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const update = () => setAutoPlay(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  return (
    <figure
      className="hero-preview"
      aria-label="Playable sample source video and Hooky export"
    >
      <div className="preview-bar">
        <span>
          <Film size={15} /> Pexels interview sample
        </span>
        <span>9 seconds - silent footage</span>
      </div>
      <div className="preview-workspace">
        <div className="preview-video-source">
          <video src="/videos/hooky-interview-source.mp4" controls muted autoPlay={autoPlay} loop={autoPlay} playsInline preload="metadata" aria-label="Original landscape interview footage" />
          <span className="preview-format">Landscape source</span>
        </div>
        <div className="preview-video-export">
          <video src="/videos/hooky-interview-export.mp4" controls muted autoPlay={autoPlay} loop={autoPlay} playsInline preload="metadata" aria-label="The same interview rendered as a captioned vertical clip by Hooky's video renderer" />
          <span className="preview-format"><Subtitles size={12} /> Hooky export - 9:16</span>
        </div>
      </div>
      <figcaption>
        Hooky-rendered sample. Demo caption, not transcript; source is silent.
      </figcaption>
    </figure>
  );
}
