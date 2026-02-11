import { NextResponse } from 'next/server';
import store from '@/lib/store';

export async function POST(request: Request) {
    try {
        // Simple security check: only allow reset in development or with a specific header/key if needed
        // For now, since the user is asking for it, we'll implement it.

        await store.reset();

        return NextResponse.json({ message: 'Store reset successfully. New beginning started.' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to reset store' }, { status: 500 });
    }
}
