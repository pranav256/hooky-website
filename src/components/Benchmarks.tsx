export function Benchmarks() {
  return (
    <section id="architecture" className="relative z-20 max-w-6xl mx-auto px-4 sm:px-8 mb-28 scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-[#F8FAFC]">Hardware & Resource Efficiency</h2>
        <p className="text-sm text-slate-400 mt-2">Engineered to run smoothly on modest consumer hardware, laptops, and budget cloud VPS instances:</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="p-6 rounded-2xl bg-[#10141E] border border-white/[0.08]">
          <span className="text-[11px] text-slate-400 block mb-1">LOCAL FFMPEG</span>
          <span className="text-2xl font-bold text-white block">Multi-Core</span>
          <span className="text-xs text-emerald-400 mt-2 block">Adaptive CRF 15 high-quality vertical render</span>
        </div>
        <div className="p-6 rounded-2xl bg-[#10141E] border border-white/[0.08]">
          <span className="text-[11px] text-slate-400 block mb-1">FASTER-WHISPER</span>
          <span className="text-2xl font-bold text-white block">int8 CPU</span>
          <span className="text-xs text-[#E5C07B] mt-2 block">Captions first, lightweight local Whisper fallback</span>
        </div>
        <div className="p-6 rounded-2xl bg-[#10141E] border border-white/[0.08]">
          <span className="text-[11px] text-slate-400 block mb-1">RAM FOOTPRINT</span>
          <span className="text-2xl font-bold text-white block">&lt; 2.0 GB</span>
          <span className="text-xs text-slate-300 mt-2 block">Segment-based streaming execution</span>
        </div>
        <div className="p-6 rounded-2xl bg-[#10141E] border border-white/[0.08]">
          <span className="text-[11px] text-slate-400 block mb-1">GEMINI FLASH</span>
          <span className="text-2xl font-bold text-[#E5C07B] block">Auto-Rotate</span>
          <span className="text-xs text-slate-300 mt-2 block">Sticky rotation across model quota buckets</span>
        </div>
      </div>
    </section>
  );
}
