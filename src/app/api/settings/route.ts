import { NextResponse } from 'next/server';
import store from '@/lib/store';

export async function GET() {
    const settings = store.getSettings();
    return NextResponse.json(settings);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const settings = store.getSettings();

        // Sync all settings
        store.updateSettings(body);

        store.addActivity('automation', 'Settings & Preferences Updated', 'System customization and API configurations were synchronized.');

        return NextResponse.json({ success: true, settings: store.getSettings() });
    } catch (error) {
        console.error('Settings API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
