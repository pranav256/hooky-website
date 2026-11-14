import { Check, Film, Scissors, Subtitles } from "lucide-react";

export function HeroPreview() {
  return (
    <figure
      className="hero-preview"
      aria-label="Illustrative Hooky clip selection"
    >
      <div className="preview-bar">
        <span>
          <Film size={15} /> Creative Mind / Ep. 024
        </span>
        <span>Sample project</span>
      </div>
      <div className="preview-workspace">
        <div className="preview-portrait">
          <img
            src="/images/portrait.jpg"
            alt="Portrait used to illustrate a vertical clip"
            width="1000"
            height="1000"
            fetchPriority="high"
          />
          <span className="preview-format">9:16 · Center crop</span>
          <div className="preview-caption">
            Make something<strong>worth watching.</strong>
          </div>
        </div>
        <div className="preview-cut">
          <span className="eyebrow">Selected moment</span>
          <h2>Start before you feel ready.</h2>
          <p>“The best work starts when you stop waiting for permission.”</p>
          <div className="preview-range">
            <Scissors size={16} />
            <span>
              04:12 <span>→</span> 04:46
            </span>
            <strong>34s</strong>
          </div>
          <div className="preview-track" aria-hidden="true">
            {Array.from({ length: 32 }, (_, i) => (
              <i key={i} style={{ height: `${20 + ((i * 23) % 70)}%` }} />
            ))}
          </div>
          <div className="preview-ready">
            <Subtitles size={16} /> Captions corrected <Check size={14} />
          </div>
          <a href="#cockpit" className="text-action">
            Try this sample cut <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      <figcaption>
        Illustrative preview. Your footage, your final cut.
      </figcaption>
    </figure>
  );
}
