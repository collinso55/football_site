'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-primary shadow-lg text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-white text-primary rounded-xl flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-110 transition-transform duration-200">
              ⚽
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight leading-none">FOOTBALL</span>
              <span className="text-[9px] sm:text-[10px] font-medium text-white/80 tracking-widest uppercase">Analytics</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-semibold text-white/80 hover:text-white transition-colors">Home</Link>
            <Link href="/admin" className="text-sm font-semibold text-white/80 hover:text-white transition-colors">Admin Panel</Link>
            <Link href="/leagues/2021" className="text-sm font-semibold text-white/80 hover:text-white transition-colors">Premier League</Link>
          </div>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col space-y-4 pb-4">
            <Link
              href="/"
              className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/admin"
              className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin Panel
            </Link>
            <Link
              href="/leagues/2021"
              className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Premier League
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
