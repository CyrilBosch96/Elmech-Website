"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/#products" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-[#1e3a5f] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-lg md:text-xl font-bold tracking-tight text-white">
              Elmech Equipment Company
            </span>
            <span className="text-xs text-amber-400 font-medium tracking-wide">
              Material Handling Specialists Since 1992
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-200 hover:text-amber-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/enquiry"
              className="ml-2 bg-amber-500 hover:bg-amber-400 text-[#1e3a5f] font-bold text-sm px-5 py-2.5 rounded transition-colors"
            >
              Request Quotation
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="md:hidden p-2 rounded text-white hover:bg-[#2a4f7c] transition-colors"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#152b47] border-t border-[#2a4f7c]">
          <nav className="flex flex-col px-4 py-4 gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 text-sm font-medium text-slate-200 hover:text-amber-400 transition-colors border-b border-[#2a4f7c] last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/enquiry"
              onClick={() => setMenuOpen(false)}
              className="mt-3 bg-amber-500 hover:bg-amber-400 text-[#1e3a5f] font-bold text-sm px-5 py-3 rounded text-center transition-colors"
            >
              Request Quotation
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
