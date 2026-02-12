import { NextResponse } from 'next/server';
import store from '@/lib/store';

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Please fill in all fields (Name, Email, Password)' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
        }

        const user = await store.signup(email, password, name);
        if (!user) {
            return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
        }

        // Auto-login after signup
        const loginData = await store.login(email, password);
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
        console.error('[SIGNUP API ERROR]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
