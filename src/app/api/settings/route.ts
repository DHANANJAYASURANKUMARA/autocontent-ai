import { NextResponse } from 'next/server';
import store from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
    const settings = await store.getSettings();
    return NextResponse.json(settings);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Sync all settings
        await store.updateSettings(body);

        await store.addActivity('automation', 'Settings & Preferences Updated', 'System customization and API configurations were synchronized.');

        const updatedSettings = await store.getSettings();
        return NextResponse.json({ success: true, settings: updatedSettings });
    } catch (error) {
        console.error('Settings API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
