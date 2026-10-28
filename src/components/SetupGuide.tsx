"use client";

import { useState } from "react";
import { Terminal, Copy, Check, ExternalLink, Key, Apple, Monitor, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";

type OS = "windows" | "macos" | "linux" | "api";

export function SetupGuide() {
  const [activeOS, setActiveOS] = useState<OS>("windows");
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const guides = {
    windows: {
      title: "Windows Setup (PowerShell / NVIDIA CUDA)",
      steps: [
        {
          num: 1,
          desc: "Clone Hooky and run automated setup script (creates virtualenv & validates FFmpeg):",
          code: "git clone https://github.com/pranav256/Hooky.git\ncd Hooky\n.\\setup.ps1",
        },
        {
          num: 2,
          desc: "Set your free Google Gemini API key in your .env file:",
          code: "Copy-Item .env.example .env\n# Add GEMINI_API_KEY=your_key_here to .env",
        },
        {
          num: 3,
          desc: "Verify your system and hardware acceleration with Hooky Doctor:",
          code: ".\\hooky.ps1 doctor",
        },
        {
          num: 4,
          desc: "Generate your first vertical short from a YouTube link:",
          code: '.\\hooky.ps1 make "https://www.youtube.com/watch?v=EXAMPLE" --style gold',
        },
      ],
    },
    macos: {
      title: "macOS Setup (Apple Silicon Metal / Terminal)",
      steps: [
        {
          num: 1,
          desc: "Install FFmpeg via Homebrew and bootstrap the virtual environment:",
          code: "brew install ffmpeg\ngit clone https://github.com/pranav256/Hooky.git\ncd Hooky\nchmod +x setup.sh hooky.sh\n./setup.sh",
        },
        {
          num: 2,
          desc: "Configure your Google AI Studio API key:",
          code: "cp .env.example .env\n# Open .env and insert your GEMINI_API_KEY",
        },
        {
          num: 3,
          desc: "Run system diagnostics to confirm Apple Silicon acceleration:",
          code: "./hooky.sh doctor",
        },
        {
          num: 4,
          desc: "Render high-retention clips automatically:",
          code: './hooky.sh make "https://www.youtube.com/watch?v=EXAMPLE"',
        },
      ],
    },
    linux: {
      title: "Linux Setup (Ubuntu / Debian / Docker-free)",
      steps: [
        {
          num: 1,
          desc: "Install system packages and run Hooky setup:",
          code: "sudo apt update && sudo apt install -y ffmpeg python3-venv\ngit clone https://github.com/pranav256/Hooky.git\ncd Hooky\nchmod +x setup.sh hooky.sh\n./setup.sh",
        },
        {
          num: 2,
          desc: "Populate environment config with your API key:",
          code: "cp .env.example .env\n# Paste your GEMINI_API_KEY in .env",
        },
        {
          num: 3,
          desc: "Test the pipeline with dry-run mode (zero writes):",
          code: "./hooky.sh preview",
        },
        {
          num: 4,
          desc: "Queue automated channel monitoring in channels.txt and execute:",
          code: "./hooky.sh make",
        },
      ],
    },
    api: {
      title: "Free Google Gemini API Key Guide (60 Seconds)",
      steps: [
        {
          num: 1,
          desc: "Open Google AI Studio in your browser (100% Free):",
          code: "https://aistudio.google.com/app/apikey",
        },
        {
          num: 2,
          desc: 'Sign in with your Google account and click "Create API key":',
          code: "# No credit card required. Free tier grants up to 15 RPM for Gemini 2.0 Flash.",
        },
        {
          num: 3,
          desc: "Copy the generated key string (starts with AIzaSy...):",
          code: "GEMINI_API_KEY=AIzaSyYourGeneratedSecretKeyHere",
        },
        {
          num: 4,
          desc: "Save it inside your local .env file in the Hooky folder and you are ready to clip!",
          code: "# Hooky will automatically rotate models if you hit temporary free-tier limits.",
        },
      ],
    },
  };

  const currentGuide = guides[activeOS];

  return (
    <section id="setup" className="relative z-20 max-w-5xl mx-auto px-4 sm:px-8 mb-28 scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10141E] border border-[#E5C07B]/20 text-[#E5C07B] text-xs font-medium uppercase tracking-wider mb-4">
          <Terminal className="w-3.5 h-3.5 text-[#E5C07B]" /> Quick Installation
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC]">
          Zero to First Reel in 2 Minutes
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Select your platform below for copy-paste instructions:
        </p>
      </div>

      <div className="rounded-2xl bg-[#10141E] border border-white/[0.08] shadow-2xl p-6 sm:p-8">
        {/* OS Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-white/[0.08] text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveOS("windows")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${
              activeOS === "windows"
                ? "bg-[#E5C07B] text-[#0A0D14] font-bold border-[#E5C07B] shadow-sm"
                : "bg-[#171D2B] text-slate-300 hover:text-white border-white/5"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Windows (CUDA)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveOS("macos")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${
              activeOS === "macos"
                ? "bg-[#E5C07B] text-[#0A0D14] font-bold border-[#E5C07B] shadow-sm"
                : "bg-[#171D2B] text-slate-300 hover:text-white border-white/5"
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>macOS (Metal)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveOS("linux")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${
              activeOS === "linux"
                ? "bg-[#E5C07B] text-[#0A0D14] font-bold border-[#E5C07B] shadow-sm"
                : "bg-[#171D2B] text-slate-300 hover:text-white border-white/5"
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Linux (Ubuntu/Debian)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveOS("api")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${
              activeOS === "api"
                ? "bg-[#E5C07B] text-[#0A0D14] font-bold border-[#E5C07B] shadow-sm"
                : "bg-[#171D2B] text-slate-300 hover:text-white border-white/5"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Free API Key Guide</span>
          </button>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="pt-6 space-y-6">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>{currentGuide.title}</span>
            {activeOS === "api" && (
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#E5C07B] hover:underline flex items-center gap-1 font-mono font-normal ml-2"
              >
                <span>Open Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </h3>

          <div className="space-y-4">
            {currentGuide.steps.map((step, idx) => {
              const stepKey = `${activeOS}-${idx}`;
              return (
                <div key={idx} className="p-4 rounded-xl bg-[#080A0F] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#171D2B] text-[#E5C07B] text-[11px] font-mono flex items-center justify-center border border-[#E5C07B]/30">
                        {step.num}
                      </span>
                      <span>{step.desc}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopy(stepKey, step.code)}
                      className="p-1 rounded bg-[#10141E] hover:bg-[#1A2234] border border-white/10 text-slate-400 hover:text-white transition-colors"
                      title="Copy code"
                      aria-label="Copy step code"
                    >
                      {copied === stepKey ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#E5C07B]" />
                      )}
                    </button>
                  </div>

                  <pre className="p-3 rounded-lg bg-[#05070A] border border-white/5 font-mono text-xs text-[#E5C07B] overflow-x-auto whitespace-pre">
                    {step.code}
                  </pre>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
