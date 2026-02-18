'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getTopLeagues, getAllLeagues } from '../lib/api';
import LeagueList from './LeagueList';

export default function Sidebar() {
  const [topLeagues, setTopLeagues] = useState([]);
  const [allLeagues, setAllLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedLeagueId = searchParams.get('competitionId');

  useEffect(() => {
    async function fetchData() {
      try {
        const [top, all] = await Promise.all([
          getTopLeagues(),
          getAllLeagues()
        ]);
        setTopLeagues(top);
        setAllLeagues(all);
      } catch (err) {
        console.error('Error in Sidebar:', err);
        setError('Error loading leagues.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-card border-r border-border animate-pulse">
        <div className="p-6 border-b border-border bg-white/5 flex-shrink-0">
          <div className="h-3 w-20 bg-muted rounded mb-2"></div>
          <div className="h-2 w-32 bg-muted/50 rounded"></div>
        </div>
        <div className="flex-1 p-6 space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 bg-muted rounded-lg"></div>
              <div className="flex-1">
                <div className="h-3 w-24 bg-muted rounded mb-1"></div>
                <div className="h-2 w-16 bg-muted/50 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col bg-card border-r border-border">
        <div className="p-6 border-b border-border flex-shrink-0">
          <h2 className="text-xs font-bold text-secondary uppercase tracking-widest">Leagues</h2>
        </div>
        <div className="flex-1 p-6">
          <p className="text-rose-500 text-[10px] font-bold uppercase">{error}</p>
        </div>
      </div>
    );
  }

  const topLeagueIds = topLeagues.map(league => league.id);
  const filteredAllLeagues = allLeagues
    .filter(league => !topLeagueIds.includes(league.id))
    .slice(0, 25);

  return (
    <div className="h-full flex flex-col bg-white border-r border-border shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-border bg-slate-50/50 flex-shrink-0">
        <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Leagues</h2>
        <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">Standings & Statistics</p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="py-2">
          <div className="mb-2">
            <LeagueList
              leagues={topLeagues}
              title="Top Leagues"
              selectedLeagueId={parseInt(selectedLeagueId)}
            />
          </div>

          <div className="border-t border-border pt-2">
            <LeagueList
              leagues={filteredAllLeagues}
              title="All Leagues"
              showCountry={true}
              selectedLeagueId={parseInt(selectedLeagueId)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
