'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function PredictionForm({ match, onSave, onCancel }) {
    const [prediction, setPrediction] = useState('');
    const [homeScore, setHomeScore] = useState('');
    const [awayScore, setAwayScore] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('predictions')
                .upsert({
                    match_id: match.id,
                    prediction_text: prediction,
                    home_score_prediction: parseInt(homeScore),
                    away_score_prediction: parseInt(awayScore),
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'match_id' });

            if (error) throw error;

            if (onSave) onSave();
        } catch (error) {
            console.error('Error saving prediction:', error.message);
            alert('Failed to save prediction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">
                Predict: {match.homeTeam.shortName} vs {match.awayTeam.shortName}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">
                        Analysis / Prediction
                    </label>
                    <textarea
                        value={prediction}
                        onChange={(e) => setPrediction(e.target.value)}
                        className="w-full bg-primary border border-border rounded-xl p-4 text-slate-200 text-sm focus:border-secondary outline-none transition-colors min-h-[100px]"
                        placeholder="Enter your expert analysis..."
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">
                            {match.homeTeam.shortName} Score
                        </label>
                        <input
                            type="number"
                            value={homeScore}
                            onChange={(e) => setHomeScore(e.target.value)}
                            className="w-full bg-primary border border-border rounded-xl p-3 text-slate-200 text-center font-bold focus:border-secondary outline-none transition-colors"
                            placeholder="0"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-2">
                            {match.awayTeam.shortName} Score
                        </label>
                        <input
                            type="number"
                            value={awayScore}
                            onChange={(e) => setAwayScore(e.target.value)}
                            className="w-full bg-primary border border-border rounded-xl p-3 text-slate-200 text-center font-bold focus:border-secondary outline-none transition-colors"
                            placeholder="0"
                            required
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-secondary text-primary font-black text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Prediction'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 bg-white/5 text-slate-400 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
