// app/leagues/[id]/page.js
import { getLeagueById, getStandings, getUpcomingMatches, getRecentMatches, getMatchesForStatistics, getLiveMatches } from '../../../lib/api';
import StandingsTable from '../../../components/StandingsTable';
import FixturesList from '../../../components/FixturesList';
import PowerPotsTable from '../../../components/PowerPotsTable';
import StatsTables from '../../../components/StatsTables';
import LeagueLogo from '../../../components/LeagueLogo';
import CountryFlag from '../../../components/CountryFlag';

export default async function LeaguePage({ params }) {
  const { id } = await params;

  try {
    const [leagueData, standingsData, upcomingMatches, recentMatches, allMatches, liveMatches] = await Promise.all([
      getLeagueById(id),
      getStandings(id),
      getUpcomingMatches(id, 5),
      getRecentMatches(id, 10),
      getMatchesForStatistics(id),
      getLiveMatches(id)
    ]);

    const league = leagueData;
    const standings = standingsData.standings?.[0]?.table || [];

    if (!league) {
      return (
        <div className="min-h-full p-8 bg-background">
          <div className="max-w-2xl mx-auto bg-rose-500/10 border border-rose-500/20 rounded-3xl p-10 text-center">
            <h1 className="text-2xl font-bold text-rose-500 mb-2">League Not Found</h1>
            <p className="text-slate-400">The requested league could not be found or is currently unavailable.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-full bg-background pb-20">
        {/* League Header */}
        <div className="bg-primary text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="container mx-auto px-6 relative">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="w-32 h-32 bg-white rounded-3xl p-6 shadow-2xl flex items-center justify-center">
                <LeagueLogo src={league.emblem} alt={league.name} className="w-full h-full object-contain" />
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                  {league.area?.flag && (
                    <CountryFlag src={league.area.flag} alt={league.area.name} className="w-6 h-4 rounded-sm object-cover" />
                  )}
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">{league.area?.name}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">{league.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Season</span>
                    <span className="text-lg font-bold">{league.currentSeason?.startDate?.split('-')[0]}/{league.currentSeason?.endDate?.split('-')[0]}</span>
                  </div>
                  <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Matchday</span>
                    <span className="text-lg font-bold">{league.currentSeason?.currentMatchday || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 mt-8">
          {/* VERTICAL LAYOUT - ALL TABLES FULL WIDTH */}
          <div className="space-y-12">
            {/* Upcoming Fixtures Section - MOVED TO TOP */}
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Upcoming Fixtures</h2>
                <span className="text-[10px] font-black text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-widest">Next Games</span>
              </div>
              <div className="bg-card rounded-3xl shadow-xl border border-border overflow-hidden premium-shadow">
                {upcomingMatches && upcomingMatches.length > 0 ? (
                  <FixturesList fixtures={upcomingMatches} title={null} />
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No upcoming fixtures found</p>
                  </div>
                )}
              </div>
            </section>

            {/* Standings Section */}
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">League Standings</h2>
                <span className="text-[10px] font-black text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-widest">Live Updates</span>
              </div>
              <div className="bg-card rounded-3xl shadow-xl border border-border overflow-hidden premium-shadow">
                {standings.length > 0 || (allMatches && allMatches.length > 0) ? (
                  <StandingsTable
                    standings={standingsData.standings || []}
                    recentMatches={recentMatches}
                    allMatches={allMatches}
                    liveMatches={liveMatches}
                  />
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">League hasn't started yet</p>
                    <p className="text-xs text-slate-500 mt-2">Check back soon for live standings and results.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Power Analytics Section */}
            {standings.length > 0 && (
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white">Power Analytics</h2>
                </div>
                <div className="bg-card rounded-3xl shadow-xl border border-border overflow-hidden premium-shadow">
                  <PowerPotsTable standings={standings} leagueName={league.name} />
                </div>
              </section>
            )}

            {/* Statistics Section */}
            {(standings.length > 0 || (allMatches && allMatches.length > 0)) && (
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white">Advanced Statistics</h2>
                </div>
                <div className="bg-card rounded-3xl shadow-xl border border-border overflow-hidden premium-shadow">
                  <StatsTables standings={standings} recentMatches={allMatches} />
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading league data:', error);
    return (
      <div className="min-h-full p-8 bg-background">
        <div className="max-w-2xl mx-auto bg-card rounded-3xl p-10 shadow-xl border border-rose-500/20 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Sync Error</h1>
          <p className="text-slate-400 mb-8">{error.message}</p>
          <button onClick={() => window.location.reload()} className="bg-secondary text-white px-8 py-3 rounded-xl font-bold">Retry Sync</button>
        </div>
      </div>
    );
  }
}