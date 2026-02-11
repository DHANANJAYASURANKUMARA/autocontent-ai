import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import store from '@/lib/store';

export async function GET() {
    const sessionId = cookies().get('sessionId')?.value;

    if (!sessionId) {
        return NextResponse.json({ user: null });
    }

    const user = store.getUserBySession(sessionId);
    if (!user) {
        return NextResponse.json({ user: null });
    }

    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
}
