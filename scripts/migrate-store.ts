import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DATA_FILE = path.join(process.cwd(), 'data.json');

async function migrate() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            console.log('No data.json found, skipping migration.');
            return;
        }

        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        console.log('Starting migration from data.json...');

        // 1. Migrate Users
        if (data.users) {
            for (const user of data.users) {
                await prisma.user.upsert({
                    where: { email: user.email },
                    update: { name: user.name, password: user.password },
                    create: { id: user.id || undefined, email: user.email, name: user.name, password: user.password, createdAt: user.createdAt ? new Date(user.createdAt) : undefined },
                });
            }
            console.log(`Migrated ${data.users.length} users.`);
        }

        // 2. Migrate Sessions
        if (data.sessions) {
            for (const [sessionId, userId] of Object.entries(data.sessions)) {
                // Ensure user exists first
                const user = await prisma.user.findUnique({ where: { id: userId as string } });
                if (user) {
                    await prisma.session.upsert({
                        where: { id: sessionId },
                        update: { userId: userId as string },
                        create: { id: sessionId, userId: userId as string },
                    });
                }
            }
            console.log(`Migrated ${Object.keys(data.sessions).length} sessions.`);
        }

        // 3. Migrate Content
        if (data.content) {
            for (const item of data.content) {
                await prisma.contentItem.upsert({
                    where: { id: item.id },
                    update: { ...item, hashtags: Array.isArray(item.hashtags) ? item.hashtags.join(',') : item.hashtags },
                    create: {
                        ...item,
                        hashtags: Array.isArray(item.hashtags) ? item.hashtags.join(',') : item.hashtags,
                        publishedAt: item.publishedAt ? new Date(item.publishedAt) : undefined,
                        createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
                        updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
                    },
                });
            }
            console.log(`Migrated ${data.content.length} content items.`);
        }

        // 4. Migrate Platform Accounts
        if (data.accounts) {
            for (const account of data.accounts) {
                await prisma.platformAccount.upsert({
                    where: { id: account.id },
                    update: account,
                    create: { ...account, createdAt: account.createdAt ? new Date(account.createdAt) : undefined },
                });
            }
            console.log(`Migrated ${data.accounts.length} platform accounts.`);
        }

        // 5. Migrate Activities
        if (data.activities) {
            for (const log of data.activities) {
                await prisma.activityLog.upsert({
                    where: { id: log.id },
                    update: log,
                    create: { ...log, timestamp: log.timestamp ? new Date(log.timestamp) : undefined },
                });
            }
            console.log(`Migrated ${data.activities.length} activity logs.`);
        }

        // 6. Migrate Automation
        if (data.automation) {
            await prisma.automationConfig.upsert({
                where: { id: 1 },
                update: {
                    ...data.automation,
                    niches: Array.isArray(data.automation.niches) ? data.automation.niches.join(',') : data.automation.niches,
                    platforms: Array.isArray(data.automation.platforms) ? data.automation.platforms.join(',') : data.automation.platforms,
                    types: Array.isArray(data.automation.types) ? data.automation.types.join(',') : data.automation.types,
                },
                create: {
                    ...data.automation,
                    niches: Array.isArray(data.automation.niches) ? data.automation.niches.join(',') : data.automation.niches,
                    platforms: Array.isArray(data.automation.platforms) ? data.automation.platforms.join(',') : data.automation.platforms,
                    types: Array.isArray(data.automation.types) ? data.automation.types.join(',') : data.automation.types,
                },
            });
            console.log('Migrated automation config.');
        }

        // 7. Migrate Settings
        if (data.settings) {
            await prisma.systemSettings.upsert({
                where: { id: 1 },
                update: {
                    ...data.settings,
                    targetKeywords: Array.isArray(data.settings.targetKeywords) ? data.settings.targetKeywords.join(',') : data.settings.targetKeywords,
                },
                create: {
                    ...data.settings,
                    targetKeywords: Array.isArray(data.settings.targetKeywords) ? data.settings.targetKeywords.join(',') : data.settings.targetKeywords,
                },
            });
            console.log('Migrated system settings.');
        }

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

migrate();
