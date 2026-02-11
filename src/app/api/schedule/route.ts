import { NextResponse } from 'next/server';
import store from '@/lib/store';

export async function GET() {
    return NextResponse.json({
        scheduled: store.scheduled.map(s => ({
            ...s,
            content: store.content.find(c => c.id === s.contentId),
        })),
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { contentId, platform, scheduledAt } = body;

        if (!contentId || !platform || !scheduledAt) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const post = store.addSchedule({
            contentId,
            platform,
            scheduledAt,
            status: 'pending',
        });

        return NextResponse.json({ scheduled: post });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to schedule' }, { status: 500 });
    }
}
