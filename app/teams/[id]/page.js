// app/teams/[id]/page.js
import { getTeamDetails, getTeamMatches } from '../../../lib/api';
import TeamLogo from '../../../components/TeamLogo';
import CountryFlag from '../../../components/CountryFlag';

export default async function TeamPage({ params }) {
  const { id } = await params;
  
  try {
    const [teamData, teamMatches] = await Promise.all([
      getTeamDetails(id),
      getTeamMatches(id, 50) // Get more matches to ensure we have enough
    ]);

    const team = teamData;

    if (!team) {
      return (
        <div className="min-h-screen p-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h1 className="text-xl font-bold text-yellow-800 mb-2">Team Not Found</h1>
            <p className="text-yellow-600 text-sm">The requested team could not be found.</p>
          </div>
        </div>
      );
    }

    // Filter to ONLY finished matches from CURRENT SEASON
    const currentYear = new Date().getFullYear();
    const finishedMatches = teamMatches.filter(match => 
      match.status === 'FINISHED' && 
      new Date(match.utcDate).getFullYear() >= currentYear - 1 // Current and previous year
    );

    // Calculate team statistics from FINISHED matches only
    const stats = calculateTeamStats(finishedMatches, team.id);
    const homeStats = calculateHomeAwayStats(finishedMatches, team.id, 'home');
    const awayStats = calculateHomeAwayStats(finishedMatches, team.id, 'away');

    return (
      <div className="min-h-screen p-4 bg-gray-50">
        {/* Team Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center space-x-4">
            <TeamLogo
              src={team.crest}
              alt={team.name}
              className="w-16 h-16 object-contain"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
              <p className="text-gray-600">{team.shortName || team.name}</p>
              {team.website && (
                <a 
                  href={team.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {team.website}
                </a>
              )}
            </div>
            {team.area?.flag && (
              <CountryFlag
                src={team.area.flag}
                alt={team.area.name}
                className="w-8 h-6 object-cover rounded"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* All Matches Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">ALL MATCHES</h2>
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalMatches} ({stats.wins} - {stats.draws} - {stats.losses})
              </div>
              <div className="text-lg font-semibold text-gray-700">
                {stats.goalsFor} : {stats.goalsAgainst} - {stats.points} pts.
              </div>
            </div>
            
            <div className="space-y-4">
              <StatRow label="Wins" value={stats.wins} total={stats.totalMatches} />
              <StatRow label="Draws" value={stats.draws} total={stats.totalMatches} />
              <StatRow label="Losses" value={stats.losses} total={stats.totalMatches} />
              
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">GOALS</h3>
                <StatRow label="Goals scored" value={stats.goalsFor} total={stats.totalMatches} showAvg />
                <StatRow label="Goals received" value={stats.goalsAgainst} total={stats.totalMatches} showAvg />
                <StatRow label="GOALS TOTAL" value={stats.totalGoals} total={stats.totalMatches} showAvg />
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">GOALS DISTRIBUTION</h3>
                <StatRow label="UNDER 2.5" value={stats.under25} total={stats.totalMatches} />
                <StatRow label="OVER 2.5" value={stats.over25} total={stats.totalMatches} />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">MATCHES - GOALS SCORED</h3>
                <StatRow label="YES" value={stats.scoredYes} total={stats.totalMatches} />
                <StatRow label="NO" value={stats.scoredNo} total={stats.totalMatches} />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">MATCHES - GOALS RECEIVED</h3>
                <StatRow label="YES" value={stats.receivedYes} total={stats.totalMatches} />
                <StatRow label="NO" value={stats.receivedNo} total={stats.totalMatches} />
              </div>
            </div>
          </div>

          {/* Home Matches Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">HOME MATCHES</h2>
            <HomeAwayStats stats={homeStats} />
          </div>

          {/* Away Matches Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">AWAY MATCHES</h2>
            <HomeAwayStats stats={awayStats} />
          </div>
        </div>

        {/* Match Results Table - ONLY CURRENT SEASON FINISHED MATCHES */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {team.shortName || team.name} MATCH RESULTS - CURRENT SEASON
          </h2>
          {finishedMatches.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No matches played yet this season.</p>
            </div>
          ) : (
            <TeamMatchesTable matches={finishedMatches} team={team} />
          )}
        </div>

        {/* Team Description */}
        {team.description && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">ABOUT THE CLUB</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{team.description}</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading team data:', error);
    return (
      <div className="min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h1 className="text-xl font-bold text-red-800 mb-2">Error Loading Team Data</h1>
          <p className="text-red-600 text-sm">{error.message}</p>
          <p className="text-red-500 text-xs mt-1">Please check your API key and try again.</p>
        </div>
      </div>
    );
  }
}

// Helper component for statistic rows
function StatRow({ label, value, total, showAvg = false }) {
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-600">{label}</span>
      <div className="text-right">
        <span className="font-semibold text-gray-900">
          {value}{total > 0 && ` / ${total}`}
        </span>
        {!showAvg && total > 0 && (
          <span className="text-gray-500 ml-2">{percentage}%</span>
        )}
        {showAvg && (
          <span className="text-gray-500 ml-2">
            {total > 0 ? (value / total).toFixed(2) : '0'}
          </span>
        )}
      </div>
    </div>
  );
}

// Helper component for home/away stats
function HomeAwayStats({ stats }) {
  return (
    <div>
      <div className="text-center mb-4">
        <div className="text-xl font-bold text-gray-900">
          {stats.totalMatches} ({stats.wins} - {stats.draws} - {stats.losses})
        </div>
        <div className="text-lg font-semibold text-gray-700">
          {stats.goalsFor} : {stats.goalsAgainst} - {stats.points} pts.
        </div>
      </div>
      
      <div className="space-y-3">
        <StatRow label="Wins" value={stats.wins} total={stats.totalMatches} />
        <StatRow label="Draws" value={stats.draws} total={stats.totalMatches} />
        <StatRow label="Losses" value={stats.losses} total={stats.totalMatches} />
        
        <div className="border-t pt-3">
          <h3 className="font-semibold text-gray-700 mb-2 text-sm">GOALS</h3>
          <StatRow label="Goals scored" value={stats.goalsFor} total={stats.totalMatches} showAvg />
          <StatRow label="Goals received" value={stats.goalsAgainst} total={stats.totalMatches} showAvg />
          <StatRow label="GOALS TOTAL" value={stats.totalGoals} total={stats.totalMatches} showAvg />
        </div>
        
        <div className="border-t pt-3">
          <h3 className="font-semibold text-gray-700 mb-2 text-sm">GOALS DISTRIBUTION</h3>
          <StatRow label="UNDER 2.5" value={stats.under25} total={stats.totalMatches} />
          <StatRow label="OVER 2.5" value={stats.over25} total={stats.totalMatches} />
        </div>

        <div className="border-t pt-3">
          <h3 className="font-semibold text-gray-700 mb-2 text-sm">GOALS SCORED</h3>
          <StatRow label="YES" value={stats.scoredYes} total={stats.totalMatches} />
          <StatRow label="NO" value={stats.scoredNo} total={stats.totalMatches} />
        </div>

        <div className="border-t pt-3">
          <h3 className="font-semibold text-gray-700 mb-2 text-sm">GOALS RECEIVED</h3>
          <StatRow label="YES" value={stats.receivedYes} total={stats.totalMatches} />
          <StatRow label="NO" value={stats.receivedNo} total={stats.totalMatches} />
        </div>
      </div>
    </div>
  );
}

// Team Matches Table Component - PROPER FORMAT
function TeamMatchesTable({ matches, team }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  const getMatchResult = (match, teamId) => {
    const homeGoals = match.score?.fullTime?.home ?? 0;
    const awayGoals = match.score?.fullTime?.away ?? 0;
    
    const isHome = match.homeTeam.id === teamId;
    const teamGoals = isHome ? homeGoals : awayGoals;
    const opponentGoals = isHome ? awayGoals : homeGoals;
    
    if (teamGoals > opponentGoals) return 'win';
    if (teamGoals < opponentGoals) return 'loss';
    return 'draw';
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'win': return 'bg-green-500';
      case 'loss': return 'bg-red-500';
      case 'draw': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  // Sort matches by date (most recent first)
  const sortedMatches = [...matches].sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="p-3 text-left font-semibold text-gray-700 text-xs">Date</th>
            <th className="p-3 text-left font-semibold text-gray-700 text-xs">Home Team</th>
            <th className="p-3 text-center font-semibold text-gray-700 text-xs">Score</th>
            <th className="p-3 text-left font-semibold text-gray-700 text-xs">Away Team</th>
            <th className="p-3 text-center font-semibold text-gray-700 text-xs">Result</th>
          </tr>
        </thead>
        <tbody>
          {sortedMatches.map((match) => {
            const result = getMatchResult(match, team.id);
            const resultColor = getResultColor(result);
            const isHome = match.homeTeam.id === team.id;
            
            return (
              <tr key={match.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-3 text-gray-600 text-xs">
                  {formatDate(match.utcDate)}
                </td>
                
                {/* Home Team */}
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <TeamLogo
                      src={match.homeTeam.crest}
                      alt={match.homeTeam.name}
                      className="w-6 h-6 object-contain"
                    />
                    <span className={`font-medium text-sm ${isHome ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
                      {match.homeTeam.shortName || match.homeTeam.name}
                    </span>
                  </div>
                </td>
                
                {/* Score */}
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="font-bold text-gray-900 text-sm">
                      {match.score?.fullTime?.home ?? '0'}
                    </span>
                    <span className="text-gray-500">-</span>
                    <span className="font-bold text-gray-900 text-sm">
                      {match.score?.fullTime?.away ?? '0'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {match.competition?.name || 'League'}
                  </div>
                </td>
                
                {/* Away Team */}
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <TeamLogo
                      src={match.awayTeam.crest}
                      alt={match.awayTeam.name}
                      className="w-6 h-6 object-contain"
                    />
                    <span className={`font-medium text-sm ${!isHome ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
                      {match.awayTeam.shortName || match.awayTeam.name}
                    </span>
                  </div>
                </td>
                
                {/* Result */}
                <td className="p-3 text-center">
                  <div 
                    className={`w-8 h-8 ${resultColor} rounded-full mx-auto flex items-center justify-center`}
                    title={result.toUpperCase()}
                  >
                    <span className="text-white text-xs font-bold">
                      {result === 'win' ? 'W' : result === 'loss' ? 'L' : 'D'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 capitalize">
                    {result}
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

// Statistics calculation functions
function calculateTeamStats(matches, teamId) {
  const stats = {
    totalMatches: matches.length,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    totalGoals: 0,
    under25: 0,
    over25: 0,
    scoredYes: 0,
    scoredNo: 0,
    receivedYes: 0,
    receivedNo: 0
  };

  matches.forEach(match => {
    const homeGoals = match.score?.fullTime?.home || 0;
    const awayGoals = match.score?.fullTime?.away || 0;
    const totalGoals = homeGoals + awayGoals;

    const isHome = match.homeTeam.id === teamId;
    const teamGoals = isHome ? homeGoals : awayGoals;
    const opponentGoals = isHome ? awayGoals : homeGoals;

    stats.goalsFor += teamGoals;
    stats.goalsAgainst += opponentGoals;
    stats.totalGoals += totalGoals;

    if (teamGoals > opponentGoals) {
      stats.wins++;
      stats.points += 3;
    } else if (teamGoals === opponentGoals) {
      stats.draws++;
      stats.points += 1;
    } else {
      stats.losses++;
    }

    if (totalGoals < 2.5) stats.under25++;
    if (totalGoals > 2.5) stats.over25++;

    if (teamGoals > 0) stats.scoredYes++;
    else stats.scoredNo++;

    if (opponentGoals > 0) stats.receivedYes++;
    else stats.receivedNo++;
  });

  return stats;
}

function calculateHomeAwayStats(matches, teamId, type) {
  const filteredMatches = matches.filter(match => 
    (type === 'home' && match.homeTeam.id === teamId) ||
    (type === 'away' && match.awayTeam.id === teamId)
  );
  
  return calculateTeamStats(filteredMatches, teamId);
}