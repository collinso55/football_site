// components/StandingsTable.js
'use client';

import TeamLogo from './TeamLogo';

export default function StandingsTable({ standings, recentMatches }) {
  if (!standings || standings.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-500">
          <p className="text-sm">No standings data available for this league.</p>
          <p className="text-xs mt-1">The season may not have started yet.</p>
        </div>
      </div>
    );
  }

  // Function to create home/away tables from the main standings
  const createHomeAwayTables = (standings) => {
    return standings.map(team => ({
      position: team.position,
      team: team.team,
      // For demo purposes - in real data, these would come from the API
      home: {
        played: Math.floor(team.playedGames / 2),
        won: Math.floor(team.won / 2),
        draw: Math.floor(team.draw / 2),
        lost: Math.floor(team.lost / 2),
        points: Math.floor(team.points / 2)
      },
      away: {
        played: Math.floor(team.playedGames / 2),
        won: Math.floor(team.won / 2),
        draw: Math.floor(team.draw / 2),
        lost: Math.floor(team.lost / 2),
        points: Math.floor(team.points / 2)
      }
    }));
  };

  const homeAwayTables = createHomeAwayTables(standings);

  const TableRow = ({ team, stats, position, isHome = true }) => (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="p-2 font-bold text-gray-900 text-xs">{position}</td>
      <td className="p-2">
        <div className="flex items-center space-x-2">
          <TeamLogo
            src={team.crest}
            alt={team.name}
            className="w-6 h-6 object-contain"
          />
          <span className="font-medium text-gray-900 text-xs">
            {team.shortName || team.name}
          </span>
        </div>
      </td>
      <td className="p-2 text-center text-gray-600 text-xs">{stats.played}</td>
      <td className="p-2 text-center text-green-600 font-medium text-xs">{stats.won}</td>
      <td className="p-2 text-center text-yellow-600 font-medium text-xs">{stats.draw}</td>
      <td className="p-2 text-center text-red-600 font-medium text-xs">{stats.lost}</td>
      <td className="p-2 text-center font-bold text-gray-900 text-xs">{stats.points}</td>
    </tr>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Safe score display function
  const displayScore = (match) => {
    if (!match.score || !match.score.fullTime) {
      return 'TBD';
    }
    const home = match.score.fullTime.home ?? '-';
    const away = match.score.fullTime.away ?? '-';
    return `${home} - ${away}`;
  };

  // Get matchday from the first match (all should be from same matchday)
  const matchday = recentMatches?.[0]?.matchday || 'Last';

  return (
    <div className="space-y-8">
      {/* General Standings Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 px-4">General Standings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-2 text-left font-semibold text-gray-700 text-xs">#</th>
                <th className="p-2 text-left font-semibold text-gray-700 text-xs">Team</th>
                <th className="p-2 text-center font-semibold text-gray-700 text-xs">MP</th>
                <th className="p-2 text-center font-semibold text-gray-700 text-xs">W</th>
                <th className="p-2 text-center font-semibold text-gray-700 text-xs">D</th>
                <th className="p-2 text-center font-semibold text-gray-700 text-xs">L</th>
                <th className="p-2 text-center font-semibold text-gray-700 text-xs">GD</th>
                <th className="p-2 text-center font-semibold text-gray-700 text-xs">PTS</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, index) => (
                <tr key={team.team?.id || index} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-2 font-bold text-gray-900 text-xs">{team.position}</td>
                  <td className="p-2">
                    <div className="flex items-center space-x-2">
                      <TeamLogo
                        src={team.team?.crest}
                        alt={team.team?.name}
                        className="w-6 h-6 object-contain"
                      />
                      <span className="font-medium text-gray-900 text-xs">
                        {team.team?.shortName || team.team?.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 text-center text-gray-600 text-xs">{team.playedGames || 0}</td>
                  <td className="p-2 text-center text-green-600 font-medium text-xs">
                    {team.won || 0}
                  </td>
                  <td className="p-2 text-center text-yellow-600 font-medium text-xs">
                    {team.draw || 0}
                  </td>
                  <td className="p-2 text-center text-red-600 font-medium text-xs">
                    {team.lost || 0}
                  </td>
                  <td className="p-2 text-center font-bold text-gray-900 text-xs">
                    {team.goalDifference > 0 ? '+' : ''}{team.goalDifference || 0}
                  </td>
                  <td className="p-2 text-center font-bold text-blue-600 text-xs">
                    {team.points || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Home and Away Tables - Side by Side */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 px-4">Home & Away Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Home Table - Left Side */}
          <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
            <div className="bg-blue-50 px-4 py-3 border-b">
              <h4 className="font-semibold text-gray-800 text-sm">Home Performance</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-2 text-left font-semibold text-gray-700 text-xs">#</th>
                    <th className="p-2 text-left font-semibold text-gray-700 text-xs">Team</th>
                    <th className="p-2 text-center font-semibold text-gray-700 text-xs">MP</th>
                    <th className="p-2 text-center font-semibold text-gray-700 text-xs">W</th>
                    <th className="p-2 text-center font-semibold text-gray-700 text-xs">D</th>
                    <th className="p-2 text-center font-semibold text-gray-700 text-xs">L</th>
                    <th className="p-2 text-center font-semibold text-gray-700 text-xs">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {homeAwayTables.map((team, index) => (
                    <TableRow
                      key={`home-${team.team.id}`}
                      team={team.team}
                      stats={team.home}
                      position={team.position}
                      isHome={true}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Away Table - Right Side */}
          <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
            <div className="bg-green-50 px-4 py-3 border-b">
              <h4 className="font-semibold text-gray-800 text-sm">Away Performance</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-2 text-left font-semibold text-gray-700 text-xs">#</th>
                    <th className="p-2 text-left font-semibold text-gray-700 text-xs">Team</th>
                    <th className="p-2 text-center font-semibold text-gray-700 text-xs">MP</th>
                    <th className="p-2 text-center font-semibold text-gray-700 text-xs">W</th>
                    <th className="p-2 text-center font-semibold text-gray-700 text-xs">D</th>
                    <th className="p-2 text-center font-semibold text-gray-700 text-xs">L</th>
                    <th className="p-2 text-center font-semibold text-gray-700 text-xs">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {homeAwayTables.map((team, index) => (
                    <tr key={`away-${team.team.id}`} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-2 font-bold text-gray-900 text-xs">{team.position}</td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <TeamLogo
                            src={team.team.crest}
                            alt={team.team.name}
                            className="w-6 h-6 object-contain"
                          />
                          <span className="font-medium text-gray-900 text-xs">
                            {team.team.shortName || team.team.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 text-center text-gray-600 text-xs">{team.away.played}</td>
                      <td className="p-2 text-center text-green-600 font-medium text-xs">{team.away.won}</td>
                      <td className="p-2 text-center text-yellow-600 font-medium text-xs">{team.away.draw}</td>
                      <td className="p-2 text-center text-red-600 font-medium text-xs">{team.away.lost}</td>
                      <td className="p-2 text-center font-bold text-gray-900 text-xs">{team.away.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Spacing after Home/Away tables */}
      <div className="mt-8"></div>

      {/* Recent Results Table - Shows all matches from last completed matchday */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 px-4">
          Recent Results - Matchday {matchday}
        </h3>
        <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
          <div className="bg-purple-50 px-4 py-3 border-b">
            <h4 className="font-semibold text-gray-800 text-sm">
              Latest Matchday Results ({recentMatches?.length || 0} matches)
            </h4>
          </div>
          <div className="overflow-x-auto">
            {(!recentMatches || recentMatches.length === 0) ? (
              <div className="p-6 text-center">
                <p className="text-gray-500 text-sm">No recent match results available.</p>
                <p className="text-gray-400 text-xs mt-1">Matches may not have been played recently.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-2 text-left font-semibold text-gray-700 text-xs">Date</th>
                    <th className="p-2 text-left font-semibold text-gray-700 text-xs">Home Team</th>
                    <th className="p-2 text-center font-semibold text-gray-700 text-xs">Score</th>
                    <th className="p-2 text-left font-semibold text-gray-700 text-xs">Away Team</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMatches.map((match) => (
                    <tr key={match.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-2 text-gray-600 text-xs">
                        {formatDate(match.utcDate)}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <TeamLogo
                            src={match.homeTeam.crest}
                            alt={match.homeTeam.name}
                            className="w-6 h-6 object-contain"
                          />
                          <span className="font-medium text-gray-900 text-xs">
                            {match.homeTeam.shortName || match.homeTeam.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <span className="font-bold text-gray-900 text-xs bg-gray-100 px-2 py-1 rounded">
                            {displayScore(match)}
                          </span>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <TeamLogo
                            src={match.awayTeam.crest}
                            alt={match.awayTeam.name}
                            className="w-6 h-6 object-contain"
                          />
                          <span className="font-medium text-gray-900 text-xs">
                            {match.awayTeam.shortName || match.awayTeam.name}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}