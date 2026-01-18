// app/page.js
import Link from 'next/link';
import { getUpcomingMatches } from '../lib/api';
import FixturesList from '../components/FixturesList';

export default async function Home() {
  // Fetch upcoming matches for top leagues
  const topLeagueIds = ['2021', '2014', '2019', '2002', '2015'];

  let allUpcomingMatches = [];
  try {
    const matchesPromises = topLeagueIds.map(id => getUpcomingMatches(id, 3));
    const results = await Promise.all(matchesPromises);
    allUpcomingMatches = results.flat().sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate)).slice(0, 10);
  } catch (error) {
    console.error('Error fetching upcoming matches for home page:', error);
  }

  return (
    <div className="min-h-full pb-20">
      {/* Hero Section */}
      <div className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="container mx-auto px-6 relative text-center">
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight">
            FOOTBALL <span className="text-secondary">ANALYTICS</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium">
            Professional-grade statistics, standings, and performance insights for the world's top football leagues.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/leagues/2021" className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-2xl font-bold transition-all premium-shadow-lg">
              Explore Analytics
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8">
        <div className="space-y-12">
          {/* Top Upcoming Matches Section */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Top Upcoming Matches</h2>
              <span className="text-[10px] font-black text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-widest">Global Coverage</span>
            </div>
            <div className="bg-card rounded-3xl shadow-xl border border-border overflow-hidden premium-shadow">
              {allUpcomingMatches.length > 0 ? (
                <FixturesList fixtures={allUpcomingMatches} title={null} />
              ) : (
                <div className="p-12 text-center">
                  <p className="text-slate-400 font-medium">No upcoming matches found at the moment.</p>
                </div>
              )}
            </div>
          </section>

          {/* Info Section */}
          <div className="glass-card rounded-3xl p-10 border border-white/5 premium-shadow">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-4">How to use the platform:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-secondary/20 text-secondary rounded-lg flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <p className="text-slate-400 text-sm leading-relaxed">Select a league from the sidebar to view live standings and deep analytics.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-secondary/20 text-secondary rounded-lg flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <p className="text-slate-400 text-sm leading-relaxed">Analyze "Power Pots" to see which teams are overperforming or struggling.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-secondary/20 text-secondary rounded-lg flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <p className="text-slate-400 text-sm leading-relaxed">Check "Under/Over" stats to identify betting trends and goal patterns.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-secondary/20 text-secondary rounded-lg flex items-center justify-center font-bold flex-shrink-0">4</div>
                    <p className="text-slate-400 text-sm leading-relaxed">Click on any team to see their detailed season performance and form.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}