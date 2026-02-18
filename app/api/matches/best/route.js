// app/api/matches/best/route.js
import { getTopLeagues, getUpcomingMatches } from '../../../../lib/api';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;

    try {
        // Get top leagues
        const topLeagues = await getTopLeagues();

        // Fetch upcoming matches from each league
        const matchPromises = topLeagues.map(league =>
            getUpcomingMatches(league.id, 3) // Get 3 matches from each league
        );

        const matchesPerLeague = await Promise.all(matchPromises);

        // Flatten and combine all matches
        const allMatches = matchesPerLeague.flat();

        // Sort by date (closest first) and limit
        const sortedMatches = allMatches
            .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
            .slice(0, limit);

        return Response.json({
            success: true,
            data: sortedMatches
        });
    } catch (error) {
        console.error('Error in best matches API:', error);
        return Response.json({
            success: false,
            error: error.message,
            data: []
        }, { status: 500 });
    }
}
