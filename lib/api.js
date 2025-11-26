// lib/api.js - Using Football-Data.org API

const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

// Check if we should use mock data
const shouldUseMockData = () => {
  if (!API_KEY) {
    console.log('🚨 No FOOTBALL_DATA_API_KEY found in environment variables');
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
    console.log(`🔍 Fetching: ${url}`);
    
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        'X-Auth-Token': API_KEY,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ HTTP error! status: ${response.status}`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
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
    area: {
      name: "England",
      code: "ENG",
      flag: "https://crests.football-data.org/770.svg"
    }
  },
  {
    id: 2014,
    name: "La Liga",
    code: "PD",
    type: "LEAGUE", 
    emblem: "https://crests.football-data.org/PD.png",
    area: {
      name: "Spain",
      code: "ESP",
      flag: "https://crests.football-data.org/760.svg"
    }
  },
  {
    id: 2002,
    name: "Bundesliga",
    code: "BL1",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/BL1.png",
    area: {
      name: "Germany",
      code: "GER",
      flag: "https://crests.football-data.org/759.svg"
    }
  },
  {
    id: 2019,
    name: "Serie A",
    code: "SA",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/SA.png",
    area: {
      name: "Italy",
      code: "ITA",
      flag: "https://crests.football-data.org/784.svg"
    }
  },
  {
    id: 2015,
    name: "Ligue 1",
    code: "FL1",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/FL1.png",
    area: {
      name: "France",
      code: "FRA",
      flag: "https://crests.football-data.org/773.svg"
    }
  }
];

const mockAllCompetitions = [
  ...mockCompetitions,
  {
    id: 2017,
    name: "Primeira Liga",
    code: "PPL",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/PPL.png",
    area: {
      name: "Portugal",
      code: "POR",
      flag: "https://crests.football-data.org/765.svg"
    }
  },
  {
    id: 2003,
    name: "Eredivisie",
    code: "DED",
    type: "LEAGUE",
    emblem: "https://crests.football-data.org/ED.png",
    area: {
      name: "Netherlands",
      code: "NED",
      flag: "https://crests.football-data.org/759.svg"
    }
  }
];

// Helper function to generate mock standings
function generateMockStandings() {
  const mockTeams = [
    { 
      id: 57, 
      name: 'Arsenal', 
      crest: 'https://crests.football-data.org/57.png',
      shortName: 'Arsenal',
      tla: 'ARS'
    },
    { 
      id: 65, 
      name: 'Manchester City', 
      crest: 'https://crests.football-data.org/65.png',
      shortName: 'Man City',
      tla: 'MCI'
    },
    { 
      id: 64, 
      name: 'Liverpool', 
      crest: 'https://crests.football-data.org/64.png',
      shortName: 'Liverpool',
      tla: 'LIV'
    },
    { 
      id: 61, 
      name: 'Chelsea', 
      crest: 'https://crests.football-data.org/61.png',
      shortName: 'Chelsea',
      tla: 'CHE'
    },
    { 
      id: 73, 
      name: 'Tottenham Hotspur', 
      crest: 'https://crests.football-data.org/73.png',
      shortName: 'Spurs',
      tla: 'TOT'
    },
    { 
      id: 66, 
      name: 'Manchester United', 
      crest: 'https://crests.football-data.org/66.png',
      shortName: 'Man United',
      tla: 'MUN'
    },
  ];

  return mockTeams.map((team, index) => ({
    position: index + 1,
    team: team,
    playedGames: 38,
    won: 25 - index,
    draw: 8,
    lost: 5 + index,
    points: 80 - (index * 5),
    goalDifference: 45 - (index * 3),
    goalsFor: 70 - (index * 4),
    goalsAgainst: 25 + (index * 1)
  }));
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
        currentMatchday: 38,
        startDate: '2023-08-01',
        endDate: '2024-05-31'
      },
      standings: [
        {
          type: 'TOTAL',
          table: generateMockStandings()
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
        currentMatchday: 38,
        startDate: '2023-08-01',
        endDate: '2024-05-31'
      },
      standings: [
        {
          type: 'TOTAL',
          table: generateMockStandings()
        }
      ]
    };
  }
}