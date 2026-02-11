import { NextResponse } from 'next/server';
import store from '@/lib/store';
import { simulatePublish } from '@/lib/video-generator';

export async function GET() {
    return NextResponse.json({
        accounts: store.accounts,
        publishHistory: store.content.filter(c => c.status === 'published'),
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { contentId, platform } = body;

        if (!contentId || !platform) {
            return NextResponse.json({ error: 'Missing contentId or platform' }, { status: 400 });
        }

        const content = store.content.find(c => c.id === contentId);
        if (!content) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }

        // Update status to publishing
        store.updateContent(contentId, { status: 'publishing' });
        store.addActivity('publish', `Publishing Started`, `"${content.title}" is being sent to ${platform}...`);

        // Simulate publishing
        const result = await simulatePublish(platform);

        if (result.success) {
            store.updateContent(contentId, {
                status: 'published',
                publishedUrl: result.url,
                publishedAt: new Date().toISOString(),
            });
            store.addActivity('publish', `Published to ${platform.toUpperCase()}`, `"${content.title}" is now live!`);
        } else {
            store.updateContent(contentId, { status: 'failed' });
            store.addActivity('error', `Publish Failed`, `${result.message} for "${content.title}"`);
        }

        return NextResponse.json({ success: result.success, url: result.url, message: result.message });
    } catch (error) {
        console.error('Publish Route Error:', error);
        return NextResponse.json({ error: 'Failed to publish' }, { status: 500 });
    }
}
