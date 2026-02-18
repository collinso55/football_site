// components/PowerPotsTable.jsx
'use client';

import TeamLogo from './TeamLogo';
import { useState } from 'react';

export default function PowerPotsTable({ standings, leagueName = "this league" }) {
  const [showExplanation, setShowExplanation] = useState(false);

  if (!standings || standings.length === 0) {
    return (
      <div className="p-12 text-center text-muted text-xs font-bold uppercase tracking-widest">
        No analytics data available.
      </div>
    );
  }

  const calculatePowerPots = (teams) => {
    if (teams.length === 0) return [];
    const maxPoints = Math.max(...teams.map(team => team.points));
    const segmentSize = maxPoints / 5;

    const pots = [
      { name: 'Elite', min: segmentSize * 4, max: maxPoints, color: 'bg-emerald-500', textColor: 'text-emerald-500', bgColor: 'bg-emerald-500/10', description: 'Title Contenders' },
      { name: 'Strong', min: segmentSize * 3, max: segmentSize * 4, color: 'bg-blue-500', textColor: 'text-blue-500', bgColor: 'bg-blue-500/10', description: 'European Spots' },
      { name: 'Mid', min: segmentSize * 2, max: segmentSize * 3, color: 'bg-amber-500', textColor: 'text-amber-500', bgColor: 'bg-amber-500/10', description: 'Safe Zone' },
      { name: 'Weak', min: segmentSize * 1, max: segmentSize * 2, color: 'bg-orange-500', textColor: 'text-orange-500', bgColor: 'bg-orange-500/10', description: 'Struggling' },
      { name: 'Danger', min: 0, max: segmentSize * 1, color: 'bg-rose-500', textColor: 'text-rose-500', bgColor: 'bg-rose-500/10', description: 'Relegation Risk' }
    ];

    const teamsWithPots = teams.map(team => {
      const pot = pots.find(p => team.points >= p.min && team.points <= p.max) || pots[4];
      return { ...team, pot: pot.name, potColor: pot.color, potTextColor: pot.textColor, potBgColor: pot.bgColor };
    });

    return { teamsWithPots, pots, maxPoints, segmentSize };
  };

  const { teamsWithPots, pots, maxPoints, segmentSize } = calculatePowerPots(standings);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-xs font-black text-primary uppercase tracking-widest">Power Analytics</h3>
          <p className="text-[10px] font-bold text-muted uppercase mt-1">Tier-based performance segmentation</p>
        </div>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all border border-border font-black shadow-sm"
        >
          ?
        </button>
      </div>

      {showExplanation && (
        <div className="mb-10 p-8 bg-primary rounded-3xl text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
          <h4 className="text-lg font-black mb-3">How segments are calculated</h4>
          <p className="text-sm text-blue-100/80 leading-relaxed mb-6">
            We divide the league into 5 equal segments based on the current leader's points ({maxPoints} pts).
            Each segment represents {Math.ceil(segmentSize)} points of performance variance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pots.map(p => (
              <div key={p.name} className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10">
                <div className={`w-3 h-3 rounded-full ${p.color} shadow-sm border border-white/20`}></div>
                <span className="text-[10px] font-black uppercase tracking-widest">{p.name}: <span className="text-blue-100/60 font-bold ml-1">{p.description}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {pots.map(pot => {
          const teamsInPot = teamsWithPots.filter(t => t.pot === pot.name);
          if (teamsInPot.length === 0) return null;

          return (
            <div key={pot.name} className={`rounded-3xl border border-border overflow-hidden bg-white shadow-sm`}>
              <div className={`px-6 py-3 ${pot.bgColor} border-b border-border/50 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${pot.color}`}></div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${pot.textColor}`}>{pot.name}</span>
                </div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{pot.description}</span>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {teamsInPot.map(team => (
                  <div key={team.team.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-border hover:border-primary/30 transition-all group shadow-sm">
                    <div className="w-8 h-8 flex-shrink-0 bg-white rounded-lg p-1.5 border border-border">
                      <TeamLogo src={team.team.crest} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 truncate group-hover:text-primary transition-colors">{team.team.tla || team.team.shortName}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">{team.points} PTS</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 pt-8 border-t border-border grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 text-center border border-border shadow-sm">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Leader Gap</p>
          <p className="text-3xl font-black text-slate-900">{maxPoints} <span className="text-xs text-slate-500 ml-1">PTS</span></p>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center border border-border shadow-sm">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Variance</p>
          <p className="text-3xl font-black text-slate-900">±{Math.ceil(segmentSize)} <span className="text-xs text-slate-500 ml-1">PTS</span></p>
        </div>
      </div>
    </div>
  );
}