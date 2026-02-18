'use client';

import { useState, useEffect } from 'react';
import TeamLogo from './TeamLogo';
import { supabase } from '../lib/supabase';

export default function FixturesList({ fixtures, title = "Upcoming Fixtures" }) {
  const [predictions, setPredictions] = useState({});

  useEffect(() => {
    if (fixtures && fixtures.length > 0) {
      const fetchPredictions = async () => {
        const matchIds = fixtures.map(f => f.id);
        const { data, error } = await supabase
          .from('predictions')
          .select('*')
          .in('match_id', matchIds);

        if (!error && data) {
          const predMap = {};
          data.forEach(p => {
            predMap[p.match_id] = p;
          });
          setPredictions(predMap);
        }
      };
      fetchPredictions();
    }
  }, [fixtures]);

  if (!fixtures || fixtures.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-muted text-xs font-bold uppercase tracking-widest">No upcoming fixtures</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };
  };

  const getConfidenceColor = (level) => {
    switch (level) {
      case 'High': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Low': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-primary bg-primary/5 border-primary/10';
    }
  };

  return (
    <div className="divide-y divide-border">
      {title && (
        <div className="px-8 py-4 bg-slate-50 border-b border-border">
          <h3 className="text-xs font-black text-primary uppercase tracking-widest">{title}</h3>
        </div>
      )}
      <div className="p-4 space-y-4">
        {fixtures.map((match) => {
          const dateInfo = formatDate(match.utcDate);
          const prediction = predictions[match.id];

          return (
            <div key={match.id} className="bg-white rounded-[2rem] border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all group">
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8">
                {/* Home Team */}
                <div className="flex-1 flex items-center justify-center sm:justify-end gap-6 min-w-0 w-full mb-6 sm:mb-0">
                  <span className="text-base font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                    {match.homeTeam.shortName || match.homeTeam.name}
                  </span>
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-border p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <TeamLogo src={match.homeTeam.crest} className="w-full h-full object-contain" />
                  </div>
                </div>

                {/* Match Info */}
                <div className="px-12 flex flex-col items-center min-w-[160px] mb-6 sm:mb-0">
                  <div className="bg-primary/5 px-4 py-1.5 rounded-full mb-3">
                    <span className="text-xs font-black text-primary uppercase tracking-tighter">
                      {dateInfo.time}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {dateInfo.day}, {dateInfo.date}
                  </span>
                </div>

                {/* Away Team */}
                <div className="flex-1 flex items-center justify-center sm:justify-start gap-6 min-w-0 w-full">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-border p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <TeamLogo src={match.awayTeam.crest} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-base font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                    {match.awayTeam.shortName || match.awayTeam.name}
                  </span>
                </div>
              </div>

              {/* Prediction Section */}
              {prediction && (
                <div className="bg-slate-50 border-t border-border p-6 sm:px-8">
                  {/* Header with Confidence */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        🎯 Pro Prediction
                      </div>
                      <div className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase ${getConfidenceColor(prediction.confidence_level)}`}>
                        {prediction.confidence_level || 'Medium'} Confidence
                      </div>
                    </div>
                  </div>

                  {/* Main Predictions Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {prediction.match_result && (
                      <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Match Result</p>
                        <p className="text-sm font-black text-slate-900">
                          {prediction.match_result === '1' && '🏠 Home Win'}
                          {prediction.match_result === 'X' && '🤝 Draw'}
                          {prediction.match_result === '2' && '✈️ Away Win'}
                        </p>
                      </div>
                    )}

                    {prediction.both_teams_score !== null && (
                      <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Both Teams Score</p>
                        <p className="text-sm font-black text-slate-900">
                          {prediction.both_teams_score ? '✅ Yes' : '❌ No'}
                        </p>
                      </div>
                    )}

                    {prediction.over_under_goals && (
                      <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Goals</p>
                        <p className="text-sm font-black text-slate-900">{prediction.over_under_goals}</p>
                      </div>
                    )}

                    {(prediction.home_score_prediction !== null && prediction.away_score_prediction !== null) && (
                      <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Correct Score</p>
                        <p className="text-sm font-black text-slate-900">
                          {prediction.home_score_prediction} - {prediction.away_score_prediction}
                        </p>
                      </div>
                    )}

                    {prediction.double_chance && (
                      <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Double Chance</p>
                        <p className="text-sm font-black text-slate-900">{prediction.double_chance}</p>
                      </div>
                    )}

                    {prediction.first_half_result && (
                      <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">First Half</p>
                        <p className="text-sm font-black text-slate-900">
                          {prediction.first_half_result === '1' && 'Home'}
                          {prediction.first_half_result === 'X' && 'Draw'}
                          {prediction.first_half_result === '2' && 'Away'}
                        </p>
                      </div>
                    )}

                    {prediction.total_goals_range && (
                      <div className="bg-white rounded-xl p-3 border border-border shadow-sm">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Goals</p>
                        <p className="text-sm font-black text-slate-900">{prediction.total_goals_range} Goals</p>
                      </div>
                    )}
                  </div>

                  {/* Analysis */}
                  {prediction.analysis && (
                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 shadow-sm">
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">💡 Expert Analysis</p>
                      <p className="text-sm text-slate-900 font-medium leading-relaxed italic">
                        "{prediction.analysis}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
