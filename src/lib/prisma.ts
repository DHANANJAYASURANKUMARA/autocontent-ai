import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    return new PrismaClient();
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const getPrisma = (): PrismaClient => {
    if (globalThis.prisma) return globalThis.prisma;

    const client = new PrismaClient();
    if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;
    return client;
};

// Initialized only when getPrisma() is actually called
// We have replaced all occurrences in store.ts to use getPrisma()
