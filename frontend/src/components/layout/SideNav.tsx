"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="group fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-20 flex-col overflow-hidden border-r border-outline-variant/20 bg-surface-container-low/80 backdrop-blur-2xl transition-all duration-300 ease-in-out hover:w-64 md:flex">
      <div className="flex items-center gap-4 overflow-hidden whitespace-nowrap p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/50 bg-surface-container-high">
          <span className="font-[family-name:var(--font-display)] text-sm font-bold text-primary-fixed-dim">
            NH
          </span>
        </div>
        <div>
          <div className="font-[family-name:var(--font-headline)] text-headline-md text-on-surface">
            Job Seeker
          </div>
          <div className="font-[family-name:var(--font-label)] text-xs uppercase tracking-widest text-primary-fixed-dim">
            Precision Mode
          </div>
        </div>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-2 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 rounded border-l-4 p-3 transition-colors",
                isActive
                  ? "border-primary-fixed-dim bg-primary-container/10 text-primary-fixed-dim"
                  : "border-transparent text-on-surface-variant hover:bg-surface-variant/30 hover:text-primary-fixed",
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined ml-1 shrink-0",
                  isActive && "filled",
                )}
              >
                {item.icon}
              </span>
              <span className="whitespace-nowrap font-[family-name:var(--font-label)] text-xs uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mb-20 mt-auto flex flex-col gap-2 px-2 pb-4">
        <Link
          href="#"
          className="flex items-center gap-4 rounded border-l-4 border-transparent p-3 text-on-surface-variant transition-colors hover:bg-surface-variant/30 hover:text-primary-fixed"
        >
          <span className="material-symbols-outlined ml-1 shrink-0">help_outline</span>
          <span className="whitespace-nowrap font-[family-name:var(--font-label)] text-xs uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Support
          </span>
        </Link>
      </div>
    </aside>
  );
}
