'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isAdmin = pathname.startsWith('/admin');

    // Close sidebar when pathname changes (navigation)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

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

            {/* Mobile Sidebar Toggle - Floating Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border-4 border-white"
                aria-label="Toggle Sidebar"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isSidebarOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex flex-1 min-h-0 relative">
                {/* Sidebar - Desktop: Fixed, Mobile: Drawer */}
                <div className={`
                    fixed md:sticky top-0 left-0 h-full md:h-[calc(100vh-80px)] z-50 md:z-auto
                    w-80 border-r border-gray-200 bg-white flex-shrink-0 overflow-y-auto
                    transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    ${!isSidebarOpen && 'hidden md:block'}
                `}>
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

