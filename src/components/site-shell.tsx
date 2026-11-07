"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Code2, Menu, X } from "lucide-react";
import { Brand } from "./brand";
import { REPO_URL } from "@/lib/constants";
export function SiteHeader({ docs = false }: { docs?: boolean }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        document.querySelector<HTMLButtonElement>(".mobile-menu")?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav
          id="site-navigation"
          className={`site-navigation ${open ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          <Link href="/#workflow" onClick={close}>
            How it works
          </Link>
          <Link href="/#capabilities" onClick={close}>
            Features
          </Link>
          <Link href="/#cockpit" onClick={close}>
            The studio
          </Link>
          <Link href="/#compare" onClick={close}>
            Why Hooky
          </Link>
          <Link
            href="/docs"
            onClick={close}
            aria-current={docs ? "page" : undefined}
          >
            Documentation
          </Link>
          <a href={REPO_URL} target="_blank" rel="noreferrer" onClick={close}>
            GitHub <ArrowUpRight size={13} />
          </a>
        </nav>
        <div className="header-actions">
          <Link href="/#install" className="button button-accent button-small">
            Get Hooky <ArrowUpRight size={16} />
          </Link>
          <button
            className="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-controls="site-navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Brand />
          <p>Great moments deserve a second life.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/">Home</Link>
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub <Code2 size={14} />
          </a>
          <Link href="/docs">Documentation</Link>
          <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">
            Issues <ArrowUpRight size={14} />
          </a>
          <a
            href={`${REPO_URL}/blob/main/LICENSE`}
            target="_blank"
            rel="noreferrer"
          >
            MIT license
          </a>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>
          Made by{" "}
          <a
            href="https://github.com/pranav256"
            target="_blank"
            rel="noreferrer"
          >
            Pranav
          </a>{" "}
          & the open-source community.
        </span>
        <span>YOUR FOOTAGE. YOUR MACHINE. YOUR RULES.</span>
        <a href="#top" className="back-top">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
