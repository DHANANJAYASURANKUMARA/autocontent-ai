import { NextResponse } from 'next/server';
import store from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
    const stats = await store.getStats();
    const recentActivity = await store.getActivities();
    const recentContent = await store.getContent();

    return NextResponse.json({
        stats,
        recentActivity: recentActivity.slice(0, 10),
        recentContent: recentContent.slice(0, 5),
        // For scheduled, we might need a getSchedule method or similar
        upcomingScheduled: [], // Placeholder until schedule method is confirmed
        automation: {}, // Placeholder until automation method is added
    });
}
