// test-api.js
const API_KEY = process.env.API_FOOTBALL_KEY;

async function testAPI() {
  console.log('Testing API connection...');
  console.log('API Key exists:', !!API_KEY);
  console.log('API Key length:', API_KEY ? API_KEY.length : 0);
  
  if (!API_KEY) {
    console.log('❌ No API key found. Please check your .env.local file');
    return;
  }

  try {
    const response = await fetch('https://api-football-v1.p.rapidapi.com/v3/leagues?id=39', {
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('First 200 chars of response:', text.substring(0, 200));
    
    if (response.ok) {
      const data = JSON.parse(text);
      console.log('✅ API connection successful!');
      console.log('League name:', data.response[0]?.league?.name);
    } else {
      console.log('❌ API error:', text);
    }
  } catch (error) {
    console.log('❌ Fetch error:', error.message);
  }
}

testAPI();