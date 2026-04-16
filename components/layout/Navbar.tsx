"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/vehicles", label: "Veicoli", icon: "🏎️" },
  { href: "/compare", label: "Confronta", icon: "⚔️" },
  { href: "/experiences", label: "Esperienze", icon: "🎟️" },
  { href: "/deals", label: "Deals", icon: "🏷️" },
  { href: "/community", label: "Community", icon: "👥" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-nav-gradient backdrop-blur-xl border-b border-surface-800/60"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-600 to-brand-800 rounded-lg flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
              <span className="text-white font-bold text-sm">AE</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-heading text-lg text-white tracking-wide">
                Auto<span className="text-brand-500">Engineer</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="btn-ghost text-sm flex items-center gap-1.5"
              >
                <span className="text-xs">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-surface-400 hover:text-white rounded-lg hover:bg-surface-800/50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* XP indicator */}
            <div className="hidden sm:flex items-center gap-2 bg-surface-800/60 border border-surface-700/40 rounded-full px-3 py-1.5">
              <span className="text-amber-500 text-xs">⚡</span>
              <span className="text-xs text-surface-300 font-mono">2,450 XP</span>
              <span className="text-xs text-surface-500">Lv.12</span>
            </div>

            {/* CTA */}
            <Link href="/pricing" className="hidden sm:block btn-primary !py-2 !px-4 text-sm">
              Upgrade
            </Link>

            {/* Avatar */}
            <button className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-700 to-brand-900 border border-brand-700/50 flex items-center justify-center text-xs font-bold text-white">
              U
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-surface-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Search bar expandable */}
        {searchOpen && (
          <div className="pb-4 animate-slide-up">
            <input
              type="text"
              placeholder="Cerca auto, motori, componenti, esperienze..."
              className="input-field"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-surface-800/60 bg-surface-950/98 backdrop-blur-xl animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-surface-300 hover:text-white hover:bg-surface-800/50 rounded-xl transition-colors"
              >
                <span>{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
            <div className="pt-2">
              <Link href="/pricing" className="btn-primary w-full text-center block text-sm">
                Upgrade Piano
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
