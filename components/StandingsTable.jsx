// components/StandingsTable.jsx
'use client';

import TeamLogo from './TeamLogo';
import Link from 'next/link';

export default function StandingsTable({ standings, recentMatches, allMatches, liveMatches = [] }) {
  if (!standings || standings.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-slate-500">
          <p className="text-sm font-bold uppercase tracking-widest">No standings data available</p>
          <p className="text-xs mt-2">The season may not have started yet.</p>
        </div>
      </div>
    );
  }

  // Helper to calculate standings from matches if API tables are missing
  const calculateStandings = (matches) => {
    if (!matches || matches.length === 0) return [];
    const table = {};
    matches.forEach(match => {
      const homeId = match.homeTeam.id;
      const awayId = match.awayTeam.id;

      if (!table[homeId]) table[homeId] = { team: match.homeTeam, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0 };
      if (!table[awayId]) table[awayId] = { team: match.awayTeam, playedGames: 0, won: 0, draw: 0, lost: 0, points: 0 };

      const homeScore = match.score.fullTime.home;
      const awayScore = match.score.fullTime.away;

      if (homeScore === null || awayScore === null) return;

      table[homeId].playedGames++;
      if (homeScore > awayScore) { table[homeId].won++; table[homeId].points += 3; }
      else if (homeScore === awayScore) { table[homeId].draw++; table[homeId].points += 1; }
      else table[homeId].lost++;

      table[awayId].playedGames++;
      if (awayScore > homeScore) { table[awayId].won++; table[awayId].points += 3; }
      else if (awayScore === homeScore) { table[awayId].draw++; table[awayId].points += 1; }
      else table[awayId].lost++;
    });

    return Object.values(table).sort((a, b) => b.points - a.points || (b.won - a.won));
  };

  // Extract total table with calculation fallback
  const totalTable = standings.find(s => s.type === 'TOTAL')?.table || (allMatches ? calculateStandings(allMatches) : []);

  const TableHeader = ({ title, bgColor = "bg-slate-50" }) => (
    <div className={`px-8 py-4 ${bgColor} border-b border-border`}>
      <h3 className="text-xs font-black text-primary uppercase tracking-widest">{title}</h3>
    </div>
  );

  const TableRow = ({ team, stats, position }) => {
    // Check if this team is currently playing a live match
    const liveMatch = liveMatches.find(m =>
      m.homeTeam.id === team.id || m.awayTeam.id === team.id
    );

    return (
      <tr className="border-b border-border hover:bg-slate-50 transition-colors group">
        <td className="px-6 py-4 font-black text-slate-500 text-xs w-12">{position}</td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/teams/${team.id}`}
              className="flex items-center space-x-4 group/link"
            >
              <div className="w-8 h-8 bg-white rounded-lg p-1.5 border border-border group-hover/link:border-primary transition-colors shadow-sm">
                <TeamLogo
                  src={team.crest}
                  alt={team.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-slate-900 text-sm group-hover/link:text-primary transition-colors truncate max-w-[100px] sm:max-w-none">
                {team.shortName || team.name}
              </span>
            </Link>

            {liveMatch && (
              <div className="flex items-center gap-2 ml-2 flex-shrink-0 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                </span>
                <span className="text-[9px] font-black text-rose-600 uppercase tracking-tighter hidden xs:inline">LIVE</span>
                <span className="text-[10px] font-black text-slate-900">
                  {liveMatch.score.fullTime.home} - {liveMatch.score.fullTime.away}
                </span>
              </div>
            )}
          </div>
        </td>
        <td className="px-4 py-4 text-center text-slate-600 text-xs font-bold">{stats.playedGames || stats.played}</td>
        <td className="px-4 py-4 text-center text-emerald-600 font-black text-xs">{stats.won}</td>
        <td className="px-4 py-4 text-center text-amber-600 font-black text-xs">{stats.draw}</td>
        <td className="px-4 py-4 text-center text-rose-600 font-black text-xs">{stats.lost}</td>
        <td className="px-4 py-4 text-center">
          <span className="bg-primary/5 text-primary px-3 py-1 rounded-lg font-black text-xs shadow-sm border border-primary/10">
            {stats.points}
          </span>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-12">
      {/* General Standings */}
      <div className="overflow-hidden bg-white border border-border rounded-2xl shadow-sm">
        <TableHeader title="General Standings" />
        <div className="overflow-x-auto custom-scrollbar relative">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="sticky left-0 z-20 bg-slate-50/50 px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest min-w-[60px]">Pos</th>
                <th className="sticky left-[60px] z-20 bg-slate-50/50 px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest min-w-[180px]">Team</th>
                <th className="px-4 py-3 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">P</th>
                <th className="px-4 py-3 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">W</th>
                <th className="px-4 py-3 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">D</th>
                <th className="px-4 py-3 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">L</th>
                <th className="px-4 py-3 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {totalTable.map((team, idx) => {
                const stats = team;
                const position = team.position || idx + 1;
                const liveMatch = liveMatches.find(m =>
                  m.homeTeam.id === team.team.id || m.awayTeam.id === team.team.id
                );

                return (
                  <tr key={team.team.id} className="border-b border-border hover:bg-slate-50 transition-colors group">
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 px-6 py-4 font-black text-slate-500 text-xs">{position}</td>
                    <td className="sticky left-[60px] z-10 bg-white group-hover:bg-slate-50 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/teams/${team.team.id}`}
                          className="flex items-center space-x-4 group/link"
                        >
                          <div className="w-8 h-8 bg-white rounded-lg p-1.5 border border-border group-hover/link:border-primary transition-colors shadow-sm flex-shrink-0">
                            <TeamLogo
                              src={team.team.crest}
                              alt={team.team.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="font-bold text-slate-900 text-sm group-hover/link:text-primary transition-colors truncate max-w-[120px]">
                            {team.team.shortName || team.team.name}
                          </span>
                        </Link>

                        {liveMatch && (
                          <div className="flex items-center gap-2 ml-2 flex-shrink-0 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 scale-90 sm:scale-100">
                            <span className="flex h-1.5 w-1.5 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                            </span>
                            <span className="text-[10px] font-black text-slate-900">
                              {liveMatch.score.fullTime.home}-{liveMatch.score.fullTime.away}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-slate-600 text-xs font-bold">{stats.playedGames || stats.played}</td>
                    <td className="px-4 py-4 text-center text-emerald-600 font-black text-xs">{stats.won}</td>
                    <td className="px-4 py-4 text-center text-amber-600 font-black text-xs">{stats.draw}</td>
                    <td className="px-4 py-4 text-center text-rose-600 font-black text-xs">{stats.lost}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="bg-primary/5 text-primary px-3 py-1 rounded-lg font-black text-xs shadow-sm border border-primary/10">
                        {stats.points}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>


      {/* Recent Results */}
      {recentMatches && recentMatches.length > 0 && (
        <div className="pb-8 bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          <TableHeader title="Recent Results" />
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentMatches.map((match) => (
              <div key={match.id} className="bg-slate-50/50 border border-border p-4 rounded-2xl hover:border-primary/30 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                    {new Date(match.utcDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-[9px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded uppercase tracking-tighter border border-primary/10">
                    FT
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    <div className="w-6 h-6 flex-shrink-0">
                      <TeamLogo src={match.homeTeam.crest} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 truncate">{match.homeTeam.shortName || match.homeTeam.name}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-border shadow-sm">
                    <span className="text-sm font-black text-primary">{match.score.fullTime.home}</span>
                    <span className="text-xs font-bold text-slate-400">-</span>
                    <span className="text-sm font-black text-primary">{match.score.fullTime.away}</span>
                  </div>
                  <div className="flex-1 flex items-center justify-end gap-3 min-w-0">
                    <span className="text-xs font-bold text-slate-700 truncate">{match.awayTeam.shortName || match.awayTeam.name}</span>
                    <div className="w-6 h-6 flex-shrink-0">
                      <TeamLogo src={match.awayTeam.crest} className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}