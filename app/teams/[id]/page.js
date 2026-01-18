// app/teams/[id]/page.js
import { getTeamDetails, getTeamMatches } from '../../../lib/api';
import TeamLogo from '../../../components/TeamLogo';
import CountryFlag from '../../../components/CountryFlag';

export default async function TeamPage({ params }) {
  const { id } = await params;

  try {
    const [teamData, teamMatches] = await Promise.all([
      getTeamDetails(id),
      getTeamMatches(id, 50)
    ]);

    const team = teamData;

    if (!team) {
      return (
        <div className="min-h-screen p-8 bg-background">
          <div className="max-w-2xl mx-auto bg-rose-500/10 border border-rose-500/20 rounded-3xl p-10 text-center">
            <h1 className="text-2xl font-bold text-rose-500 mb-2 uppercase tracking-widest">Team Not Found</h1>
            <p className="text-slate-400 font-medium">The requested team could not be found or is currently unavailable.</p>
          </div>
        </div>
      );
    }

    const currentYear = new Date().getFullYear();
    const finishedMatches = teamMatches.filter(match =>
      match.status === 'FINISHED' &&
      new Date(match.utcDate).getFullYear() >= currentYear - 1
    );

    const stats = calculateTeamStats(finishedMatches, team.id);
    const homeStats = calculateHomeAwayStats(finishedMatches, team.id, 'home');
    const awayStats = calculateHomeAwayStats(finishedMatches, team.id, 'away');

    return (
      <div className="min-h-screen bg-background pb-20">
        {/* Team Header */}
        <div className="bg-primary text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="container mx-auto px-6 relative">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="w-40 h-40 bg-white rounded-3xl p-8 shadow-2xl flex items-center justify-center relative">
                <TeamLogo src={team.crest} alt={team.name} className="w-full h-full object-contain" />
                {team.area?.flag && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-8 border-2 border-primary rounded-lg overflow-hidden shadow-lg">
                    <CountryFlag src={team.area.flag} alt={team.area.name} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 uppercase">{team.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Founded</span>
                    <span className="text-lg font-black">{team.founded || 'N/A'}</span>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Venue</span>
                    <span className="text-lg font-black">{team.venue || 'N/A'}</span>
                  </div>
                  {team.website && (
                    <>
                      <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                      <a href={team.website} target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-white/10 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-white/10 backdrop-blur-sm">
                        Official Site ↗
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 mt-8">
          {/* VERTICAL LAYOUT - FULL WIDTH SECTIONS */}
          <div className="space-y-12">
            {/* Season Performance */}
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Season Performance</h2>
                <span className="text-[10px] font-black text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-widest">Analytics</span>
              </div>
              <div className="bg-card rounded-3xl shadow-xl border border-border overflow-hidden premium-shadow">
                <div className="p-8">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
                    <div className="text-center bg-white/2 p-6 rounded-2xl border border-border/30">
                      <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Matches</p>
                      <p className="text-3xl font-black text-white">{stats.totalMatches}</p>
                    </div>
                    <div className="text-center bg-white/2 p-6 rounded-2xl border border-border/30">
                      <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Win Rate</p>
                      <p className="text-3xl font-black text-emerald-500">{stats.totalMatches > 0 ? Math.round((stats.wins / stats.totalMatches) * 100) : 0}%</p>
                    </div>
                    <div className="text-center bg-white/2 p-6 rounded-2xl border border-border/30">
                      <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Avg Goals</p>
                      <p className="text-3xl font-black text-blue-500">{stats.totalMatches > 0 ? (stats.totalGoals / stats.totalMatches).toFixed(2) : '0.00'}</p>
                    </div>
                    <div className="text-center bg-white/2 p-6 rounded-2xl border border-border/30">
                      <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Points</p>
                      <p className="text-3xl font-black text-white">{stats.points}</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h3 className="text-xs font-black text-secondary uppercase tracking-widest border-b border-border/30 pb-3">Detailed Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
                      <StatRow label="Wins" value={stats.wins} total={stats.totalMatches} color="text-emerald-500" />
                      <StatRow label="Draws" value={stats.draws} total={stats.totalMatches} color="text-amber-500" />
                      <StatRow label="Losses" value={stats.losses} total={stats.totalMatches} color="text-rose-500" />
                      <StatRow label="Clean Sheets" value={stats.receivedNo} total={stats.totalMatches} color="text-blue-500" />
                      <StatRow label="Over 2.5 Goals" value={stats.over25} total={stats.totalMatches} color="text-white" />
                      <StatRow label="Both Teams Scored" value={stats.scoredYes && stats.receivedYes ? stats.scoredYes : 0} total={stats.totalMatches} color="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Home/Away Splits - STACKED VERTICALLY */}
            <div className="grid grid-cols-1 gap-12">
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white">Home Fortress</h2>
                </div>
                <div className="bg-card rounded-3xl shadow-xl border border-border overflow-hidden premium-shadow">
                  <div className="p-8">
                    <HomeAwayStats stats={homeStats} type="home" />
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white">Away Form</h2>
                </div>
                <div className="bg-card rounded-3xl shadow-xl border border-border overflow-hidden premium-shadow">
                  <div className="p-8">
                    <HomeAwayStats stats={awayStats} type="away" />
                  </div>
                </div>
              </section>
            </div>

            {/* Match Results */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Recent Results</h2>
              </div>
              <div className="bg-card rounded-3xl shadow-xl border border-border overflow-hidden premium-shadow">
                <TeamMatchesTable matches={finishedMatches} team={team} />
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading team data:', error);
    return (
      <div className="min-h-screen p-8 bg-background">
        <div className="max-w-2xl mx-auto bg-card rounded-3xl p-10 shadow-xl border border-rose-500/20 text-center">
          <h1 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">Sync Error</h1>
          <p className="text-slate-400 mb-8 font-medium">{error.message}</p>
          <button onClick={() => window.location.reload()} className="bg-secondary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest">Retry Sync</button>
        </div>
      </div>
    );
  }
}

function StatRow({ label, value, total, color = "text-white" }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[10px] font-black text-muted uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-4">
        <span className={`text-sm font-black ${color}`}>{value}</span>
        <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div className={`h-full ${color.replace('text', 'bg')} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} style={{ width: `${percentage}%` }}></div>
        </div>
        <span className="text-[10px] font-black text-muted w-10 text-right">{percentage}%</span>
      </div>
    </div>
  );
}

function HomeAwayStats({ stats, type }) {
  const color = type === 'home' ? 'emerald' : 'blue';
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white/2 p-6 rounded-2xl border border-border/30">
        <div className="text-center flex-1">
          <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Record (W-D-L)</p>
          <p className="text-2xl font-black text-white">{stats.wins}-{stats.draws}-{stats.losses}</p>
        </div>
        <div className="w-px h-12 bg-border/30"></div>
        <div className="text-center flex-1">
          <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Total Points</p>
          <p className={`text-2xl font-black text-${color}-500`}>{stats.points} <span className="text-xs text-muted ml-1">PTS</span></p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
        <StatRow label="Goals Scored" value={stats.goalsFor} total={stats.totalMatches} color={`text-${color}-500`} />
        <StatRow label="Goals Conceded" value={stats.goalsAgainst} total={stats.totalMatches} color="text-rose-500" />
      </div>
    </div>
  );
}

function TeamMatchesTable({ matches, team }) {
  const sortedMatches = [...matches].sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate)).slice(0, 15);
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full">
        <tbody className="divide-y divide-border/30">
          {sortedMatches.map((match) => {
            const isHome = match.homeTeam.id === team.id;
            const result = (isHome ? match.score.fullTime.home > match.score.fullTime.away : match.score.fullTime.away > match.score.fullTime.home) ? 'W' :
              (match.score.fullTime.home === match.score.fullTime.away) ? 'D' : 'L';
            const resultColor = result === 'W' ? 'bg-emerald-500' : result === 'D' ? 'bg-amber-500' : 'bg-rose-500';

            return (
              <tr key={match.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-10 h-10 rounded-xl ${resultColor} flex items-center justify-center text-white text-xs font-black shadow-lg`}>{result}</div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-muted uppercase tracking-widest">{new Date(match.utcDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-xs font-black text-secondary uppercase tracking-tighter">{match.competition.name}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <span className={`text-sm font-black uppercase tracking-tight ${isHome ? 'text-secondary' : 'text-slate-200'}`}>{match.homeTeam.shortName || match.homeTeam.name}</span>
                    <div className="flex items-center gap-3 bg-primary px-4 py-1.5 rounded-xl border border-border shadow-inner">
                      <span className="text-lg font-black text-white">{match.score.fullTime.home}</span>
                      <span className="text-xs font-bold text-muted">-</span>
                      <span className="text-lg font-black text-white">{match.score.fullTime.away}</span>
                    </div>
                    <span className={`text-sm font-black uppercase tracking-tight ${!isHome ? 'text-secondary' : 'text-slate-200'}`}>{match.awayTeam.shortName || match.awayTeam.name}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function calculateTeamStats(matches, teamId) {
  const stats = { totalMatches: matches.length, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0, totalGoals: 0, under25: 0, over25: 0, scoredYes: 0, scoredNo: 0, receivedYes: 0, receivedNo: 0 };
  matches.forEach(match => {
    const homeGoals = match.score?.fullTime?.home || 0;
    const awayGoals = match.score?.fullTime?.away || 0;
    const totalGoals = homeGoals + awayGoals;
    const isHome = match.homeTeam.id === teamId;
    const teamGoals = isHome ? homeGoals : awayGoals;
    const opponentGoals = isHome ? awayGoals : homeGoals;
    stats.goalsFor += teamGoals; stats.goalsAgainst += opponentGoals; stats.totalGoals += totalGoals;
    if (teamGoals > opponentGoals) { stats.wins++; stats.points += 3; } else if (teamGoals === opponentGoals) { stats.draws++; stats.points += 1; } else { stats.losses++; }
    if (totalGoals < 2.5) stats.under25++; else stats.over25++;
    if (teamGoals > 0) stats.scoredYes++; else stats.scoredNo++;
    if (opponentGoals > 0) stats.receivedYes++; else stats.receivedNo++;
  });
  return stats;
}

function calculateHomeAwayStats(matches, teamId, type) {
  return calculateTeamStats(matches.filter(m => (type === 'home' && m.homeTeam.id === teamId) || (type === 'away' && m.awayTeam.id === teamId)), teamId);
}