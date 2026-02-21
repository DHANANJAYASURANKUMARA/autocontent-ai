import { NextResponse } from 'next/server';

const fallbackMatches = [
    {
        id: 'ipl-1',
        status: 'LIVE',
        format: 'T20',
        series: 'Indian Premier League',
        venue: 'Wankhede Stadium, Mumbai',
        startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        teamA: { name: 'Mumbai Indians', shortName: 'MI', score: '167/5', overs: '18.3 ov' },
        teamB: { name: 'Chennai Super Kings', shortName: 'CSK', score: '164/7', overs: '20 ov' },
        currentInnings: 'MI need 3 runs from 9 balls',
        lastUpdated: new Date().toISOString(),
    },
    {
        id: 'intl-2',
        status: 'UPCOMING',
        format: 'ODI',
        series: 'Pakistan Tour of Australia',
        venue: 'MCG, Melbourne',
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        teamA: { name: 'Australia', shortName: 'AUS', score: '', overs: '' },
        teamB: { name: 'Pakistan', shortName: 'PAK', score: '', overs: '' },
        currentInnings: 'Match starts in 2 hours',
        lastUpdated: new Date().toISOString(),
    },
    {
        id: 'test-3',
        status: 'COMPLETED',
        format: 'Test',
        series: 'India vs England Test Series',
        venue: 'Eden Gardens, Kolkata',
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        teamA: { name: 'India', shortName: 'IND', score: '421 & 210/4', overs: '63.0 ov' },
        teamB: { name: 'England', shortName: 'ENG', score: '356 & 198', overs: '58.2 ov' },
        currentInnings: 'India won by 77 runs',
        lastUpdated: new Date().toISOString(),
    },
] as const;

export async function GET() {
    const apiKey = process.env.CRICAPI_KEY;

    if (!apiKey) {
        return NextResponse.json({ source: 'fallback', matches: fallbackMatches });
    }

    try {
        const response = await fetch(`https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}&offset=0`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error('Remote API error');
        }

        const payload = await response.json();
        const matches = (payload?.data ?? []).slice(0, 12).map((item: any) => ({
            id: item.id,
            status: item.matchEnded ? 'COMPLETED' : item.matchStarted ? 'LIVE' : 'UPCOMING',
            format: item.matchType?.toUpperCase() ?? 'N/A',
            series: item.series_id ?? item.name ?? 'Unknown Series',
            venue: item.venue ?? 'Venue TBA',
            startTime: item.dateTimeGMT ?? new Date().toISOString(),
            teamA: {
                name: item.teams?.[0] ?? 'Team A',
                shortName: item.teamInfo?.[0]?.shortname ?? item.teams?.[0] ?? 'A',
                score: item.score?.[0] ? `${item.score[0].r}/${item.score[0].w}` : '',
                overs: item.score?.[0] ? `${item.score[0].o} ov` : '',
            },
            teamB: {
                name: item.teams?.[1] ?? 'Team B',
                shortName: item.teamInfo?.[1]?.shortname ?? item.teams?.[1] ?? 'B',
                score: item.score?.[1] ? `${item.score[1].r}/${item.score[1].w}` : '',
                overs: item.score?.[1] ? `${item.score[1].o} ov` : '',
            },
            currentInnings: item.status ?? 'Awaiting update',
            lastUpdated: new Date().toISOString(),
        }));

        return NextResponse.json({ source: 'cricapi', matches: matches.length ? matches : fallbackMatches });
    } catch {
        return NextResponse.json({ source: 'fallback', matches: fallbackMatches });
    }
}
