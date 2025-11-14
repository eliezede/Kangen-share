import { useState } from "react";
import { Link, useLocation } from "wouter";

const navigation = [
  { name: "Map", href: "/home" },
  { name: "Host profile", href: "/host" },
  { name: "Request", href: "/request" },
  { name: "Chat", href: "/chat" },
  { name: "Rate host", href: "/rate" },
];

export function TopNav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/home" className="flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white shadow-lg shadow-slate-900/20">
            KS
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Kangen</p>
            <p className="-mt-1 text-lg font-semibold text-slate-900">Share</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href} className="relative">
                <span
                  className={`transition ${
                    isActive
                      ? "text-slate-900"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {item.name}
                </span>
                {isActive && <span className="absolute -bottom-2 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-slate-900" />}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex">
          <Link
            href="/request"
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
          >
            Request water
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-600 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 md:hidden">
          <div className="flex flex-col gap-4">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`rounded-2xl px-4 py-3 transition ${
                    isActive ? "bg-slate-900 text-white" : "hover:bg-slate-100"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            <Link
              href="/request"
              className="rounded-2xl bg-slate-900 px-4 py-3 text-center font-medium text-white"
              onClick={() => setOpen(false)}
            >
              Request water
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
