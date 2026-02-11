import { NextResponse } from 'next/server';
import store from '@/lib/store';
import { generateContent } from '@/lib/ai-engine';

export async function GET() {
    return NextResponse.json({ automation: store.automation });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action } = body;

        if (action === 'toggle') {
            store.automation.enabled = !store.automation.enabled;
            store.addActivity(
                'automation',
                store.automation.enabled ? 'Automation Enabled' : 'Automation Disabled',
                store.automation.enabled ? 'Full pipeline automation is now running' : 'Automation has been paused'
            );
            return NextResponse.json({ automation: store.automation });
        }

        if (action === 'update') {
            const { niches, style, platforms, types, frequency } = body;
            if (niches) store.automation.niches = niches;
            if (style) store.automation.style = style;
            if (platforms) store.automation.platforms = platforms;
            if (types) store.automation.types = types;
            if (frequency) store.automation.frequency = frequency;
            return NextResponse.json({ automation: store.automation });
        }

        if (action === 'run') {
            const niche = store.automation.niches[Math.floor(Math.random() * store.automation.niches.length)] || 'Technology';
            const type = store.automation.types[Math.floor(Math.random() * store.automation.types.length)] || 'video';
            const platform = store.automation.platforms[Math.floor(Math.random() * store.automation.platforms.length)] || 'youtube';

            const settings = store.getSettings();

            // Validate based on provider
            const provider = settings.aiProvider || 'gemini';
            if (provider === 'gemini' && !settings.geminiKey) {
                return NextResponse.json({ error: 'Gemini API Key is required for automation' }, { status: 400 });
            }
            if (provider === 'openai' && !settings.openaiKey) {
                return NextResponse.json({ error: 'OpenAI API Key is required for automation' }, { status: 400 });
            }
            // Custom might not need a key if local, but usually needs a URL
            if (provider === 'custom' && !settings.customBaseUrl) {
                return NextResponse.json({ error: 'Custom Base URL is required for automation' }, { status: 400 });
            }

            const dynamicTopics: Record<string, string[]> = {
                Technology: ['AI Agents', 'Quantum Computing', 'SpaceX', 'Future of Coding', 'Tech Trends 2026'],
                Motivation: ['Morning Routine', 'Overcoming Fear', 'Discipline vs Motivation', 'Success Habits', 'Mindset Shift'],
                Finance: ['Crypto Trends', 'Passive Income', 'Stock Market', 'Budgeting Tips', 'Investing 101'],
                Gaming: ['Esports', 'Game Reviews', 'Hidden Gems', 'Speedrunning', 'Retro Gaming'],
                Education: ['Study Hacks', 'Language Learning', 'History Facts', 'Science Explained', 'productivity'],
            };

            const topics = dynamicTopics[niche] || ['Interesting Trends', 'Viral Topics', 'Breaking News'];
            const topic = topics[Math.floor(Math.random() * topics.length)];

            // Pass "Customize Everything" preferences to AI Engine in automation run
            const generated = await generateContent({
                niche,
                style: store.automation.style,
                platform: 'all',
                type,
                customTopic: topic,
            }, settings.geminiKey, {
                tone: settings.contentTone,
                length: settings.contentLength,
                brandName: settings.brandName,
                language: settings.videoLanguage,
                targetKeywords: settings.targetKeywords,
                // Pass visual branding
                font: settings.font,
                primaryColor: settings.primaryColor,
                backgroundStyle: settings.backgroundStyle,
                // Pass Provider Config
                aiProvider: settings.aiProvider,
                openaiKey: settings.openaiKey,
                customBaseUrl: settings.customBaseUrl,
                customKey: settings.customKey,
                customModel: settings.customModel,
            });

            const item = store.addContent({
                title: generated.title,
                description: generated.description,
                script: generated.script,
                hashtags: generated.hashtags,
                imageUrl: generated.imageUrl,
                niche,
                style: store.automation.style,
                platform,
                type,
                status: 'ready',
            });

            store.addActivity('automation', 'Pipeline Run Complete', `Generated ${type.toUpperCase()} "${item.title}" with custom tone & branding.`);

            return NextResponse.json({ automation: store.automation, generated: item });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Automation Route Error:', error);
        return NextResponse.json({ error: 'Failed to update automation' }, { status: 500 });
    }
}
