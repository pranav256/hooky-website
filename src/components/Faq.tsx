import { ChevronDown } from "lucide-react";

export function Faq() {
  const faqs = [
    {
      q: "Can I run Hooky without a dedicated GPU?",
      a: "Yes! Hooky auto-profiles your system on startup. If no NVIDIA CUDA GPU or Apple Silicon Metal GPU is found, it automatically switches faster-whisper to int8 CPU mode and leverages multi-threaded CPU FFmpeg encoding.",
    },
    {
      q: "Does Google Gemini 2.0 Flash cost money?",
      a: "Google Gemini 2.0 Flash has a generous 100% free tier in Google AI Studio (up to 15 Requests Per Minute with no credit card required). Since Hooky sends only transcripts and timestamped text (not large video files), token consumption is very low and comfortably stays within the free quota.",
    },
    {
      q: "How does the smart video framing (Center Crop vs Canvas Fit) work?",
      a: "Hooky offers two framing modes: --mode center applies a focused 1080x1920 portrait crop on the primary active speaker, while --mode fit centers the full 16:9 widescreen video over an ambient blurred background duplicate so two-person conversations or slides never get chopped off.",
    },
    {
      q: "Which subtitle styles are supported in Hooky?",
      a: "Hooky includes 6 built-in ASS subtitle styles: hormozi (bold yellow word pop), gold / titanium (luxury champagne highlight), clean (modern sans with frosted backdrop), minimal (editorial serif with underline), emerald (neon-green monospace terminal glow), and crimson (deep ruby impact emphasis). All styles support dynamic word-by-word karaoke timing.",
    },
    {
      q: "How does the anti-ban Instagram queue keep accounts safe?",
      a: "Automated posting at fixed robotic intervals triggers platform spam filters. Hooky implements randomized human cooldown jitter (configurable between 30 minutes and 2 hours), restricts uploads to active daylight hours, and maintains local state checkpoints to prevent duplicate posts.",
    },
    {
      q: "Can I split long masterclasses or podcasts into Part 1, Part 2, etc.?",
      a: "Yes! Run ./hooky.sh parts <video.mp4> --part-duration 60. Hooky automatically calculates segment boundaries, burns sequential 'Part N' badges into the video header, and outputs clean 60-second vertical reels.",
    },
    {
      q: "What are the minimum system requirements?",
      a: "Python 3.10+ and FFmpeg 5.0+. For GPU acceleration, NVIDIA RTX (Turing or newer with NVENC) or Apple Silicon (M1/M2/M3/M4) is recommended, but any modern 4+ core CPU will work cleanly.",
    },
  ];

  return (
    <section id="faq" className="relative z-20 max-w-4xl mx-auto px-4 sm:px-8 mb-24 scroll-mt-24">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#F8FAFC]">Frequently Asked Questions</h2>
        <p className="text-sm text-slate-400 mt-2">Everything you need to know about autonomous clipping with Hooky:</p>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, idx) => (
          <details key={idx} className="p-5 rounded-xl bg-[#10141E] border border-white/[0.08] group cursor-pointer">
            <summary className="flex items-center justify-between font-medium text-white list-none text-sm sm:text-base">
              <span>{faq.q}</span>
              <ChevronDown className="w-4 h-4 text-[#E5C07B] group-open:rotate-180 transition-transform shrink-0 ml-2" />
            </summary>
            <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
