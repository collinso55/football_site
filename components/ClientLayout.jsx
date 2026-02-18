'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

    if (isAdmin) {
        return (
            <div className="min-h-screen bg-slate-50">
                {children}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 min-h-0">
                {/* Sidebar - Fixed position */}
                <div className="w-80 border-r border-gray-200 bg-white flex-shrink-0 h-[calc(100vh-80px)] sticky top-0 overflow-y-auto hidden md:block">
                    <Sidebar />
                </div>

                {/* Main content - Scrolls independently */}
                <div className="flex-1 bg-gray-50 overflow-y-auto h-[calc(100vh-80px)]">
                    {children}
                </div>
            </div>
        </div>
    );
}
