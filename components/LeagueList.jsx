// components/LeagueList.js
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import LeagueLogo from './LeagueLogo';

export default function LeagueList({ leagues, title, showCountry = false, onLeagueClick, selectedLeagueId }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

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
        {leagues.map((league) => {
          const isSelected = selectedLeagueId === league.id;
          const content = (
            <>
              <div className={`w-8 h-8 flex items-center justify-center bg-slate-50 rounded-lg shadow-sm border group-hover:shadow-md transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border'
                }`}>
                <LeagueLogo
                  src={league.emblem || league.area?.flag}
                  alt={league.name}
                  className="w-5 h-5 object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate transition-colors ${isSelected ? 'text-primary' : 'text-slate-700 group-hover:text-primary'
                  }`}>
                  {league.name}
                </p>
                {showCountry && league.area && (
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter truncate">
                    {league.area.name}
                  </p>
                )}
              </div>
            </>
          );

          if (onLeagueClick) {
            return (
              <button
                key={league.id}
                onClick={() => onLeagueClick(league.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group border text-left ${isSelected
                  ? 'bg-primary/5 border-primary/20'
                  : 'hover:bg-slate-50 border-transparent hover:border-border/50'
                  }`}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={league.id}
              href={isAdmin ? `/admin?competitionId=${league.id}` : `/leagues/${league.id}`}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group border ${isSelected
                ? 'bg-primary/5 border-primary/20'
                : 'hover:bg-slate-50 border-transparent hover:border-border/50'
                }`}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}