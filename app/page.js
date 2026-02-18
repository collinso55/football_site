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
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="container mx-auto px-6 relative text-center">
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight">
            FOOTBALL <span className="text-white opacity-80 decoration-secondary decoration-4 underline underline-offset-8">ANALYTICS</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto mb-10 font-medium">
            Professional-grade statistics, standings, and performance insights for the world's top football leagues.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/leagues/2021" className="bg-white text-primary hover:bg-slate-50 px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-primary/20">
              Explore Leagues
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8">
        <div className="space-y-12">
          {/* Top Upcoming Matches Section */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Top Upcoming Matches</h2>
              <span className="text-[10px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-widest border border-primary/10">Global Coverage</span>
            </div>
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-border overflow-hidden">
              {allUpcomingMatches.length > 0 ? (
                <FixturesList fixtures={allUpcomingMatches} title={null} />
              ) : (
                <div className="p-16 text-center">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No upcoming matches at the moment.</p>
                </div>
              )}
            </div>
          </section>

          {/* Info Section */}
          <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] p-10 border border-border shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">How to use the platform:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black flex-shrink-0 shadow-sm border border-primary/10">1</div>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed">Select a league from the sidebar to view live standings and deep analytics.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black flex-shrink-0 shadow-sm border border-primary/10">2</div>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed">Analyze "Power Pots" to see which teams are overperforming or struggling.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black flex-shrink-0 shadow-sm border border-primary/10">3</div>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed">Check "Under/Over" stats to identify betting trends and goal patterns.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black flex-shrink-0 shadow-sm border border-primary/10">4</div>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed">Click on any team to see their detailed season performance and form.</p>
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