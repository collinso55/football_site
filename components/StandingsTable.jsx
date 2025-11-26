// components/StandingsTable.js
'use client';

import TeamLogo from './TeamLogo';

export default function StandingsTable({ standings }) {
  if (!standings || standings.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">
          <p>No standings data available for this league.</p>
          <p className="text-sm mt-2">The season may not have started yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="p-4 text-left font-semibold text-gray-700">#</th>
            <th className="p-4 text-left font-semibold text-gray-700">Team</th>
            <th className="p-4 text-center font-semibold text-gray-700">MP</th>
            <th className="p-4 text-center font-semibold text-gray-700">W</th>
            <th className="p-4 text-center font-semibold text-gray-700">D</th>
            <th className="p-4 text-center font-semibold text-gray-700">L</th>
            <th className="p-4 text-center font-semibold text-gray-700">GD</th>
            <th className="p-4 text-center font-semibold text-gray-700">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr 
              key={team.team?.id || index} 
              className="border-b hover:bg-gray-50 transition-colors"
            >
              {/* Position - Changed to black for better visibility */}
              <td className="p-4 font-bold text-gray-900">{team.position}</td>
              
              {/* Team */}
              <td className="p-4">
                <div className="flex items-center space-x-3">
                  <TeamLogo
                    src={team.team?.crest}
                    alt={team.team?.name}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="font-medium text-gray-900">
                    {team.team?.shortName || team.team?.name}
                  </span>
                </div>
              </td>
              
              {/* Matches Played */}
              <td className="p-4 text-center text-gray-600">{team.playedGames || 0}</td>
              
              {/* Wins */}
              <td className="p-4 text-center text-green-600 font-medium">
                {team.won || 0}
              </td>
              
              {/* Draws */}
              <td className="p-4 text-center text-yellow-600 font-medium">
                {team.draw || 0}
              </td>
              
              {/* Losses */}
              <td className="p-4 text-center text-red-600 font-medium">
                {team.lost || 0}
              </td>
              
              {/* Goal Difference - Changed to black for better visibility */}
              <td className="p-4 text-center font-bold text-gray-900">
                {team.goalDifference > 0 ? '+' : ''}{team.goalDifference || 0}
              </td>
              
              {/* Points */}
              <td className="p-4 text-center font-bold text-blue-600">
                {team.points || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}