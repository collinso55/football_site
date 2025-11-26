// app/layout.js
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
          <div className="flex flex-1 h-[calc(100vh-80px)]">
            {/* Sidebar with independent scrolling */}
            <div className="w-80 border-r border-gray-200 overflow-y-auto">
              <Sidebar />
            </div>
            
            {/* Main content with independent scrolling */}
            <div className="flex-1 bg-gray-50 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}