// app/leagues/[id]/page.js
import { getLeagueById, getStandings } from '../../../lib/api';
import StandingsTable from '../../../components/StandingsTable';
import LeagueLogo from '../../../components/LeagueLogo';
import CountryFlag from '../../../components/CountryFlag';

export default async function LeaguePage({ params }) {
  // Await the params promise
  const { id } = await params;
  
  try {
    // Fetch league details and standings
    const [leagueData, standingsData] = await Promise.all([
      getLeagueById(id),
      getStandings(id)
    ]);

    const league = leagueData;
    const standings = standingsData.standings?.[0]?.table || [];

    if (!league) {
      return (
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h1 className="text-2xl font-bold text-yellow-800 mb-2">League Not Found</h1>
            <p className="text-yellow-600">The requested league could not be found.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        {/* League Header - Simple */}
        <div className="mb-6 flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border">
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
                  className="w-5 h-4 object-cover"
                />
              )}
              <p className="text-gray-600 text-sm">
                {league.area?.name || 'International'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Standings Table Only */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">League Standings</h2>
            {standingsData.season && (
              <p className="text-sm text-gray-600 mt-1">
                Season {standingsData.season.startDate} - {standingsData.season.endDate}
                {standingsData.season.currentMatchday && (
                  <span className="ml-2">• Matchday {standingsData.season.currentMatchday}</span>
                )}
              </p>
            )}
          </div>
          <StandingsTable standings={standings} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading league data:', error);
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h1 className="text-2xl font-bold text-red-800 mb-2">Error</h1>
          <p className="text-red-600">Failed to load league data. Please try again later.</p>
        </div>
      </div>
    );
  }
}