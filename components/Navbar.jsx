// components/Navbar.js
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
              ⚽
            </div>
            <span className="text-2xl font-bold">FootballSite</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}