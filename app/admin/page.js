'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Sidebar from '../../components/Sidebar';
import PredictionForm from '../../components/PredictionForm';
import TeamLogo from '../../components/TeamLogo';
import LeagueLogo from '../../components/LeagueLogo';
import AdminAuthWrapper from '../../components/AdminAuthWrapper';

export default function AdminPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminPageContent />
        </Suspense>
    );
}

function AdminPageContent() {
    const searchParams = useSearchParams();
    const competitionId = searchParams.get('competitionId') || '2021';

    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMatch, setSelectedMatch] = useState(null);

    // Fetch matches when league selection changes
    useEffect(() => {
        async function fetchMatches() {
            setLoading(true);
            try {
                const response = await fetch(`/api/matches/upcoming?competitionId=${competitionId}&limit=20`);
                const result = await response.json();
                if (result.success) {
                    setMatches(result.data);
                }
            } catch (error) {
                console.error('Error fetching matches:', error);
            }
            setLoading(false);
        }

        if (competitionId) {
            fetchMatches();
        }
    }, [competitionId]);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error logging out:', error.message);
    };

    return (
        <AdminAuthWrapper>
            <div className="min-h-screen bg-background flex">
                {/* Main Content */}
                <div className="flex h-screen bg-slate-50 text-slate-900 w-full overflow-hidden">
                    <div className="w-64 flex-shrink-0">
                        <Sidebar />
                    </div>

                    {/* Matches List */}
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="w-8 h-1 bg-primary rounded-full"></span>
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Match Center</h1>
                                </div>
                                <p className="text-slate-500 font-medium">Select a match to manage predictions and analysis.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-600 hover:text-primary transition-all rounded-2xl border border-border shadow-sm group font-black text-xs uppercase tracking-widest"
                                >
                                    <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to Website
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-all rounded-2xl border border-border shadow-sm group font-black text-xs uppercase tracking-widest"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </header>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing Matches...</p>
                            </div>
                        ) : matches.length === 0 ? (
                            <div className="bg-white border border-border p-12 rounded-[2.5rem] text-center shadow-sm">
                                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h10a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">No Upcoming Matches Found</h2>
                                <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">There are no upcoming matches for this league in the current schedule.</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                                >
                                    Refresh Schedule
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {matches.map((match) => (
                                    <div
                                        key={match.id}
                                        onClick={() => setSelectedMatch(match)}
                                        className={`group bg-white border rounded-[2rem] p-6 cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center shadow-sm ${selectedMatch?.id === match.id
                                            ? 'border-primary ring-2 ring-primary/20 shadow-xl'
                                            : 'border-border hover:border-primary/30 hover:shadow-lg'
                                            }`}
                                    >
                                        {/* League Badge */}
                                        <div className="bg-slate-50 px-3 py-1 rounded-full border border-border mb-4">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{match.competition.name}</span>
                                        </div>

                                        <div className="flex flex-col items-center gap-4 flex-1 w-full">
                                            <div className="flex items-center justify-center gap-4 w-full">
                                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-border p-2.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                    <TeamLogo src={match.homeTeam.crest} className="w-full h-full object-contain" />
                                                </div>
                                                <span className="text-xs font-black text-slate-400">VS</span>
                                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-border p-2.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                    <TeamLogo src={match.awayTeam.crest} className="w-full h-full object-contain" />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1 w-full">
                                                <h3 className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                                                    {match.homeTeam.shortName || match.homeTeam.name} vs {match.awayTeam.shortName || match.awayTeam.name}
                                                </h3>
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded uppercase tracking-tighter">
                                                        {new Date(match.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                    </span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        {new Date(match.utcDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Prediction Form Panel */}
                    <div className={`w-[500px] border-l border-border bg-white transition-all transform duration-500 fixed right-0 top-0 h-full z-40 shadow-2xl ${selectedMatch ? 'translate-x-0' : 'translate-x-full'
                        }`}>
                        {selectedMatch && (
                            <div className="h-full flex flex-col">
                                <div className="p-8 border-b border-border bg-slate-50/50 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Match Prediction</h2>
                                        <p className="text-[10px] font-bold text-muted uppercase mt-1 tracking-widest">Update AI & Expert Analysis</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedMatch(null)}
                                        className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-slate-400 hover:text-secondary transition-all border border-transparent hover:border-border shadow-sm group"
                                    >
                                        <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                                    <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem] mb-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                                        <div className="flex items-center justify-between gap-6 relative z-10">
                                            <div className="flex-1 text-center">
                                                <div className="w-12 h-12 bg-white rounded-xl shadow-md border border-border p-2 mx-auto mb-3">
                                                    <TeamLogo src={selectedMatch.homeTeam.crest} className="w-full h-full object-contain" />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-tight">
                                                    {selectedMatch.homeTeam.shortName || selectedMatch.homeTeam.name}
                                                </p>
                                            </div>
                                            <div className="text-center font-black text-slate-300 text-xl tracking-tighter">VS</div>
                                            <div className="flex-1 text-center">
                                                <div className="w-12 h-12 bg-white rounded-xl shadow-md border border-border p-2 mx-auto mb-3">
                                                    <TeamLogo src={selectedMatch.awayTeam.crest} className="w-full h-full object-contain" />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-tight">
                                                    {selectedMatch.awayTeam.shortName || selectedMatch.awayTeam.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <PredictionForm
                                        match={selectedMatch}
                                        onSuccess={() => {
                                            setSelectedMatch(null);
                                            // Refresh or show success message if needed
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminAuthWrapper>
    );
}
