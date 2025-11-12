import { leaguesList } from "../../../data/leaguesList";

export async function GET() {
  const API_KEY = process.env.API_FOOTBALL_KEY;

  if (!API_KEY) {
    return Response.json({ error: "API key missing" }, { status: 500 });
  }

  try {
    const res = await fetch("https://v3.football.api-sports.io/leagues?season=2023", {
      headers: { "x-apisports-key": API_KEY },
    });

    if (!res.ok) {
      const text = await res.text();
      return Response.json({ error: "API Request Failed", details: text }, { status: res.status });
    }

    const data = await res.json();
    if (!data.response) return Response.json({ error: "No leagues found" }, { status: 500 });

    // Filter leagues to only include those in your fixed list
    let filteredLeagues = data.response.filter((item) =>
      leaguesList.includes(item.league.name)
    );

    // Deduplicate by league name (keep first occurrence)
    const seen = new Set();
    filteredLeagues = filteredLeagues.filter((item) => {
      if (seen.has(item.league.name)) return false;
      seen.add(item.league.name);
      return true;
    });

    return Response.json(filteredLeagues);
  } catch (err) {
    return Response.json({ error: "Unexpected error", details: err.message }, { status: 500 });
  }
}
