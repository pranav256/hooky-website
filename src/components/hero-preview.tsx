import { Film, Subtitles } from "lucide-react";

export function HeroPreview() {
  return (
    <figure
      className="hero-preview"
      aria-label="Playable sample source video and Hooky export"
    >
      <div className="preview-bar">
        <span>
          <Film size={15} /> Pexels interview sample
        </span>
        <span>9 seconds · silent footage</span>
      </div>
      <div className="preview-workspace">
        <div className="preview-video-source">
          <video src="/videos/hooky-interview-source.mp4" controls muted autoPlay loop playsInline preload="metadata" aria-label="Original landscape interview footage" />
          <span className="preview-format">Source · landscape</span>
        </div>
        <div className="preview-video-export">
          <video src="/videos/hooky-interview-export.mp4" controls muted autoPlay loop playsInline preload="metadata" aria-label="The same interview rendered as a captioned vertical clip by Hooky's video renderer" />
          <span className="preview-format"><Subtitles size={12} /> Hooky · 9:16 export</span>
        </div>
      </div>
      <figcaption>
        Actual Hooky render. The on-screen sample caption is added for demonstration; this silent footage has no transcript.
      </figcaption>
    </figure>
  );
}
