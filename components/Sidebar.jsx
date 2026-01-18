// components/Sidebar.js
import { getTopLeagues, getAllLeagues } from '../lib/api';
import LeagueList from './LeagueList';

export default async function Sidebar() {
  try {
    const [topLeagues, allLeagues] = await Promise.all([
      getTopLeagues(),
      getAllLeagues()
    ]);

    const topLeagueIds = topLeagues.map(league => league.id);
    const filteredAllLeagues = allLeagues
      .filter(league => !topLeagueIds.includes(league.id))
      .slice(0, 25);

    return (
      <div className="h-full flex flex-col bg-card border-r border-border">
        {/* Header */}
        <div className="p-6 border-b border-border bg-white/5 flex-shrink-0">
          <h2 className="text-xs font-bold text-secondary uppercase tracking-widest">Leagues</h2>
          <p className="text-[10px] text-muted mt-1 uppercase font-medium">Live standings & statistics</p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="py-2">
            <div className="mb-2">
              <LeagueList
                leagues={topLeagues}
                title="Top Leagues"
              />
            </div>

            <div className="border-t border-border/10 pt-2">
              <LeagueList
                leagues={filteredAllLeagues}
                title="All Leagues"
                showCountry={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in Sidebar:', error);
    return (
      <div className="h-full flex flex-col bg-card border-r border-border">
        <div className="p-6 border-b border-border flex-shrink-0">
          <h2 className="text-xs font-bold text-secondary uppercase tracking-widest">Leagues</h2>
        </div>
        <div className="flex-1 p-6">
          <p className="text-rose-500 text-[10px] font-bold uppercase">Error loading leagues.</p>
        </div>
      </div>
    );
  }
}