import { getPrisma } from './src/lib/prisma';

async function test() {
    try {
        const prisma = getPrisma();
        const users = await prisma.user.findMany();
        console.log('Users:', JSON.stringify(users, null, 2));
        const sessions = await prisma.session.findMany();
        console.log('Sessions:', JSON.stringify(sessions, null, 2));
    } catch (e) {
        console.error('Test Failed:', e);
    }
}

test();
