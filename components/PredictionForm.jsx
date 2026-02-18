'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function PredictionForm({ match, onSave, onCancel }) {
    const [activeTab, setActiveTab] = useState('main');
    const [loading, setLoading] = useState(false);

    // Prediction states
    const [matchResult, setMatchResult] = useState('');
    const [bothTeamsScore, setBothTeamsScore] = useState(null);
    const [overUnder, setOverUnder] = useState('');
    const [correctScoreHome, setCorrectScoreHome] = useState('');
    const [correctScoreAway, setCorrectScoreAway] = useState('');
    const [doubleChance, setDoubleChance] = useState('');
    const [firstHalfResult, setFirstHalfResult] = useState('');
    const [totalGoalsRange, setTotalGoalsRange] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [confidenceLevel, setConfidenceLevel] = useState('Medium');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('predictions')
                .upsert({
                    match_id: match.id,
                    match_result: matchResult,
                    both_teams_score: bothTeamsScore,
                    over_under_goals: overUnder,
                    home_score_prediction: correctScoreHome ? parseInt(correctScoreHome) : null,
                    away_score_prediction: correctScoreAway ? parseInt(correctScoreAway) : null,
                    double_chance: doubleChance,
                    first_half_result: firstHalfResult,
                    total_goals_range: totalGoalsRange,
                    analysis: analysis?.trim(),
                    confidence_level: confidenceLevel,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'match_id' });

            if (error) throw error;

            if (onSave) onSave();
        } catch (error) {
            console.error('Error saving prediction:', error.message);
            alert('Failed to save prediction: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const BettingButton = ({ active, onClick, children }) => (
        <button
            type="button"
            onClick={onClick}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${active
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-border'
                }`}
        >
            {children}
        </button>
    );

    return (
        <div className="bg-white border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
                Predict: {match.homeTeam.shortName} vs {match.awayTeam.shortName}
            </h3>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-border pb-2">
                <button
                    type="button"
                    onClick={() => setActiveTab('main')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'main' ? 'text-primary border-b-2 border-primary' : 'text-slate-500'
                        }`}
                >
                    Main Predictions
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('advanced')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'advanced' ? 'text-primary border-b-2 border-primary' : 'text-slate-500'
                        }`}
                >
                    Advanced
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('analysis')}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'analysis' ? 'text-primary border-b-2 border-primary' : 'text-slate-500'
                        }`}
                >
                    Analysis
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* PRIMARY ADMIN ENTRY: Correct Score & Info */}
                <div className="bg-slate-50 border-2 border-primary/20 rounded-[2rem] p-8 space-y-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center text-lg shadow-lg">🎯</span>
                            <div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Expert Verdict</h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Primary Match Prediction</p>
                            </div>
                        </div>
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
                            Required
                        </div>
                    </div>

                    {/* Correct Score */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                {match.homeTeam.shortName || match.homeTeam.name} Goals
                            </label>
                            <input
                                type="number"
                                value={correctScoreHome}
                                onChange={(e) => setCorrectScoreHome(e.target.value)}
                                className="w-full bg-white border-2 border-border rounded-2xl p-5 text-2xl font-black text-slate-900 text-center focus:border-primary outline-none transition-all shadow-inner"
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                {match.awayTeam.shortName || match.awayTeam.name} Goals
                            </label>
                            <input
                                type="number"
                                value={correctScoreAway}
                                onChange={(e) => setCorrectScoreAway(e.target.value)}
                                className="w-full bg-white border-2 border-border rounded-2xl p-5 text-2xl font-black text-slate-900 text-center focus:border-primary outline-none transition-all shadow-inner"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Analysis Text */}
                    <div className="space-y-3">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                            Professional Analysis & Insights
                        </label>
                        <textarea
                            value={analysis}
                            onChange={(e) => setAnalysis(e.target.value)}
                            className="w-full bg-white border-2 border-border rounded-2xl p-6 text-slate-900 text-sm font-medium focus:border-primary outline-none transition-all min-h-[160px] shadow-inner leading-relaxed"
                            placeholder="Provide deep tactical analysis, key player information, or reasoning behind this prediction..."
                        />
                    </div>
                </div>

                {/* Secondary Options Divider */}
                <div className="flex items-center gap-4 py-2">
                    <div className="h-px bg-border flex-1"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Additional Markets</span>
                    <div className="h-px bg-border flex-1"></div>
                </div>

                {/* Main Predictions Tab (Rest of them) */}
                {activeTab === 'main' && (
                    <div className="space-y-6">
                        {/* Match Result (1X2) */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                                Match Result (1X2)
                            </label>
                            <div className="flex gap-3">
                                <BettingButton active={matchResult === '1'} onClick={() => setMatchResult('1')}>
                                    1 (Home Win)
                                </BettingButton>
                                <BettingButton active={matchResult === 'X'} onClick={() => setMatchResult('X')}>
                                    X (Draw)
                                </BettingButton>
                                <BettingButton active={matchResult === '2'} onClick={() => setMatchResult('2')}>
                                    2 (Away Win)
                                </BettingButton>
                            </div>
                        </div>

                        {/* Both Teams to Score */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                                Both Teams to Score
                            </label>
                            <div className="flex gap-3">
                                <BettingButton active={bothTeamsScore === true} onClick={() => setBothTeamsScore(true)}>
                                    Yes
                                </BettingButton>
                                <BettingButton active={bothTeamsScore === false} onClick={() => setBothTeamsScore(false)}>
                                    No
                                </BettingButton>
                            </div>
                        </div>

                        {/* Over/Under Goals */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                                Over/Under Goals
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <BettingButton active={overUnder === 'Over 1.5'} onClick={() => setOverUnder('Over 1.5')}>
                                    Over 1.5
                                </BettingButton>
                                <BettingButton active={overUnder === 'Under 1.5'} onClick={() => setOverUnder('Under 1.5')}>
                                    Under 1.5
                                </BettingButton>
                                <BettingButton active={overUnder === 'Over 2.5'} onClick={() => setOverUnder('Over 2.5')}>
                                    Over 2.5
                                </BettingButton>
                                <BettingButton active={overUnder === 'Under 2.5'} onClick={() => setOverUnder('Under 2.5')}>
                                    Under 2.5
                                </BettingButton>
                                <BettingButton active={overUnder === 'Over 3.5'} onClick={() => setOverUnder('Over 3.5')}>
                                    Over 3.5
                                </BettingButton>
                                <BettingButton active={overUnder === 'Under 3.5'} onClick={() => setOverUnder('Under 3.5')}>
                                    Under 3.5
                                </BettingButton>
                            </div>
                        </div>
                    </div>
                )}

                {/* Advanced Tab */}
                {activeTab === 'advanced' && (
                    <div className="space-y-6">
                        {/* Double Chance */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                                Double Chance
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                <BettingButton active={doubleChance === '1X'} onClick={() => setDoubleChance('1X')}>
                                    1X (Home/Draw)
                                </BettingButton>
                                <BettingButton active={doubleChance === '12'} onClick={() => setDoubleChance('12')}>
                                    12 (Home/Away)
                                </BettingButton>
                                <BettingButton active={doubleChance === 'X2'} onClick={() => setDoubleChance('X2')}>
                                    X2 (Draw/Away)
                                </BettingButton>
                            </div>
                        </div>

                        {/* First Half Result */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                                First Half Result
                            </label>
                            <div className="flex gap-3">
                                <BettingButton active={firstHalfResult === '1'} onClick={() => setFirstHalfResult('1')}>
                                    1 (Home)
                                </BettingButton>
                                <BettingButton active={firstHalfResult === 'X'} onClick={() => setFirstHalfResult('X')}>
                                    X (Draw)
                                </BettingButton>
                                <BettingButton active={firstHalfResult === '2'} onClick={() => setFirstHalfResult('2')}>
                                    2 (Away)
                                </BettingButton>
                            </div>
                        </div>

                        {/* Total Goals Range */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                                Total Goals Range
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                <BettingButton active={totalGoalsRange === '0-1'} onClick={() => setTotalGoalsRange('0-1')}>
                                    0-1 Goals
                                </BettingButton>
                                <BettingButton active={totalGoalsRange === '2-3'} onClick={() => setTotalGoalsRange('2-3')}>
                                    2-3 Goals
                                </BettingButton>
                                <BettingButton active={totalGoalsRange === '4+'} onClick={() => setTotalGoalsRange('4+')}>
                                    4+ Goals
                                </BettingButton>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analysis Tab */}
                {activeTab === 'analysis' && (
                    <div className="space-y-6">
                        {/* Confidence Level */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                                Confidence Level
                            </label>
                            <div className="flex gap-3">
                                <BettingButton active={confidenceLevel === 'Low'} onClick={() => setConfidenceLevel('Low')}>
                                    🔵 Low
                                </BettingButton>
                                <BettingButton active={confidenceLevel === 'Medium'} onClick={() => setConfidenceLevel('Medium')}>
                                    🟡 Medium
                                </BettingButton>
                                <BettingButton active={confidenceLevel === 'High'} onClick={() => setConfidenceLevel('High')}>
                                    🔴 High
                                </BettingButton>
                            </div>
                        </div>
                    </div>
                )}


                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-primary text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-md"
                    >
                        {loading ? 'Saving...' : 'Save Prediction'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 bg-slate-100 text-slate-500 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
