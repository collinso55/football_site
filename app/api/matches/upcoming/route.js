// app/api/matches/upcoming/route.js
import { getUpcomingMatches } from '../../../../lib/api';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const competitionId = searchParams.get('competitionId');
    const limit = searchParams.get('limit') || 20;

    if (!competitionId) {
        return Response.json({ success: false, error: 'competitionId is required' }, { status: 400 });
    }

    try {
        const matches = await getUpcomingMatches(competitionId, parseInt(limit));

        return Response.json({
            success: true,
            data: matches
        });
    } catch (error) {
        console.error('Error in upcoming matches API:', error);
        return Response.json({
            success: false,
            error: error.message,
            data: []
        }, { status: 500 });
    }
}
