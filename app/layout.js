// app/layout.js - ALTERNATIVE VERSION
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FootballSite - League Standings',
  description: 'Football league standings and statistics',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex flex-1 min-h-0">
            {/* Sidebar - Fixed position */}
            <div className="w-80 border-r border-gray-200 bg-white flex-shrink-0 h-[calc(100vh-80px)] sticky top-0 overflow-y-auto">
              <Sidebar />
            </div>
            
            {/* Main content - Scrolls independently */}
            <div className="flex-1 bg-gray-50 overflow-y-auto h-[calc(100vh-80px)]">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}