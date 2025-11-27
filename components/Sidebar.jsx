// components/Sidebar.js
import { getTopLeagues, getAllLeagues } from '../lib/api';
import LeagueList from './LeagueList';

export default async function Sidebar() {
  try {
    // Fetch both top leagues and all leagues from API
    const [topLeagues, allLeagues] = await Promise.all([
      getTopLeagues(),
      getAllLeagues()
    ]);

    // Filter out duplicates and show all leagues
    const topLeagueIds = topLeagues.map(league => league.id);
    const filteredAllLeagues = allLeagues
      .filter(league => !topLeagueIds.includes(league.id))
      .slice(0, 25); // Show more leagues

    return (
      <div className="h-full flex flex-col">
        {/* Fixed header - will NOT scroll */}
        <div className="p-4 border-b border-gray-200 bg-blue-50 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800">Football Leagues</h2>
          <p className="text-xs text-gray-500 mt-1">Live standings & statistics</p>
        </div>
        
        {/* Scrollable content - ONLY this part will scroll */}
        <div className="flex-1 overflow-y-auto">
          <div className="h-full">
            {/* Top Leagues Section */}
            <div className="border-b border-gray-200">
              <LeagueList 
                leagues={topLeagues} 
                title="🏆 Top Leagues" 
              />
            </div>
            
            {/* All Leagues Section */}
            <div>
              <LeagueList 
                leagues={filteredAllLeagues} 
                title="🌍 All Leagues" 
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
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800">Leagues</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-red-500 text-sm">Error loading leagues. Please try again later.</p>
        </div>
      </div>
    );
  }
}