import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import store from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
    const sessionId = cookies().get('sessionId')?.value;

    if (!sessionId) {
        return NextResponse.json({ user: null });
    }

    const user = await store.getUserBySession(sessionId);
    if (!user) {
        console.warn(`[AUTH_ME] Session ID ${sessionId} not found in database.`);
        return NextResponse.json({ user: null });
    }

    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
}
