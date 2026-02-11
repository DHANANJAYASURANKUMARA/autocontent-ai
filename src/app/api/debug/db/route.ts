import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const prisma = getPrisma();
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        });
        const sessions = await prisma.session.findMany();

        return NextResponse.json({
            users,
            sessions
        });
    } catch (error) {
        console.error('Debug DB API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch debug data' }, { status: 500 });
    }
}
