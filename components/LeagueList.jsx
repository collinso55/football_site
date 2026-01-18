// components/LeagueList.js
import Link from 'next/link';
import LeagueLogo from './LeagueLogo';

export default function LeagueList({ leagues, title, showCountry = false }) {
  if (!leagues || leagues.length === 0) {
    return (
      <div className="px-6 py-4">
        <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-4">{title}</h3>
        <p className="text-muted text-[10px] italic">No leagues available</p>
      </div>
    );
  }

  return (
    <div className="px-3 py-4">
      <h3 className="px-3 text-[10px] font-bold text-muted uppercase tracking-widest mb-4">{title}</h3>
      <div className="space-y-1">
        {leagues.map((league) => (
          <Link
            key={league.id}
            href={`/leagues/${league.id}`}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all duration-200 group border border-transparent hover:border-white/5"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-lg shadow-sm border border-border group-hover:shadow-md transition-all">
              <LeagueLogo
                src={league.emblem || league.area?.flag}
                alt={league.name}
                className="w-5 h-5 object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 group-hover:text-secondary truncate transition-colors">
                {league.name}
              </p>
              {showCountry && league.area && (
                <p className="text-[10px] font-medium text-muted uppercase tracking-tighter truncate">
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