const { PrismaClient } = require('@prisma/client');
const path = require('path');
const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    try {
        console.log('Connecting to Prisma...');
        await prisma.$connect();
        console.log('Connected!');
        const count = await prisma.user.count();
        console.log('User count:', count);
        await prisma.$disconnect();
    } catch (e) {
        console.error('Prisma Error:', e);
        process.exit(1);
    }
}

main();
