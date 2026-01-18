// lib/api.js - Using Football-Data.org API

const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

// Check if we should use mock data
const shouldUseMockData = () => {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.log('🚨 No valid FOOTBALL_DATA_API_KEY found in environment variables');
    return true;
  }
  return false;
};

// Enhanced safe fetch wrapper for Football-Data.org
async function safeFetch(url, options = {}) {
  if (shouldUseMockData()) {
    throw new Error('Using mock data - no API key');
  }

  try {
    console.log(`🔍 Fetching: ${BASE_URL}${url}`);

    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        'X-Auth-Token': API_KEY,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Handle specific HTTP errors
    if (response.status === 429) {
      throw new Error('Rate limit exceeded - too many requests');
    }
    if (response.status === 403) {
      throw new Error('API key invalid or access forbidden');
    }
    if (response.status === 404) {
      throw new Error('Resource not found');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ HTTP error! status: ${response.status}`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('🔴 Fetch error:', error.message);
    throw error;
  }
}

// Mock data as fallback
const mockCompetitions = [
  {
    id: 2021,
    name: "Premier League",
    code: "PL",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/PL.png",
    area: { name: "England", code: "ENG", flag: "https://crests.football-data.org/770.svg" }
  },
  {
    id: 2014,
    name: "La Liga",
    code: "PD",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/PD.png",
    area: { name: "Spain", code: "ESP", flag: "https://crests.football-data.org/760.svg" }
  },
  {
    id: 2002,
    name: "Bundesliga",
    code: "BL1",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/BL1.png",
    area: { name: "Germany", code: "GER", flag: "https://crests.football-data.org/759.svg" }
  },
  {
    id: 2019,
    name: "Serie A",
    code: "SA",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/SA.png",
    area: { name: "Italy", code: "ITA", flag: "https://crests.football-data.org/784.svg" }
  },
  {
    id: 2015,
    name: "Ligue 1",
    code: "FL1",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/FL1.png",
    area: { name: "France", code: "FRA", flag: "https://crests.football-data.org/773.svg" }
  }
];

const mockAllCompetitions = [
  ...mockCompetitions,
  {
    id: 2001,
    name: "UEFA Champions League",
    code: "CL",
    type: "CUP",
    emblem: "https://crests.football-data.org/CL.png",
    area: { name: "Europe", code: "EUR", flag: "https://crests.football-data.org/EUR.svg" }
  },
  {
    id: 2017,
    name: "Primeira Liga",
    code: "PPL",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/PPL.png",
    area: { name: "Portugal", code: "POR", flag: "https://crests.football-data.org/765.svg" }
  },
  {
    id: 2003,
    name: "Eredivisie",
    code: "DED",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/ED.png",
    area: { name: "Netherlands", code: "NED", flag: "https://crests.football-data.org/759.svg" }
  },
  {
    id: 2016,
    name: "Championship",
    code: "ELC",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/ELC.png",
    area: { name: "England", code: "ENG", flag: "https://crests.football-data.org/770.svg" }
  },
  {
    id: 2013,
    name: "Série A",
    code: "BSA",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/764.svg",
    area: { name: "Brazil", code: "BRA", flag: "https://crests.football-data.org/764.svg" }
  },
  {
    id: 2152,
    name: "Copa Libertadores",
    code: "CLI",
    type: "CUP",
    emblem: "https://crests.football-data.org/CLI.png",
    area: { name: "South America", code: "SAM", flag: "https://crests.football-data.org/SAM.svg" }
  },
  {
    id: 2018,
    name: "European Championship",
    code: "EC",
    type: "CUP",
    emblem: "https://crests.football-data.org/EC.png",
    area: { name: "Europe", code: "EUR", flag: "https://crests.football-data.org/EUR.svg" }
  }
];

// Helper to get mock teams based on competition
function getMockTeamsForLeague(competitionId) {
  const premierLeagueTeams = [
    { id: 57, name: 'Arsenal', shortName: 'Arsenal', crest: 'https://crests.football-data.org/57.png', tla: 'ARS' },
    { id: 65, name: 'Manchester City', shortName: 'Man City', crest: 'https://crests.football-data.org/65.png', tla: 'MCI' },
    { id: 64, name: 'Liverpool', shortName: 'Liverpool', crest: 'https://crests.football-data.org/64.png', tla: 'LIV' },
    { id: 61, name: 'Chelsea', shortName: 'Chelsea', crest: 'https://crests.football-data.org/61.png', tla: 'CHE' },
    { id: 73, name: 'Tottenham Hotspur', shortName: 'Spurs', crest: 'https://crests.football-data.org/73.png', tla: 'TOT' },
    { id: 66, name: 'Manchester United', shortName: 'Man United', crest: 'https://crests.football-data.org/66.png', tla: 'MUN' },
    { id: 76, name: 'Wolves', shortName: 'Wolves', crest: 'https://crests.football-data.org/76.png', tla: 'WOL' },
    { id: 58, name: 'Aston Villa', shortName: 'Aston Villa', crest: 'https://crests.football-data.org/58.png', tla: 'AVL' },
    { id: 62, name: 'Everton', shortName: 'Everton', crest: 'https://crests.football-data.org/62.png', tla: 'EVE' },
    { id: 67, name: 'Newcastle', shortName: 'Newcastle', crest: 'https://crests.football-data.org/67.png', tla: 'NEW' },
  ];

  const laLigaTeams = [
    { id: 81, name: 'FC Barcelona', shortName: 'Barcelona', crest: 'https://crests.football-data.org/81.png', tla: 'FCB' },
    { id: 86, name: 'Real Madrid CF', shortName: 'Real Madrid', crest: 'https://crests.football-data.org/86.png', tla: 'RMA' },
    { id: 78, name: 'Club Atlético de Madrid', shortName: 'Atleti', crest: 'https://crests.football-data.org/78.png', tla: 'ATM' },
    { id: 90, name: 'Real Betis Balompié', shortName: 'Real Betis', crest: 'https://crests.football-data.org/90.png', tla: 'BET' },
    { id: 94, name: 'Villarreal CF', shortName: 'Villarreal', crest: 'https://crests.football-data.org/94.png', tla: 'VIL' },
    { id: 89, name: 'Real Sociedad de Fútbol', shortName: 'Real Sociedad', crest: 'https://crests.football-data.org/89.png', tla: 'RSO' },
    { id: 92, name: 'Real Sociedad de Fútbol', shortName: 'Real Sociedad', crest: 'https://crests.football-data.org/89.png', tla: 'RSO' },
    { id: 95, name: 'Valencia CF', shortName: 'Valencia', crest: 'https://crests.football-data.org/95.png', tla: 'VCF' },
    { id: 298, name: 'Girona FC', shortName: 'Girona', crest: 'https://crests.football-data.org/298.png', tla: 'GIR' },
    { id: 87, name: 'Rayo Vallecano', shortName: 'Rayo', crest: 'https://crests.football-data.org/87.png', tla: 'RAY' },
  ];

  if (competitionId == 2014) return laLigaTeams;
  return premierLeagueTeams;
}

// Helper function to generate mock standings
function generateMockStandings(competitionId, type = "TOTAL") {
  const mockTeams = getMockTeamsForLeague(competitionId);

  return mockTeams.map((team, index) => {
    let played, won, draw, lost, points;

    if (type === 'HOME') {
      played = 6;
      won = Math.max(0, 5 - index);
      draw = 1;
      lost = Math.max(0, index - 1);
      points = won * 3 + draw;
    } else if (type === 'AWAY') {
      played = 6;
      won = Math.max(0, 4 - index);
      draw = 1;
      lost = Math.max(0, index);
      points = won * 3 + draw;
    } else {
      played = 12;
      won = 9 - index;
      draw = 2;
      lost = 1 + index;
      points = won * 3 + draw;
    }

    return {
      position: index + 1,
      team: team,
      playedGames: played,
      won: won,
      draw: draw,
      lost: lost,
      points: points,
      goalDifference: 20 - (index * 3),
      goalsFor: 25 - (index * 2),
      goalsAgainst: 5 + index
    };
  });
}

// Helper function to generate mock fixtures for current matchday
function generateMockFixturesForMatchday(competitionId, matchday = 1, limit = 5) {
  const mockTeams = getMockTeamsForLeague(competitionId);

  const fixtures = [];
  const usedTeams = new Set();

  for (let i = 0; i < limit && i < mockTeams.length / 2; i++) {
    let homeTeam, awayTeam;

    // Find teams that haven't been used yet
    do {
      homeTeam = mockTeams[Math.floor(Math.random() * mockTeams.length)];
    } while (usedTeams.has(homeTeam.id));
    usedTeams.add(homeTeam.id);

    do {
      awayTeam = mockTeams[Math.floor(Math.random() * mockTeams.length)];
    } while (usedTeams.has(awayTeam.id) || awayTeam.id === homeTeam.id);
    usedTeams.add(awayTeam.id);

    // Create match dates for the same weekend
    const matchDate = new Date();
    matchDate.setDate(matchDate.getDate() + 3 + (i % 3)); // Spread over Friday, Saturday, Sunday

    fixtures.push({
      id: i + 1,
      homeTeam: homeTeam,
      awayTeam: awayTeam,
      utcDate: matchDate.toISOString(),
      status: 'SCHEDULED',
      matchday: matchday
    });
  }

  return fixtures;
}

// Helper function to generate mock recent fixtures for a complete matchday
function generateMockRecentFixtures(competitionId, limit = 10) {
  const mockTeams = getMockTeamsForLeague(competitionId);

  const fixtures = [];
  const usedTeams = new Set();
  const scores = [
    { home: 2, away: 0 }, { home: 1, away: 1 }, { home: 3, away: 1 },
    { home: 0, away: 2 }, { home: 2, away: 2 }, { home: 1, away: 0 },
    { home: 2, away: 1 }, { home: 0, away: 0 }, { home: 3, away: 0 },
    { home: 1, away: 2 }, { home: 2, away: 3 }, { home: 0, away: 1 }
  ];

  // Create a full matchday (10 matches for 20 teams)
  for (let i = 0; i < Math.min(limit, mockTeams.length / 2); i++) {
    let homeTeam, awayTeam;

    // Find teams that haven't been used yet
    const availableTeams = mockTeams.filter(team => !usedTeams.has(team.id));

    if (availableTeams.length < 2) break;

    homeTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
    usedTeams.add(homeTeam.id);

    const remainingTeams = availableTeams.filter(team => team.id !== homeTeam.id);
    awayTeam = remainingTeams[Math.floor(Math.random() * remainingTeams.length)];
    usedTeams.add(awayTeam.id);

    const score = scores[Math.floor(Math.random() * scores.length)];
    const matchDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago

    fixtures.push({
      id: i + 1,
      homeTeam: homeTeam,
      awayTeam: awayTeam,
      score: {
        fullTime: {
          home: score.home,
          away: score.away
        }
      },
      utcDate: matchDate.toISOString(),
      status: 'FINISHED',
      matchday: 25 // Same matchday for all
    });
  }

  return fixtures;
}

// Get matches for a competition with date range
export async function getCompetitionMatches(competitionId, options = {}) {
  const { dateFrom, dateTo, status = 'FINISHED', limit = 100 } = options;

  if (shouldUseMockData()) {
    console.log('📋 Using mock data for competition matches');
    return generateMockCompetitionMatches(competitionId, limit);
  }

  try {
    let url = `/competitions/${competitionId}/matches?limit=${limit}`;

    if (dateFrom) url += `&dateFrom=${dateFrom}`;
    if (dateTo) url += `&dateTo=${dateTo}`;
    if (status) url += `&status=${status}`;

    const data = await safeFetch(url, {
      next: { revalidate: 1800 } // Cache for 30 minutes
    });

    console.log(`✅ Successfully fetched ${data.matches?.length || 0} matches for competition ${competitionId}`);
    return data.matches || [];
  } catch (error) {
    console.error('❌ Error fetching competition matches, using mock data:', error.message);
    return generateMockCompetitionMatches(competitionId, limit);
  }
}

// Get all matches for statistics (current season)
export async function getMatchesForStatistics(competitionId) {
  // Get current season dates or use default
  const currentYear = new Date().getFullYear();
  const dateFrom = `${currentYear}-08-01`; // Season typically starts in August
  const dateTo = `${currentYear + 1}-05-31`; // Season typically ends in May

  return getCompetitionMatches(competitionId, {
    dateFrom,
    dateTo,
    status: 'FINISHED',
    limit: 200 // Get more matches for accurate statistics
  });
}

// Mock function for competition matches
function generateMockCompetitionMatches(competitionId, limit = 100) {
  const mockTeams = getMockTeamsForLeague(competitionId);

  const matches = [];
  const baseDate = new Date('2024-08-01');

  // Create realistic match data for the current season
  for (let i = 0; i < limit; i++) {
    const homeIndex = Math.floor(Math.random() * mockTeams.length);
    const awayIndex = Math.floor(Math.random() * mockTeams.length);

    if (homeIndex === awayIndex) continue; // Skip if same team

    const homeTeam = mockTeams[homeIndex];
    const awayTeam = mockTeams[awayIndex];

    // Create realistic dates throughout the season
    const matchDate = new Date(baseDate);
    matchDate.setDate(matchDate.getDate() + (i * 2));

    // Generate realistic scores (more goals for better teams)
    const homeGoals = Math.floor(Math.random() * 5);
    const awayGoals = Math.floor(Math.random() * 5);

    matches.push({
      id: i + 1,
      homeTeam: homeTeam,
      awayTeam: awayTeam,
      score: {
        fullTime: {
          home: homeGoals,
          away: awayGoals
        }
      },
      utcDate: matchDate.toISOString(),
      status: 'FINISHED',
      competition: {
        id: competitionId,
        name: 'Premier League',
        code: 'PL'
      },
      matchday: Math.floor(i / 10) + 1 // Generate matchdays
    });
  }

  return matches;
}

// Get top competitions (leagues)
export async function getTopLeagues() {
  if (shouldUseMockData()) {
    console.log('📋 Using mock data for top leagues');
    return mockCompetitions;
  }

  try {
    const data = await safeFetch('/competitions', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    // Filter for top leagues only
    const topLeagueCodes = ['PL', 'PD', 'BL1', 'SA', 'FL1'];
    const topLeagues = data.competitions.filter(comp =>
      topLeagueCodes.includes(comp.code)
    );

    console.log(`✅ Successfully fetched ${topLeagues.length} top leagues`);
    return topLeagues;
  } catch (error) {
    console.error('❌ Error fetching top leagues, using mock data:', error.message);
    return mockCompetitions;
  }
}

// Get all available competitions
export async function getAllLeagues() {
  if (shouldUseMockData()) {
    console.log('📋 Using mock data for all leagues');
    return mockAllCompetitions;
  }

  try {
    const data = await safeFetch('/competitions', {
      next: { revalidate: 3600 }
    });

    console.log(`✅ Successfully fetched ${data.competitions?.length || 0} total competitions`);
    return data.competitions || [];
  } catch (error) {
    console.error('❌ Error fetching all leagues, using mock data:', error.message);
    return mockAllCompetitions;
  }
}

// Get competition by ID
export async function getLeagueById(competitionId) {
  if (shouldUseMockData()) {
    console.log('📋 Using mock data for competition details');
    const allMockCompetitions = [...mockCompetitions, ...mockAllCompetitions];
    const competition = allMockCompetitions.find(comp => comp.id === parseInt(competitionId));
    return competition || mockCompetitions[0];
  }

  try {
    const data = await safeFetch(`/competitions/${competitionId}`, {
      next: { revalidate: 3600 }
    });

    return data;
  } catch (error) {
    console.error('❌ Error fetching competition by ID, using mock data:', error.message);
    const allMockCompetitions = [...mockCompetitions, ...mockAllCompetitions];
    const competition = allMockCompetitions.find(comp => comp.id === parseInt(competitionId));
    return competition || mockCompetitions[0];
  }
}

// Get standings for a competition
export async function getStandings(competitionId, season = '2023') {
  if (shouldUseMockData()) {
    console.log('📋 Using mock data for standings');
    return {
      competition: mockCompetitions.find(comp => comp.id === parseInt(competitionId)) || mockCompetitions[0],
      season: {
        currentMatchday: 12, // Set to a realistic current matchday
        startDate: '2023-08-01',
        endDate: '2024-05-31'
      },
      standings: [
        {
          type: 'TOTAL',
          table: generateMockStandings(competitionId, 'TOTAL')
        },
        {
          type: 'HOME',
          table: generateMockStandings(competitionId, 'HOME')
        },
        {
          type: 'AWAY',
          table: generateMockStandings(competitionId, 'AWAY')
        }
      ]
    };
  }

  try {
    const data = await safeFetch(`/competitions/${competitionId}/standings`, {
      next: { revalidate: 3600 }
    });

    console.log(`✅ Successfully fetched standings for competition ${competitionId}`);
    return data;
  } catch (error) {
    console.error('❌ Error fetching standings, using mock data:', error.message);
    return {
      competition: mockCompetitions.find(comp => comp.id === parseInt(competitionId)) || mockCompetitions[0],
      season: {
        currentMatchday: 12,
        startDate: '2023-08-01',
        endDate: '2024-05-31'
      },
      standings: [
        {
          type: 'TOTAL',
          table: generateMockStandings(competitionId, 'TOTAL')
        },
        {
          type: 'HOME',
          table: generateMockStandings(competitionId, 'HOME')
        },
        {
          type: 'AWAY',
          table: generateMockStandings(competitionId, 'AWAY')
        }
      ]
    };
  }
}

// Get upcoming matches for a competition - FOCUSED ON CURRENT MATCHDAY
export async function getUpcomingMatches(competitionId, limit = 5) {
  if (shouldUseMockData()) {
    console.log('📋 Using mock data for upcoming matches');
    // Use a realistic current matchday for mock data
    return generateMockFixturesForMatchday(competitionId, 12, limit);
  }

  try {
    // First, get the current matchday from standings
    const standingsData = await getStandings(competitionId);
    const currentMatchday = standingsData.season?.currentMatchday;

    if (!currentMatchday) {
      console.log('📋 No current matchday found, using mock data');
      return generateMockFixturesForMatchday(competitionId, 12, limit);
    }

    console.log(`🔍 Looking for matches from matchday ${currentMatchday}`);

    // Get matches for the current matchday
    const data = await safeFetch(
      `/competitions/${competitionId}/matches?matchday=${currentMatchday}&status=SCHEDULED`,
      {
        next: { revalidate: 3600 }
      }
    );

    console.log(`✅ Successfully fetched ${data.matches?.length || 0} matches for matchday ${currentMatchday}`);

    // If no matches found for current matchday, try next matchday
    if (!data.matches || data.matches.length === 0) {
      console.log(`📋 No matches for matchday ${currentMatchday}, trying matchday ${currentMatchday + 1}`);

      const nextMatchdayData = await safeFetch(
        `/competitions/${competitionId}/matches?matchday=${currentMatchday + 1}&status=SCHEDULED`,
        {
          next: { revalidate: 3600 }
        }
      );

      if (nextMatchdayData.matches && nextMatchdayData.matches.length > 0) {
        console.log(`✅ Found ${nextMatchdayData.matches.length} matches for next matchday`);
        const matches = nextMatchdayData.matches.slice(0, limit);
        return matches;
      }

      // If still no matches, use mock data for current matchday
      console.log('📋 No real fixtures found, using mock data for current matchday');
      return generateMockFixturesForMatchday(competitionId, currentMatchday, limit);
    }

    // Return matches from current matchday
    const matches = data.matches.slice(0, limit);
    return matches;
  } catch (error) {
    console.error('❌ Error fetching upcoming matches, using mock data:', error.message);
    // Try to get current matchday from standings for mock data
    try {
      const standingsData = await getStandings(competitionId);
      const currentMatchday = standingsData.season?.currentMatchday || 12;
      return generateMockFixturesForMatchday(competitionId, currentMatchday, limit);
    } catch {
      return generateMockFixturesForMatchday(competitionId, 12, limit);
    }
  }
}

// Get live matches for a competition
export async function getLiveMatches(competitionId) {
  if (shouldUseMockData()) {
    // For testing, let's make Arsenal vs Man City live if PL is selected
    if (competitionId == 2021) {
      return [
        {
          id: 123456,
          homeTeam: { id: 57, name: 'Arsenal', shortName: 'Arsenal', crest: 'https://crests.football-data.org/57.png' },
          awayTeam: { id: 65, name: 'Manchester City', shortName: 'Man City', crest: 'https://crests.football-data.org/65.png' },
          score: { fullTime: { home: 2, away: 1 } },
          status: 'IN_PLAY'
        }
      ];
    }
    return [];
  }

  try {
    const data = await safeFetch(`/competitions/${competitionId}/matches?status=IN_PLAY`, {
      next: { revalidate: 60 } // Cache for 1 minute
    });

    // Also check for PAUSED (halftime)
    const pausedData = await safeFetch(`/competitions/${competitionId}/matches?status=PAUSED`, {
      next: { revalidate: 60 }
    });

    return [...(data.matches || []), ...(pausedData.matches || [])];
  } catch (error) {
    console.error('❌ Error fetching live matches:', error.message);
    return [];
  }
}

// Get recent matches for a competition - COMPLETELY REWRITTEN TO WORK
export async function getRecentMatches(competitionId, limit = 10) {
  console.log(`🎯 FETCHING RECENT MATCHES for competition: ${competitionId}`);

  if (shouldUseMockData()) {
    console.log('📋 Using mock data for recent matches');
    return generateMockRecentFixtures(competitionId, limit);
  }

  try {
    // STRATEGY 1: Get ALL matches and filter for finished ones
    console.log('🔍 Strategy 1: Fetching all matches for the competition...');

    const allMatchesData = await safeFetch(
      `/competitions/${competitionId}/matches?limit=100`,
      {
        next: { revalidate: 1800 } // Cache for 30 minutes
      }
    );

    console.log(`📊 Total matches found: ${allMatchesData.matches?.length || 0}`);

    if (allMatchesData.matches && allMatchesData.matches.length > 0) {
      // Filter for finished matches only
      const finishedMatches = allMatchesData.matches.filter(match =>
        match.status === 'FINISHED' || match.status === 'AWARDED'
      );

      console.log(`✅ Finished matches found: ${finishedMatches.length}`);

      if (finishedMatches.length > 0) {
        // Sort by date (most recent first)
        const sortedMatches = finishedMatches.sort((a, b) =>
          new Date(b.utcDate) - new Date(a.utcDate)
        );

        // Group by matchday to find the most recent complete matchday
        const matchesByMatchday = {};
        sortedMatches.forEach(match => {
          if (!matchesByMatchday[match.matchday]) {
            matchesByMatchday[match.matchday] = [];
          }
          matchesByMatchday[match.matchday].push(match);
        });

        // Find the most recent matchday with matches
        const matchdays = Object.keys(matchesByMatchday).sort((a, b) => b - a);

        for (const matchday of matchdays) {
          const matches = matchesByMatchday[matchday];
          console.log(`📅 Matchday ${matchday}: ${matches.length} matches`);

          // Return matches from this matchday if we have a reasonable number
          if (matches.length >= 3) { // At least 3 matches for a proper matchday
            console.log(`🎯 Using matchday ${matchday} with ${matches.length} matches`);
            return matches.slice(0, limit);
          }
        }

        // If no complete matchday found, return the most recent finished matches
        console.log('📋 No complete matchday found, returning most recent finished matches');
        return sortedMatches.slice(0, limit);
      }
    }

    // STRATEGY 2: If no matches found, try with date range (last 3 months)
    console.log('🔍 Strategy 2: Trying with date range (last 3 months)...');

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const dateFrom = threeMonthsAgo.toISOString().split('T')[0];

    const today = new Date();
    const dateTo = today.toISOString().split('T')[0];

    const dateRangeData = await safeFetch(
      `/competitions/${competitionId}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}&status=FINISHED`,
      {
        next: { revalidate: 1800 }
      }
    );

    if (dateRangeData.matches && dateRangeData.matches.length > 0) {
      console.log(`✅ Found ${dateRangeData.matches.length} matches in date range`);
      const recentMatches = dateRangeData.matches
        .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
        .slice(0, limit);
      return recentMatches;
    }

    // STRATEGY 3: Final attempt - get any finished matches
    console.log('🔍 Strategy 3: Final attempt - any finished matches...');

    const anyFinishedData = await safeFetch(
      `/competitions/${competitionId}/matches?status=FINISHED&limit=${limit}`,
      {
        next: { revalidate: 3600 }
      }
    );

    if (anyFinishedData.matches && anyFinishedData.matches.length > 0) {
      console.log(`✅ Found ${anyFinishedData.matches.length} finished matches`);
      return anyFinishedData.matches
        .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
        .slice(0, limit);
    }

    // If all strategies fail, use mock data
    console.warn('⚠️ No finished matches found after all strategies, using mock data');
    return generateEnhancedMockFixtures(competitionId, limit);

  } catch (error) {
    console.error('❌ Error in getRecentMatches:', error.message);
    return generateEnhancedMockFixtures(competitionId, limit);
  }
}

// Enhanced mock data generator that uses real team data
function generateEnhancedMockFixtures(competitionId, limit = 10) {
  console.log('🎭 Generating enhanced mock fixtures for competition:', competitionId);

  const teams = getMockTeamsForLeague(competitionId);

  const fixtures = [];
  const usedTeams = new Set();
  const scores = [
    { home: 2, away: 0 }, { home: 1, away: 1 }, { home: 3, away: 1 },
    { home: 0, away: 2 }, { home: 2, away: 2 }, { home: 1, away: 0 },
    { home: 2, away: 1 }, { home: 0, away: 0 }, { home: 3, away: 0 },
    { home: 1, away: 2 }, { home: 2, away: 3 }, { home: 0, away: 1 }
  ];

  // Create realistic recent dates (last 1-2 weeks)
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 7); // One week ago

  // Create a full matchday
  for (let i = 0; i < Math.min(limit, teams.length / 2); i++) {
    let homeTeam, awayTeam;

    // Find teams that haven't been used yet
    const availableTeams = teams.filter(team => !usedTeams.has(team.id));

    if (availableTeams.length < 2) break;

    homeTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
    usedTeams.add(homeTeam.id);

    const remainingTeams = availableTeams.filter(team => team.id !== homeTeam.id);
    awayTeam = remainingTeams[Math.floor(Math.random() * remainingTeams.length)];
    usedTeams.add(awayTeam.id);

    const score = scores[Math.floor(Math.random() * scores.length)];

    // Create match date (spread over a weekend)
    const matchDate = new Date(baseDate);
    matchDate.setDate(baseDate.getDate() + (i % 3)); // Spread over 3 days

    fixtures.push({
      id: Date.now() + i, // Unique ID
      homeTeam: homeTeam,
      awayTeam: awayTeam,
      score: {
        fullTime: {
          home: score.home,
          away: score.away
        }
      },
      utcDate: matchDate.toISOString(),
      status: 'FINISHED',
      matchday: 12 // Realistic matchday number
    });
  }

  console.log(`✅ Generated ${fixtures.length} enhanced mock fixtures`);
  return fixtures;
}

// Get team details
export async function getTeamDetails(teamId) {
  if (shouldUseMockData()) {
    console.log('📋 Using mock data for team details');
    return generateMockTeamDetails(teamId);
  }

  try {
    const data = await safeFetch(`/teams/${teamId}`, {
      next: { revalidate: 3600 }
    });

    console.log(`✅ Successfully fetched team details for ${teamId}`);
    return data;
  } catch (error) {
    console.error('❌ Error fetching team details, using mock data:', error.message);
    return generateMockTeamDetails(teamId);
  }
}

// Get team matches
export async function getTeamMatches(teamId, limit = 50) {
  if (shouldUseMockData()) {
    console.log('📋 Using mock data for team matches');
    return generateMockTeamMatches(teamId, limit);
  }

  try {
    const data = await safeFetch(`/teams/${teamId}/matches?limit=${limit}`, {
      next: { revalidate: 1800 }
    });

    console.log(`✅ Successfully fetched ${data.matches?.length || 0} matches for team ${teamId}`);
    return data.matches || [];
  } catch (error) {
    console.error('❌ Error fetching team matches, using mock data:', error.message);
    return generateMockTeamMatches(teamId, limit);
  }
}

// Mock team details generator
function generateMockTeamDetails(teamId) {
  const mockTeams = {
    57: {
      id: 57,
      name: 'Arsenal FC',
      shortName: 'Arsenal',
      tla: 'ARS',
      crest: 'https://crests.football-data.org/57.png',
      website: 'https://www.arsenal.com',
      description: 'Arsenal Football Club (also known as Arsenal, The Arsenal or The Gunners) are an English professional football club based in Holloway, north London.',
      area: {
        name: 'England',
        flag: 'https://crests.football-data.org/770.svg'
      }
    },
    65: {
      id: 65,
      name: 'Manchester City FC',
      shortName: 'Man City',
      tla: 'MCI',
      crest: 'https://crests.football-data.org/65.png',
      website: 'https://www.mancity.com',
      description: 'Manchester City Football Club is an English professional football club based in Manchester.',
      area: {
        name: 'England',
        flag: 'https://crests.football-data.org/770.svg'
      }
    },
    64: {
      id: 64,
      name: 'Liverpool FC',
      shortName: 'Liverpool',
      tla: 'LIV',
      crest: 'https://crests.football-data.org/64.png',
      website: 'https://www.liverpoolfc.com',
      description: 'Liverpool Football Club is an English professional football club based in Liverpool.',
      area: {
        name: 'England',
        flag: 'https://crests.football-data.org/770.svg'
      }
    },
    61: {
      id: 61,
      name: 'Chelsea FC',
      shortName: 'Chelsea',
      tla: 'CHE',
      crest: 'https://crests.football-data.org/61.png',
      website: 'https://www.chelseafc.com',
      description: 'Chelsea Football Club is an English professional football club based in Fulham, London.',
      area: {
        name: 'England',
        flag: 'https://crests.football-data.org/770.svg'
      }
    },
    73: {
      id: 73,
      name: 'Tottenham Hotspur',
      shortName: 'Spurs',
      tla: 'TOT',
      crest: 'https://crests.football-data.org/73.png',
      website: 'https://www.tottenhamhotspur.com',
      description: 'Tottenham Hotspur Football Club is an English professional football club based in Tottenham, London.',
      area: {
        name: 'England',
        flag: 'https://crests.football-data.org/770.svg'
      }
    },
    66: {
      id: 66,
      name: 'Manchester United FC',
      shortName: 'Man United',
      tla: 'MUN',
      crest: 'https://crests.football-data.org/66.png',
      website: 'https://www.manutd.com',
      description: 'Manchester United Football Club is an English professional football club based in Old Trafford, Greater Manchester.',
      area: {
        name: 'England',
        flag: 'https://crests.football-data.org/770.svg'
      }
    }
  };

  return mockTeams[teamId] || mockTeams[57];
}

// Mock team matches generator
function generateMockTeamMatches(teamId, limit) {
  const mockTeams = [
    { id: 57, name: 'Arsenal', shortName: 'Arsenal', crest: 'https://crests.football-data.org/57.png' },
    { id: 65, name: 'Manchester City', shortName: 'Man City', crest: 'https://crests.football-data.org/65.png' },
    { id: 64, name: 'Liverpool', shortName: 'Liverpool', crest: 'https://crests.football-data.org/64.png' },
    { id: 61, name: 'Chelsea', shortName: 'Chelsea', crest: 'https://crests.football-data.org/61.png' },
    { id: 73, name: 'Tottenham', shortName: 'Spurs', crest: 'https://crests.football-data.org/73.png' },
    { id: 66, name: 'Manchester United', shortName: 'Man United', crest: 'https://crests.football-data.org/66.png' },
    { id: 76, name: 'Wolves', shortName: 'Wolves', crest: 'https://crests.football-data.org/76.png' },
    { id: 58, name: 'Aston Villa', shortName: 'Aston Villa', crest: 'https://crests.football-data.org/58.png' },
    { id: 62, name: 'Everton', shortName: 'Everton', crest: 'https://crests.football-data.org/62.png' },
    { id: 67, name: 'Newcastle', shortName: 'Newcastle', crest: 'https://crests.football-data.org/67.png' },
  ];

  const matches = [];
  const baseDate = new Date();

  for (let i = 0; i < limit; i++) {
    const availableOpponents = mockTeams.filter(team => team.id !== teamId);
    const opponent = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
    const isHome = i % 2 === 0;
    const matchDate = new Date(baseDate);
    matchDate.setDate(matchDate.getDate() - i * 3);

    const homeGoals = Math.floor(Math.random() * 4);
    const awayGoals = Math.floor(Math.random() * 4);

    matches.push({
      id: i + 1,
      homeTeam: isHome ? { id: teamId, name: 'Arsenal', shortName: 'Arsenal', crest: 'https://crests.football-data.org/57.png' } : opponent,
      awayTeam: isHome ? opponent : { id: teamId, name: 'Arsenal', shortName: 'Arsenal', crest: 'https://crests.football-data.org/57.png' },
      score: {
        fullTime: {
          home: homeGoals,
          away: awayGoals
        }
      },
      utcDate: matchDate.toISOString(),
      status: 'FINISHED',
      competition: {
        id: 2021,
        name: 'Premier League',
        code: 'PL'
      }
    });
  }

  return matches;
}