// components/StatsTables.jsx
'use client';

import TeamLogo from './TeamLogo';

export default function StatsTables({ standings, recentMatches }) {
  if (!recentMatches || recentMatches.length === 0 || !standings || standings.length === 0) {
    return (
      <div className="p-16 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-black text-white mb-2 uppercase tracking-widest">Advanced Statistics</h3>
        <p className="text-muted text-xs max-w-xs mx-auto font-bold uppercase tracking-tighter">Detailed performance metrics will be available once more match data is synchronized.</p>
      </div>
    );
  }

  const calculateUnderOverStats = (teamId, matches) => {
    const teamMatches = matches.filter(match =>
      (match.homeTeam.id === teamId || match.awayTeam.id === teamId) && match.status === 'FINISHED'
    );
    const calculateStats = (matchList) => {
      const total = matchList.length;
      if (total === 0) return { under25: 0, over25: 0, under25Pct: 0, over25Pct: 0 };
      const under25 = matchList.filter(match => ((match.score?.fullTime?.home || 0) + (match.score?.fullTime?.away || 0)) < 2.5).length;
      return { under25, over25: total - under25, under25Pct: Math.round((under25 / total) * 100), over25Pct: Math.round(((total - under25) / total) * 100) };
    };
    return {
      total: calculateStats(teamMatches),
      home: calculateStats(teamMatches.filter(m => m.homeTeam.id === teamId)),
      away: calculateStats(teamMatches.filter(m => m.awayTeam.id === teamId))
    };
  };

  const teamsWithStats = standings.slice(0, 10).map((team, index) => ({
    position: index + 1,
    team: team.team,
    underOver: calculateUnderOverStats(team.team.id, recentMatches)
  }));

  const StatBadge = ({ pct, type }) => (
    <div className="flex flex-col items-center">
      <div className={`text-[10px] font-black ${type === 'under' ? 'text-blue-600' : 'text-rose-600'}`}>{pct}%</div>
      <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden border border-slate-200">
        <div className={`h-full ${type === 'under' ? 'bg-blue-600' : 'bg-rose-600'}`} style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Under/Over Table */}
      <div className="overflow-hidden bg-white border border-border rounded-2xl shadow-sm">
        <div className="px-8 py-6 border-b border-border bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-black text-primary uppercase tracking-widest">Under/Over 2.5 Goals</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Goal frequency analysis</p>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Under</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-600"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Over</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-border">
              <tr>
                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Team</th>
                <th className="px-8 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Overall</th>
                <th className="px-8 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Home</th>
                <th className="px-8 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Away</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {teamsWithStats.map((team) => (
                <tr key={team.team.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-white rounded-lg p-1.5 border border-border group-hover:border-primary transition-colors shadow-sm">
                        <TeamLogo src={team.team.crest} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors truncate max-w-[150px]">
                        {team.team.shortName || team.team.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-6">
                      <StatBadge pct={team.underOver.total.under25Pct} type="under" />
                      <StatBadge pct={team.underOver.total.over25Pct} type="over" />
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-6">
                      <StatBadge pct={team.underOver.home.under25Pct} type="under" />
                      <StatBadge pct={team.underOver.home.over25Pct} type="over" />
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-6">
                      <StatBadge pct={team.underOver.away.under25Pct} type="under" />
                      <StatBadge pct={team.underOver.away.over25Pct} type="over" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
