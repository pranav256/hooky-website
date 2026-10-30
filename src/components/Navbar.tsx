"use client";

import { useState, useEffect } from "react";
import { Star, ArrowRight, Zap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: "Visual Studio", href: "#demo" },
    { label: "Pipeline", href: "#pipeline" },
    { label: "Comparison", href: "#comparison" },
    { label: "Setup Guide", href: "#setup" },
    { label: "CLI Studio", href: "#terminal" },
    { label: "Hardware", href: "#architecture" },
    { label: "FAQ", href: "#faq" },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto h-14 bg-[#10141E]/95 backdrop-blur-md border border-white/[0.08] rounded-2xl px-4 sm:px-5 flex items-center justify-between shadow-xl">
          {/* Brand Logo */}
          <a
            href="/"
            className="flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-[#E5C07B] rounded-lg"
            aria-label="Hooky Home"
          >
            <div className="w-8 h-8 rounded-xl bg-[#171D2B] border border-[#E5C07B]/30 flex items-center justify-center text-[#E5C07B]">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">Hooky</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#E5C07B] border border-[#E5C07B]/20">
                v2.4 • MIT
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-400">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors focus-visible:text-[#E5C07B]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://github.com/pranav256/Hooky"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all"
              aria-label="Star Hooky on GitHub"
            >
              <Star className="w-3.5 h-3.5 text-[#E5C07B] fill-[#E5C07B]" />
              <span>Star</span>
            </a>

            <Button
              size="sm"
              variant="gold"
              className="hidden sm:inline-flex"
              onClick={() => handleNavClick("#terminal")}
            >
              <span>Install CLI</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#171D2B] border border-white/10 text-slate-300 hover:text-white transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#E5C07B]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Mobile Slide-in Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed top-20 right-4 left-4 p-6 bg-[#10141E] border border-white/10 rounded-2xl shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#E5C07B]">Navigation</span>
              <span className="text-xs text-slate-500 font-mono">100% Free MIT</span>
            </div>

            <nav className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-[#171D2B] hover:text-[#E5C07B] transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
              <Button
                variant="gold"
                size="default"
                className="w-full"
                onClick={() => handleNavClick("#terminal")}
              >
                <span>Install CLI</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <a
                href="https://github.com/pranav256/Hooky"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300 hover:text-white"
              >
                <Star className="w-4 h-4 text-[#E5C07B] fill-[#E5C07B]" />
                <span>Star on GitHub</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
