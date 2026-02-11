import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log('USERS_IN_DB:', JSON.stringify(users, null, 2));

    const sessions = await prisma.session.findMany();
    console.log('SESSIONS_IN_DB:', JSON.stringify(sessions, null, 2));

    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
