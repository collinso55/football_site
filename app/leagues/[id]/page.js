// app/leagues/[id]/page.js
import { getLeagueById, getStandings, getUpcomingMatches, getRecentMatches } from '../../../lib/api';
import StandingsTable from '../../../components/StandingsTable';
import FixturesList from '../../../components/FixturesList';
import LeagueLogo from '../../../components/LeagueLogo';
import CountryFlag from '../../../components/CountryFlag';

export default async function LeaguePage({ params }) {
  const { id } = await params;
  
  try {
    const [leagueData, standingsData, upcomingMatches, recentMatches] = await Promise.all([
      getLeagueById(id),
      getStandings(id),
      getUpcomingMatches(id, 5),
      getRecentMatches(id, 10) // ← ADD THIS LINE
    ]);

    const league = leagueData;
    const standings = standingsData.standings?.[0]?.table || [];

    // Add debug logging
    console.log('🔍 LEAGUE PAGE - recentMatches count:', recentMatches?.length);
    console.log('🔍 LEAGUE PAGE - recentMatches data:', recentMatches);

    if (!league) {
      return (
        <div className="min-h-full p-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h1 className="text-xl font-bold text-yellow-800 mb-2">League Not Found</h1>
            <p className="text-yellow-600 text-sm">The requested league could not be found.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-full p-4">
        {/* League Header - Smaller */}
        <div className="mb-4 flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border">
          <LeagueLogo
            src={league.emblem}
            alt={league.name}
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">{league.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              {league.area?.flag && (
                <CountryFlag
                  src={league.area.flag}
                  alt={league.area.name}
                  className="w-4 h-3 object-cover"
                />
              )}
              <p className="text-gray-600 text-xs">
                {league.area?.name || 'International'}
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Fixtures - Smaller */}
        <FixturesList 
          fixtures={upcomingMatches} 
          title={`Upcoming ${league.name} Fixtures`}
        />
        
        {/* Standings Tables */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">League Standings</h2>
            {standingsData.season && (
              <p className="text-xs text-gray-600 mt-1">
                Season {standingsData.season.startDate} - {standingsData.season.endDate}
                {standingsData.season.currentMatchday && (
                  <span className="ml-2">• Matchday {standingsData.season.currentMatchday}</span>
                )}
              </p>
            )}
          </div>
          {/* PASS recentMatches to StandingsTable */}
          <StandingsTable standings={standings} recentMatches={recentMatches} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading league data:', error);
    return (
      <div className="min-h-full p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h1 className="text-xl font-bold text-red-800 mb-2">Error</h1>
          <p className="text-red-600 text-sm">Failed to load league data. Please try again later.</p>
        </div>
      </div>
    );
  }
}