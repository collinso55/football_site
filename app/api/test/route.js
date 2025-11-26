// app/api/test/route.js
export async function GET() {
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
  
  const testData = {
    apiKeyExists: !!API_KEY,
    apiKeyLength: API_KEY?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    message: API_KEY ? 'API key found!' : 'No API key found in environment'
  };

  // Test the API if key exists
  if (API_KEY) {
    try {
      const response = await fetch('https://api.football-data.org/v4/competitions/PL', {
        headers: {
          'X-Auth-Token': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      testData.apiStatus = response.status;
      testData.apiSuccess = response.ok;

      if (response.ok) {
        const data = await response.json();
        testData.leagueName = data.name;
        testData.area = data.area.name;
      } else {
        const errorText = await response.text();
        testData.apiError = errorText.substring(0, 200);
      }
    } catch (error) {
      testData.apiError = error.message;
    }
  }

  return Response.json(testData);
}