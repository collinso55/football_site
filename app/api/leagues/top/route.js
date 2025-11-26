// app/api/leagues/top/route.js
import { getTopLeagues } from '../../../../lib/api';

export async function GET() {
  try {
    const topLeagues = await getTopLeagues();
    
    return Response.json({
      success: true,
      data: topLeagues
    });
  } catch (error) {
    console.error('Error in top leagues API:', error);
    return Response.json({
      success: false,
      error: error.message,
      data: []
    }, { status: 500 });
  }
}