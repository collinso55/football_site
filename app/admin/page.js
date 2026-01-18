'use client';

import { useState, useEffect } from 'react';
import PredictionForm from '../../components/PredictionForm';
import TeamLogo from '../../components/TeamLogo';

export default function AdminPage() {
    const [leagues, setLeagues] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingMatch, setEditingMatch] = useState(null);

    useEffect(() => {
        async function init() {
            try {
                const response = await fetch('/api/leagues/top');
                const result = await response.json();
                if (result.success) {
                    setLeagues(result.data);
                    if (result.data.length > 0) {
                        setSelectedLeague(result.data[0].id);
                    }
                }
            } catch (error) {
                console.error('Error fetching top leagues:', error);
            }
        }
        init();
    }, []);

    useEffect(() => {
        if (selectedLeague) {
            async function fetchMatches() {
                setLoading(true);
                try {
                    const response = await fetch(`/api/matches/upcoming?competitionId=${selectedLeague}&limit=20`);
                    const result = await response.json();
                    if (result.success) {
                        setMatches(result.data);
                    }
                } catch (error) {
                    console.error('Error fetching matches:', error);
                }
                setLoading(false);
            }
            fetchMatches();
        }
    }, [selectedLeague]);

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Admin Dashboard</h1>
                        <p className="text-muted text-sm font-bold uppercase tracking-widest mt-1">Manage Expert Predictions</p>
                    </div>

                    <div className="flex gap-2">
                        {leagues.map(league => (
                            <button
                                key={league.id}
                                onClick={() => setSelectedLeague(league.id)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedLeague === league.id
                                        ? 'bg-secondary text-primary'
                                        : 'bg-card text-muted hover:bg-white/5 border border-border'
                                    }`}
                            >
                                {league.code}
                            </button>
                        ))}
                    </div>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h2 className="text-xs font-black text-muted uppercase tracking-widest mb-6">Upcoming Matches</h2>
                            {matches.map(match => (
                                <div
                                    key={match.id}
                                    className={`bg-card border border-border rounded-3xl p-6 hover:border-secondary/50 transition-all cursor-pointer group ${editingMatch?.id === match.id ? 'ring-2 ring-secondary' : ''
                                        }`}
                                    onClick={() => setEditingMatch(match)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-8 h-8 bg-primary rounded-lg p-1.5 border border-border">
                                                <TeamLogo src={match.homeTeam.crest} className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-200">{match.homeTeam.shortName}</span>
                                        </div>

                                        <div className="px-4 text-center">
                                            <span className="text-[10px] font-black text-muted uppercase">VS</span>
                                        </div>

                                        <div className="flex items-center gap-4 flex-1 justify-end text-right">
                                            <span className="text-sm font-bold text-slate-200">{match.awayTeam.shortName}</span>
                                            <div className="w-8 h-8 bg-primary rounded-lg p-1.5 border border-border">
                                                <TeamLogo src={match.awayTeam.crest} className="w-full h-full object-contain" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-center">
                                        <span className="text-[10px] font-black text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase">
                                            {new Date(match.utcDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:sticky lg:top-8 h-fit">
                            {editingMatch ? (
                                <PredictionForm
                                    match={editingMatch}
                                    onSave={() => {
                                        alert('Prediction saved!');
                                        setEditingMatch(null);
                                    }}
                                    onCancel={() => setEditingMatch(null)}
                                />
                            ) : (
                                <div className="bg-card border border-dashed border-border rounded-3xl p-12 text-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Select a match</h3>
                                    <p className="text-xs text-muted mt-2">Click on a match to add or edit your expert prediction.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
