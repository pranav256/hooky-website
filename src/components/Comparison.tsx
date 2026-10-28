import { Check, X, Shield, Cpu, Zap, DollarSign } from "lucide-react";

export function Comparison() {
  const comparisonData = [
    {
      feature: "Monthly Subscription Price",
      hooky: "$0 / month (MIT Open Source)",
      opus: "$19 – $49 / mo",
      klap: "$29 – $79 / mo",
      submagic: "$20 – $99 / mo",
      highlight: true,
    },
    {
      feature: "Video Processing Limits",
      hooky: "Unlimited (No minute caps)",
      opus: "60 – 200 mins / mo",
      klap: "10 – 30 uploads / mo",
      submagic: "Strict credits / mo",
      highlight: true,
    },
    {
      feature: "Rendering Speed",
      hooky: "240+ FPS (Local NVENC / Metal)",
      opus: "Cloud Queue (5-15 mins)",
      klap: "Cloud Queue (8-20 mins)",
      submagic: "Cloud Queue",
      highlight: true,
    },
    {
      feature: "Privacy & Data Ownership",
      hooky: "100% Local (Zero video upload)",
      opus: "Uploaded to 3rd-party servers",
      klap: "Uploaded to cloud",
      submagic: "Uploaded to cloud",
      highlight: true,
    },
    {
      feature: "Smart Multi-Speaker Framing",
      hooky: "Center Crop + Ambient Blur Fit",
      opus: "Single face crop only",
      klap: "Auto crop only",
      submagic: "Auto crop only",
      highlight: false,
    },
    {
      feature: "Automated YouTube Radar",
      hooky: "Built-in (channels.txt velocity)",
      opus: "Manual URL upload only",
      klap: "Manual upload only",
      submagic: "Manual upload only",
      highlight: true,
    },
    {
      feature: "Anti-Ban Social Publishing",
      hooky: "Built-in Randomized Jitter",
      opus: "None (Manual webhook)",
      klap: "None",
      submagic: "None",
      highlight: false,
    },
    {
      feature: "Offline Batch Processing",
      hooky: "Yes (CLI pipeline scripts)",
      opus: "No (Web browser only)",
      klap: "No",
      submagic: "No",
      highlight: false,
    },
  ];

  return (
    <section id="comparison" className="relative z-20 max-w-6xl mx-auto px-4 sm:px-8 mb-28 scroll-mt-24">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10141E] border border-[#E5C07B]/20 text-[#E5C07B] text-xs font-medium uppercase tracking-wider mb-4">
          <DollarSign className="w-3.5 h-3.5 text-[#E5C07B]" /> Why Hooky Wins
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8FAFC]">
          Hooky vs Proprietary Cloud SaaS
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Compare the freedom of local open-source software against costly subscription models:
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-[#10141E] border border-white/[0.08] shadow-2xl">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-[#141A28]">
              <th className="p-4 sm:p-5 font-semibold text-slate-300">Feature / Capability</th>
              <th className="p-4 sm:p-5 font-bold text-[#E5C07B] bg-[#E5C07B]/10 border-x border-[#E5C07B]/20">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Hooky (Open Source)</span>
                </div>
              </th>
              <th className="p-4 sm:p-5 font-medium text-slate-400">Opus Clip</th>
              <th className="p-4 sm:p-5 font-medium text-slate-400 hidden md:table-cell">Klap</th>
              <th className="p-4 sm:p-5 font-medium text-slate-400 hidden lg:table-cell">Submagic</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {comparisonData.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 sm:p-5 font-medium text-white">{row.feature}</td>
                <td className="p-4 sm:p-5 font-bold text-[#E5C07B] bg-[#E5C07B]/5 border-x border-[#E5C07B]/20">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{row.hooky}</span>
                  </div>
                </td>
                <td className="p-4 sm:p-5 text-slate-400">{row.opus}</td>
                <td className="p-4 sm:p-5 text-slate-400 hidden md:table-cell">{row.klap}</td>
                <td className="p-4 sm:p-5 text-slate-400 hidden lg:table-cell">{row.submagic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-[#080A0F] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>No credit card required. Free Google Gemini API tier includes up to 15 RPM.</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#E5C07B]" />
          <span>Hardware accelerated on NVIDIA NVENC, Apple Silicon Metal, and modern CPUs.</span>
        </div>
      </div>
    </section>
  );
}
