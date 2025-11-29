// components/StatsTables.js
'use client';

import TeamLogo from './TeamLogo';

export default function StatsTables({ standings, recentMatches }) {
  // Add this at the top of your StatsTables component, after the imports
  if (!recentMatches || recentMatches.length === 0) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Statistics Tables</h3>
          <p className="text-gray-500 text-sm">
            Match data is currently unavailable. Statistics will be displayed when match data is loaded.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            This could be due to API limitations or no matches being played yet.
          </p>
        </div>
      </div>
    );
  }

  if (!standings || standings.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500 text-sm">No statistics data available.</p>
      </div>
    );
  }

  // Calculate Under/Over statistics for each team
  const calculateUnderOverStats = (teamId, matches) => {
    const teamMatches = matches.filter(match => 
      (match.homeTeam.id === teamId || match.awayTeam.id === teamId) && 
      match.status === 'FINISHED'
    );

    const homeMatches = teamMatches.filter(match => match.homeTeam.id === teamId);
    const awayMatches = teamMatches.filter(match => match.awayTeam.id === teamId);

    const calculateStats = (matchList) => {
      const total = matchList.length;
      if (total === 0) return { under25: 0, over25: 0, under25Pct: 0, over25Pct: 0 };

      const under25 = matchList.filter(match => {
        const totalGoals = (match.score?.fullTime?.home || 0) + (match.score?.fullTime?.away || 0);
        return totalGoals < 2.5;
      }).length;

      const over25 = total - under25;

      return {
        under25,
        over25,
        under25Pct: total > 0 ? Math.round((under25 / total) * 100) : 0,
        over25Pct: total > 0 ? Math.round((over25 / total) * 100) : 0
      };
    };

    const totalStats = calculateStats(teamMatches);
    const homeStats = calculateStats(homeMatches);
    const awayStats = calculateStats(awayMatches);

    return { total: totalStats, home: homeStats, away: awayStats };
  };

  // Calculate Goals Per Match distribution
  const calculateGoalsDistribution = (teamId, matches) => {
    const teamMatches = matches.filter(match => 
      (match.homeTeam.id === teamId || match.awayTeam.id === teamId) && 
      match.status === 'FINISHED'
    );

    const homeMatches = teamMatches.filter(match => match.homeTeam.id === teamId);
    const awayMatches = teamMatches.filter(match => match.awayTeam.id === teamId);

    const calculateDistribution = (matchList) => {
      const distribution = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, over6: 0 };
      let totalGoals = 0;

      matchList.forEach(match => {
        const goals = (match.score?.fullTime?.home || 0) + (match.score?.fullTime?.away || 0);
        totalGoals += goals;

        if (goals <= 6) {
          distribution[goals]++;
        } else {
          distribution.over6++;
        }
      });

      const avg = matchList.length > 0 ? (totalGoals / matchList.length).toFixed(2) : '0.00';

      return { distribution, avg, total: matchList.length };
    };

    const totalDist = calculateDistribution(teamMatches);
    const homeDist = calculateDistribution(homeMatches);
    const awayDist = calculateDistribution(awayMatches);

    return { total: totalDist, home: homeDist, away: awayDist };
  };

  // Generate mock data for demonstration (replace with real calculations)
  const teamsWithStats = standings.map((team, index) => {
    const underOverStats = calculateUnderOverStats(team.team.id, recentMatches || []);
    const goalsDist = calculateGoalsDistribution(team.team.id, recentMatches || []);

    return {
      position: index + 1,
      team: team.team,
      underOver: underOverStats,
      goalsDistribution: goalsDist
    };
  });

  return (
    <div className="space-y-8">
      {/* UNDER/OVER TABLE */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="bg-blue-50 px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">UNDER/OVER TABLE</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th rowSpan="2" className="p-3 text-left font-semibold text-gray-700 border-r">#</th>
                <th rowSpan="2" className="p-3 text-left font-semibold text-gray-700 border-r">Team</th>
                <th colSpan="4" className="p-2 text-center font-semibold text-gray-700 border-b border-r">TOTAL</th>
                <th colSpan="4" className="p-2 text-center font-semibold text-gray-700 border-b border-r">HOME</th>
                <th colSpan="4" className="p-2 text-center font-semibold text-gray-700 border-b">AWAY</th>
              </tr>
              <tr className="bg-gray-50 border-b">
                {/* TOTAL Headers */}
                <th className="p-2 text-center font-semibold text-gray-700 border-r">UNDER 2.5</th>
                <th className="p-2 text-center font-semibold text-gray-700 border-r">OVER 2.5</th>
                <th className="p-2 text-center font-semibold text-gray-700 border-r">UNDER 2.5</th>
                <th className="p-2 text-center font-semibold text-gray-700 border-r">OVER 2.5</th>
                
                {/* HOME Headers */}
                <th className="p-2 text-center font-semibold text-gray-700 border-r">UNDER 2.5</th>
                <th className="p-2 text-center font-semibold text-gray-700 border-r">OVER 2.5</th>
                <th className="p-2 text-center font-semibold text-gray-700 border-r">UNDER 2.5</th>
                <th className="p-2 text-center font-semibold text-gray-700 border-r">OVER 2.5</th>
                
                {/* AWAY Headers */}
                <th className="p-2 text-center font-semibold text-gray-700 border-r">UNDER 2.5</th>
                <th className="p-2 text-center font-semibold text-gray-700 border-r">OVER 2.5</th>
                <th className="p-2 text-center font-semibold text-gray-700 border-r">UNDER 2.5</th>
                <th className="p-2 text-center font-semibold text-gray-700">OVER 2.5</th>
              </tr>
            </thead>
            <tbody>
              {teamsWithStats.map((team) => (
                <tr key={team.team.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-bold text-gray-900 border-r">{team.position}</td>
                  <td className="p-3 border-r">
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
                  
                  {/* TOTAL Stats */}
                  <td className="p-2 text-center text-gray-600 border-r">
                    {team.underOver.total.under25} / {team.underOver.total.under25 + team.underOver.total.over25}
                  </td>
                  <td className="p-2 text-center text-gray-600 border-r">
                    {team.underOver.total.over25} / {team.underOver.total.under25 + team.underOver.total.over25}
                  </td>
                  <td className="p-2 text-center font-semibold text-blue-600 border-r">
                    {team.underOver.total.under25Pct}%
                  </td>
                  <td className="p-2 text-center font-semibold text-red-600 border-r">
                    {team.underOver.total.over25Pct}%
                  </td>
                  
                  {/* HOME Stats */}
                  <td className="p-2 text-center text-gray-600 border-r">
                    {team.underOver.home.under25} / {team.underOver.home.under25 + team.underOver.home.over25}
                  </td>
                  <td className="p-2 text-center text-gray-600 border-r">
                    {team.underOver.home.over25} / {team.underOver.home.under25 + team.underOver.home.over25}
                  </td>
                  <td className="p-2 text-center font-semibold text-blue-600 border-r">
                    {team.underOver.home.under25Pct}%
                  </td>
                  <td className="p-2 text-center font-semibold text-red-600 border-r">
                    {team.underOver.home.over25Pct}%
                  </td>
                  
                  {/* AWAY Stats */}
                  <td className="p-2 text-center text-gray-600 border-r">
                    {team.underOver.away.under25} / {team.underOver.away.under25 + team.underOver.away.over25}
                  </td>
                  <td className="p-2 text-center text-gray-600 border-r">
                    {team.underOver.away.over25} / {team.underOver.away.under25 + team.underOver.away.over25}
                  </td>
                  <td className="p-2 text-center font-semibold text-blue-600 border-r">
                    {team.underOver.away.under25Pct}%
                  </td>
                  <td className="p-2 text-center font-semibold text-red-600">
                    {team.underOver.away.over25Pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GOALS PER MATCH TABLE */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="bg-green-50 px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">GOALS PER MATCH</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th rowSpan="2" className="p-3 text-left font-semibold text-gray-700 border-r">#</th>
                <th rowSpan="2" className="p-3 text-left font-semibold text-gray-700 border-r">Team</th>
                
                {/* OVERALL Headers */}
                <th colSpan="10" className="p-1 text-center font-semibold text-gray-700 border-b border-r">OVERALL</th>
                
                {/* HOME Headers */}
                <th colSpan="10" className="p-1 text-center font-semibold text-gray-700 border-b border-r">HOME</th>
                
                {/* AWAY Headers */}
                <th colSpan="10" className="p-1 text-center font-semibold text-gray-700 border-b">AWAY</th>
              </tr>
              <tr className="bg-gray-50 border-b">
                {/* OVERALL Sub-headers */}
                <th className="p-1 text-center font-semibold text-gray-700 border-r">P</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">0</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">1</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">2</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">3</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">4</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">5</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">6</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">6+</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">AVG</th>
                
                {/* HOME Sub-headers */}
                <th className="p-1 text-center font-semibold text-gray-700 border-r">P</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">0</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">1</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">2</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">3</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">4</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">5</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">6</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">6+</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">AVG</th>
                
                {/* AWAY Sub-headers */}
                <th className="p-1 text-center font-semibold text-gray-700 border-r">P</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">0</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">1</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">2</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">3</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">4</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">5</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">6</th>
                <th className="p-1 text-center font-semibold text-gray-700 border-r">6+</th>
                <th className="p-1 text-center font-semibold text-gray-700">AVG</th>
              </tr>
            </thead>
            <tbody>
              {teamsWithStats.map((team) => (
                <tr key={team.team.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-bold text-gray-900 border-r">{team.position}</td>
                  <td className="p-3 border-r">
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
                  
                  {/* OVERALL Goals Distribution */}
                  <td className="p-1 text-center text-gray-600 border-r">
                    {team.goalsDistribution.total.total}
                  </td>
                  {[0, 1, 2, 3, 4, 5, 6].map(goals => (
                    <td key={goals} className="p-1 text-center text-gray-600 border-r">
                      {team.goalsDistribution.total.distribution[goals]}
                    </td>
                  ))}
                  <td className="p-1 text-center text-gray-600 border-r">
                    {team.goalsDistribution.total.distribution.over6}
                  </td>
                  <td className="p-1 text-center font-bold text-blue-600 border-r">
                    {team.goalsDistribution.total.avg}
                  </td>
                  
                  {/* HOME Goals Distribution */}
                  <td className="p-1 text-center text-gray-600 border-r">
                    {team.goalsDistribution.home.total}
                  </td>
                  {[0, 1, 2, 3, 4, 5, 6].map(goals => (
                    <td key={goals} className="p-1 text-center text-gray-600 border-r">
                      {team.goalsDistribution.home.distribution[goals]}
                    </td>
                  ))}
                  <td className="p-1 text-center text-gray-600 border-r">
                    {team.goalsDistribution.home.distribution.over6}
                  </td>
                  <td className="p-1 text-center font-bold text-blue-600 border-r">
                    {team.goalsDistribution.home.avg}
                  </td>
                  
                  {/* AWAY Goals Distribution */}
                  <td className="p-1 text-center text-gray-600 border-r">
                    {team.goalsDistribution.away.total}
                  </td>
                  {[0, 1, 2, 3, 4, 5, 6].map(goals => (
                    <td key={goals} className="p-1 text-center text-gray-600 border-r">
                      {team.goalsDistribution.away.distribution[goals]}
                    </td>
                  ))}
                  <td className="p-1 text-center text-gray-600 border-r">
                    {team.goalsDistribution.away.distribution.over6}
                  </td>
                  <td className="p-1 text-center font-bold text-blue-600">
                    {team.goalsDistribution.away.avg}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}