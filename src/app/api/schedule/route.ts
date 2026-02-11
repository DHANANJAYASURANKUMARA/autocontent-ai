import { NextResponse } from 'next/server';
import store from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
    const scheduled = await store.getScheduledPosts();
    const content = await store.getContent();

    return NextResponse.json({
        scheduled: scheduled.map((s: any) => ({
            ...s,
            content: content.find((c: any) => c.id === s.contentId),
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

        const post = await store.addSchedule({
            contentId,
            platform,
            scheduledAt,
            status: 'pending',
        } as any);

        return NextResponse.json({ scheduled: post });
    } catch (error) {
        console.error('Schedule API Error:', error);
        return NextResponse.json({ error: 'Failed to schedule' }, { status: 500 });
    }
}
