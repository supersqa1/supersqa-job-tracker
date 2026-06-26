"use client";

import Link from "next/link";

export function TopNav() {
  return (
    <nav className="sticky top-0 z-50 hidden h-16 w-full items-center justify-between border-b border-outline-variant/30 bg-surface/60 px-gutter py-unit shadow-[0_0_15px_rgba(0,242,255,0.1)] backdrop-blur-xl md:flex">
      <div className="flex items-center gap-gutter">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-2xl tracking-widest text-primary-fixed-dim"
        >
          NEO-HIRE
        </Link>
        <div className="group relative ml-8">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant transition-colors group-focus-within:text-primary-fixed-dim">
            search
          </span>
          <input
            type="text"
            placeholder="Search applications..."
            className="w-64 border-0 border-b border-outline-variant/50 bg-transparent py-2 pl-10 pr-4 font-[family-name:var(--font-mono-data)] text-sm text-on-surface placeholder:text-outline-variant/50 transition-all focus:border-primary-fixed-dim focus:outline-none focus:ring-0"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button
          type="button"
          className="relative text-on-surface-variant transition-colors hover:text-primary-fixed-dim"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-primary-fixed-dim shadow-[0_0_5px_rgba(0,242,255,1)]" />
        </button>
        <button
          type="button"
          className="text-on-surface-variant transition-colors hover:text-primary-fixed-dim"
          aria-label="Settings"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="relative h-8 w-8 overflow-hidden rounded-full border border-primary-fixed-dim/50 bg-surface-container-high">
          <div className="flex h-full w-full items-center justify-center font-[family-name:var(--font-label)] text-xs text-primary-fixed-dim">
            JS
          </div>
        </div>
      </div>
    </nav>
  );
}
