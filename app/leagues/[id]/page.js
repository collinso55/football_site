// app/leagues/[id]/page.js
import { getLeagueById, getStandings, getUpcomingMatches, getRecentMatches, getMatchesForStatistics } from '../../../lib/api';
import StandingsTable from '../../../components/StandingsTable';
import FixturesList from '../../../components/FixturesList';
import LeagueLogo from '../../../components/LeagueLogo';
import CountryFlag from '../../../components/CountryFlag';
import PowerPotsTable from '../../../components/PowerPotsTable';
import StatsTables from '../../../components/StatsTables';

export default async function LeaguePage({ params }) {
  const { id } = await params;
  
  try {
    const [leagueData, standingsData, upcomingMatches, recentMatches, allMatches] = await Promise.all([
      getLeagueById(id),
      getStandings(id),
      getUpcomingMatches(id, 5),
      getRecentMatches(id, 10),
      getMatchesForStatistics(id) // ADD THIS - Get all matches for statistics
    ]);

    const league = leagueData;
    const standings = standingsData.standings?.[0]?.table || [];

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
        <div className="mb-6 flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm border">
          <LeagueLogo
            src={league.emblem}
            alt={league.name}
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{league.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              {league.area?.flag && (
                <CountryFlag
                  src={league.area.flag}
                  alt={league.area.name}
                  className="w-5 h-4 object-cover rounded"
                />
              )}
              <p className="text-gray-600 text-sm">
                {league.area?.name || 'International'}
              </p>
              {standingsData.season && (
                <span className="text-gray-500 text-sm">• Season {new Date(standingsData.season.startDate).getFullYear()}/{new Date(standingsData.season.endDate).getFullYear()}</span>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Fixtures */}
        <div className="mb-6">
          <FixturesList 
            fixtures={upcomingMatches} 
            title={`Upcoming ${league.name} Fixtures`}
          />
        </div>
        
        {/* Standings Tables */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">League Standings</h2>
            {standingsData.season && (
              <div className="flex items-center space-x-4 mt-2">
                <p className="text-sm text-gray-600">
                  Season: {new Date(standingsData.season.startDate).toLocaleDateString()} - {new Date(standingsData.season.endDate).toLocaleDateString()}
                </p>
                {standingsData.season.currentMatchday && (
                  <span className="text-sm text-gray-600 bg-blue-100 px-2 py-1 rounded">
                    Matchday {standingsData.season.currentMatchday}
                  </span>
                )}
                <span className="text-sm text-gray-600 bg-green-100 px-2 py-1 rounded">
                  {allMatches.length} Matches Analyzed
                </span>
              </div>
            )}
          </div>
          <StandingsTable standings={standings} recentMatches={recentMatches} />
        </div>

        {/* Statistics Tables - Under/Over and Goals Distribution */}
        {/* PASS allMatches INSTEAD OF recentMatches */}
        <div className="mb-6">
          <StatsTables standings={standings} recentMatches={allMatches} />
        </div>

        {/* Power Pots Table */}
        <div className="mb-6">
          <PowerPotsTable standings={standings} leagueName={league.name} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading league data:', error);
    return (
      <div className="min-h-full p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-red-800 mb-1">Error Loading League Data</h1>
              <p className="text-red-600 text-sm">{error.message}</p>
              <p className="text-red-500 text-xs mt-1">
                Please check your internet connection and try again. If the problem persists, the API service might be temporarily unavailable.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
}