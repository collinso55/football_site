'use client';

import { useRouter } from 'next/navigation';

export default function BackButton({ label = "Back" }) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-primary transition-all rounded-xl border border-border shadow-sm group font-bold text-xs uppercase tracking-widest mb-6"
        >
            <svg
                className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            {label}
        </button>
    );
}
