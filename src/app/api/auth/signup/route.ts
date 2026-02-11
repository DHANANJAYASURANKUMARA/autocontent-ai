import { NextResponse } from 'next/server';
import store from '@/lib/store';

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const user = store.signup(email, password, name);
        if (!user) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        // Auto-login after signup
        const loginData = store.login(email, password);
        if (!loginData) {
            return NextResponse.json({ error: 'Login failed after signup' }, { status: 500 });
        }

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
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
