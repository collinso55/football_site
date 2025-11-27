// components/FixturesList.jsx
'use client';

import TeamLogo from './TeamLogo';

export default function FixturesList({ fixtures, title = "Upcoming Fixtures" }) {
  if (!fixtures || fixtures.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
        <p className="text-gray-500 text-center py-3 text-sm">No upcoming fixtures available</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
      <div className="space-y-3">
        {fixtures.map((match) => (
          <div key={match.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border">
            {/* Home Team */}
            <div className="flex items-center space-x-2 flex-1 justify-end">
              <span className="font-medium text-gray-900 text-right text-sm">
                {match.homeTeam.shortName || match.homeTeam.name}
              </span>
              <TeamLogo
                src={match.homeTeam.crest}
                alt={match.homeTeam.name}
                className="w-6 h-6 object-contain"
              />
            </div>

            {/* Match Info */}
            <div className="flex flex-col items-center mx-3 min-w-[100px]">
              <div className="text-xs text-gray-500 mb-1">
                {formatDate(match.utcDate)}
              </div>
              <div className="flex items-center space-x-1">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                  VS
                </span>
              </div>
              {match.matchday && (
                <div className="text-xs text-gray-400 mt-1">
                  MD {match.matchday}
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center space-x-2 flex-1">
              <TeamLogo
                src={match.awayTeam.crest}
                alt={match.awayTeam.name}
                className="w-6 h-6 object-contain"
              />
              <span className="font-medium text-gray-900 text-sm">
                {match.awayTeam.shortName || match.awayTeam.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}