// components/Navbar.jsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-primary/95 backdrop-blur-md text-white border-b border-white/5 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-secondary text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
              ⚽
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight leading-none">FOOTBALL</span>
              <span className="text-[9px] sm:text-[10px] font-medium text-secondary tracking-widest uppercase">Analytics</span>
            </div>
          </Link>

          <div className="flex items-center space-x-4 sm:space-x-8">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Home</Link>
              <Link href="/leagues/2021" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Premier League</Link>
              <Link href="/leagues/2014" className="text-sm font-medium text-white/70 hover:text-white transition-colors">La Liga</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}