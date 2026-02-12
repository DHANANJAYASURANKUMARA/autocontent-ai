import { NextResponse } from 'next/server';
import store from '@/lib/store';

export const dynamic = 'force-dynamic';
import { generateBatchContent } from '@/lib/ai-engine';

export async function GET() {
    const content = await store.getContent();
    return NextResponse.json(content);
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

        const items = await Promise.all(results.map(content => store.addContent({
            ...content,
            niche,
            style,
            platform,
            type,
            status: 'ready',
        } as any)));

        return NextResponse.json(items);
    } catch (error) {
        console.error('Content Generation Route Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
