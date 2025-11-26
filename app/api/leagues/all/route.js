// app/api/leagues/all/route.js
import { getAllLeagues } from '../../../../lib/api';

export async function GET() {
  try {
    const allLeagues = await getAllLeagues();
    
    return Response.json({
      success: true,
      data: allLeagues
    });
  } catch (error) {
    console.error('Error in all leagues API:', error);
    return Response.json({
      success: false,
      error: error.message,
      data: []
    }, { status: 500 });
  }
}