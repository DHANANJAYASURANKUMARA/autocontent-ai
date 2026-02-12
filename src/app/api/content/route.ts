import { NextResponse } from 'next/server';
import store from '@/lib/store';
import { generateBatchContent } from '@/lib/ai-engine';
import { generateAsset } from '@/lib/video-generator';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const content = await store.getContent();
        return NextResponse.json(content);
    } catch (error) {
        console.error('Content GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { niche, style, platform, type, customTopic, count = 1 } = await request.json();

        if (!niche || !style || !platform || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const settings = await store.getSettings();

        // Pass all provider and visual settings to AI Engine
        const results = await generateBatchContent(
            { niche, style, platform, type, customTopic },
            count,
            settings.geminiKey,
            {
                tone: settings.contentTone,
                length: settings.contentLength,
                brandName: settings.brandName,
                language: settings.videoLanguage,
                targetKeywords: settings.targetKeywords,
                font: settings.font,
                primaryColor: settings.primaryColor,
                backgroundStyle: settings.backgroundStyle,
                aiProvider: settings.aiProvider,
                openaiKey: settings.openaiKey,
                customBaseUrl: settings.customBaseUrl,
                customKey: settings.customKey,
                customModel: settings.customModel,
            }
        );

        const items = await Promise.all(results.map(async (content) => {
            console.log(`[CONTENT-API] Processing item: ${content.title}`);
            // Generate visual asset (video/photo) for the content
            const asset = await generateAsset({
                type: type as any,
                platform: platform as any,
                style,
                niche,
                font: settings.font,
                primaryColor: settings.primaryColor,
                backgroundStyle: settings.backgroundStyle,
                grokKey: settings.grokKey,
                title: content.title,
                description: content.description
            });

            return store.addContent({
                ...content,
                niche,
                style,
                platform,
                type,
                status: 'ready',
                imageUrl: (type === 'video' || type === 'shorts') ? asset.thumbnailUrl : asset.url,
                videoUrl: (type === 'video' || type === 'shorts') ? asset.url : undefined,
                thumbnailUrl: asset.thumbnailUrl
            } as any);
        }));

        console.log(`[CONTENT-API] Successfully generated ${items.length} items.`);
        return NextResponse.json(items);
    } catch (error: any) {
        console.error('Content Generation Route Error:', error.message || error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            await store.deleteContent(id);
            return NextResponse.json({ success: true, message: 'Content deleted' });
        } else {
            await store.deleteAllContent();
            return NextResponse.json({ success: true, message: 'All content deleted' });
        }
    } catch (error) {
        console.error('Content Delete Error:', error);
        return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { id, updates } = await request.json();
        if (!id || !updates) {
            return NextResponse.json({ error: 'Missing id or updates' }, { status: 400 });
        }

        await store.updateContent(id, updates);
        return NextResponse.json({ success: true, message: 'Content updated' });
    } catch (error) {
        console.error('Content Update Error:', error);
        return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    }
}
