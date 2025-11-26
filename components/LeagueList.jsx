// components/LeagueList.js
import Link from 'next/link';
import LeagueLogo from './LeagueLogo';

export default function LeagueList({ leagues, title, showCountry = false }) {
  if (!leagues || leagues.length === 0) {
    return (
      <div className="p-4">
        <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm">No leagues available</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="space-y-2">
        {leagues.map((league) => (
          <Link
            key={league.id}
            href={`/leagues/${league.id}`}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <LeagueLogo
              src={league.emblem || league.area?.flag}
              alt={league.name}
              className="w-6 h-6 object-contain"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">
                {league.name}
              </p>
              {showCountry && league.area && (
                <p className="text-xs text-gray-500 truncate">
                  {league.area.name}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}