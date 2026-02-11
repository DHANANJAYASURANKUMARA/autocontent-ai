import { NextResponse } from 'next/server';
import store from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
    const accounts = await store.getPlatformAccounts();
    return NextResponse.json({ accounts });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { platform, action, apiKey } = body;

        if (!platform || !action) {
            return NextResponse.json({ error: 'Missing platform or action' }, { status: 400 });
        }

        if (action === 'connect') {
            await store.updatePlatformAccount(platform, { connected: true, apiKey: apiKey || undefined });
            await store.addActivity('auth', 'Account Connected', `Connected to ${platform.toUpperCase()}`);
        } else if (action === 'disconnect') {
            await store.updatePlatformAccount(platform, { connected: false });
            await store.addActivity('auth', 'Account Disconnected', `Disconnected from ${platform.toUpperCase()}`);
        }

        const updatedAccounts = await store.getPlatformAccounts();
        return NextResponse.json({ success: true, accounts: updatedAccounts });

    } catch (error) {
        console.error('Account API Error:', error);
        return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
    }
}
