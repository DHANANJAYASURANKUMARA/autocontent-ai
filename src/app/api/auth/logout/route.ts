import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import store from '@/lib/store';

export async function POST() {
    const sessionId = cookies().get('sessionId')?.value;
    if (sessionId) {
        await store.logout(sessionId);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('sessionId', '', { maxAge: 0, path: '/' });
    return response;
}
