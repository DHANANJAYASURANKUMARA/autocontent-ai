import { NextResponse } from 'next/server';
import store from '@/lib/store';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
        }

        const loginData = await store.login(email, password);
        if (!loginData) {
            console.warn(`[LOGIN] Failed attempt for email: ${email}`);
            return NextResponse.json({ error: 'Invalid email or password. Please try again.' }, { status: 401 });
        }
        console.log(`[LOGIN] Successful login for: ${email}`);

        const response = NextResponse.json({ user: loginData.user });
        response.cookies.set('sessionId', loginData.sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('[LOGIN API ERROR]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
