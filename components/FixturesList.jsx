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

  return (
    <div className="divide-y divide-border/30">
      {title && (
        <div className="px-8 py-4 bg-white/5 border-b border-border">
          <h3 className="text-xs font-black text-secondary uppercase tracking-widest">{title}</h3>
        </div>
      )}
      <div className="p-4 space-y-4">
        {fixtures.map((match) => {
          const dateInfo = formatDate(match.utcDate);
          const prediction = predictions[match.id];

          return (
            <div key={match.id} className="bg-white/2 rounded-[2rem] border border-border/50 overflow-hidden hover:border-secondary/30 transition-all group">
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8">
                {/* Home Team */}
                <div className="flex-1 flex items-center justify-center sm:justify-end gap-6 min-w-0 w-full mb-6 sm:mb-0">
                  <span className="text-base font-black text-slate-200 truncate group-hover:text-secondary transition-colors">
                    {match.homeTeam.shortName || match.homeTeam.name}
                  </span>
                  <div className="w-14 h-14 bg-primary rounded-2xl shadow-lg border border-border p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <TeamLogo src={match.homeTeam.crest} className="w-full h-full object-contain" />
                  </div>
                </div>

                {/* Match Info */}
                <div className="px-12 flex flex-col items-center min-w-[160px] mb-6 sm:mb-0">
                  <div className="bg-secondary/10 px-4 py-1.5 rounded-full mb-3">
                    <span className="text-xs font-black text-secondary uppercase tracking-tighter">
                      {dateInfo.time}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-muted uppercase tracking-widest">
                    {dateInfo.day}, {dateInfo.date}
                  </span>
                </div>

                {/* Away Team */}
                <div className="flex-1 flex items-center justify-center sm:justify-start gap-6 min-w-0 w-full">
                  <div className="w-14 h-14 bg-primary rounded-2xl shadow-lg border border-border p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <TeamLogo src={match.awayTeam.crest} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-base font-black text-slate-200 truncate group-hover:text-secondary transition-colors">
                    {match.awayTeam.shortName || match.awayTeam.name}
                  </span>
                </div>
              </div>

              {/* Prediction Section */}
              {prediction && (
                <div className="bg-secondary/5 border-t border-secondary/10 p-6 sm:px-8">
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <div className="flex-shrink-0 flex items-center gap-3">
                      <div className="bg-secondary text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        Pro Prediction
                      </div>
                      <div className="flex items-center gap-2 bg-primary/50 px-3 py-1 rounded-lg border border-secondary/20">
                        <span className="text-sm font-black text-white">{prediction.home_score_prediction}</span>
                        <span className="text-[10px] font-black text-muted">-</span>
                        <span className="text-sm font-black text-white">{prediction.away_score_prediction}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 font-medium leading-relaxed italic">
                      "{prediction.prediction_text}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}