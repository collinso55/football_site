"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { leagueFlags } from "../data/leagueFlags"; // adjust path if needed

export default function Sidebar() {
  const [allLeagues, setAllLeagues] = useState([]);
  const topLeaguesManual = [
    "Premier League",
    "La Liga",
    "Bundesliga",
    "Serie A",
    "Ligue 1",
    "Eredivisie",
    "Primeira Liga",
    "Süper Lig",
    "Jupiler Pro League",
    "Ekstraklasa",
    "1. Liga",
    "Scottish Premiership",
    "Liga I",
    "NB I",
    "Premier Liga",
    "Allsvenskan",
    "Eliteserien",
    "Super League",
    "Champions League",
    "Europa League",
    "Conference League",
    "UEFA Nations League",
    "South America",
  ];

  // Fetch all leagues from API
  useEffect(() => {
    async function fetchLeagues() {
      try {
        const res = await fetch("/api/leagues");
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllLeagues(data);
        } else {
          console.error("API returned non-array data:", data);
          setAllLeagues([]);
        }
      } catch (err) {
        console.error(err);
        setAllLeagues([]);
      }
    }
    fetchLeagues();
  }, []);

  // Handle click on a league
  async function handleLeagueClick(leagueName) {
    try {
      const res = await fetch(`/api/leagues?name=${encodeURIComponent(leagueName)}`);
      const data = await res.json();
      console.log("League data:", data);
      // You can update state to display league info elsewhere
    } catch (err) {
      console.error(err);
    }
  }

  // Helper to get flag or logo
  function getFlagOrLogo(leagueName) {
    const value = leagueFlags[leagueName];

    if (!value) return "🏆"; // fallback

    // Country code
    if (value.length === 2) {
      return (
        <Image
          src={`https://flagcdn.com/24x18/${value}.png`}
          alt={leagueName}
          width={24}
          height={18}
          className="inline-block mr-2"
        />
      );
    }

    // Full logo URL
    return (
      <Image
        src={value}
        alt={leagueName}
        width={20}
        height={20}
        className="inline-block mr-2 object-contain"
      />
    );
  }

  return (
    <div className="w-60 min-h-screen bg-[#111] text-white p-4 overflow-y-auto">
      {/* Top Leagues */}
      <h2 className="text-lg font-bold mb-2">TOP LEAGUES</h2>
      <ul className="space-y-2 mb-6">
        {topLeaguesManual.map((league) => (
          <li
            key={league}
            className="flex items-center px-2 py-1 rounded-md hover:bg-gray-800 cursor-pointer transition"
            onClick={() => handleLeagueClick(league)}
          >
            {getFlagOrLogo(league)}
            <span>{league}</span>
          </li>
        ))}
      </ul>

      {/* All Leagues */}
      <h2 className="text-lg font-bold mb-2">ALL LEAGUES</h2>
      <ul className="space-y-2">
        {Array.isArray(allLeagues) && allLeagues.length > 0 ? (
          allLeagues
            .filter((l) => !topLeaguesManual.includes(l.name)) // remove duplicates
            .map((league) => (
              <li
                key={league.id}
                className="flex items-center px-2 py-1 rounded-md hover:bg-gray-800 cursor-pointer transition"
                onClick={() => handleLeagueClick(league.name)}
              >
                {getFlagOrLogo(league.name)}
                <span>{league.name}</span>
              </li>
            ))
        ) : (
          <li className="text-gray-400">No leagues found</li>
        )}
      </ul>
    </div>
  );
}
