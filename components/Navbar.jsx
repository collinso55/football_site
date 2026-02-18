// components/Navbar.jsx
import Link from 'next/link';

export default function Navbar() {
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

          <div className="flex items-center space-x-4 sm:space-x-8">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-sm font-semibold text-white/80 hover:text-white transition-colors">Home</Link>
              <Link href="/admin" className="text-sm font-semibold text-white/80 hover:text-white transition-colors">Admin Panel</Link>
              <Link href="/leagues/2021" className="text-sm font-semibold text-white/80 hover:text-white transition-colors">Premier League</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}