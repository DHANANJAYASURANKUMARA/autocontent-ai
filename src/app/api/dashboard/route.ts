import { NextResponse } from 'next/server';
import store from '@/lib/store';

export async function GET() {
    return NextResponse.json({
        stats: store.getStats(),
        recentActivity: store.activities.slice(0, 10),
        recentContent: store.content.slice(0, 5),
        upcomingScheduled: store.scheduled.filter(s => s.status === 'pending').slice(0, 5),
        automation: store.automation,
    });
}
