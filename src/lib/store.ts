// AutoContent AI — Database-backed Model Store (Prisma)
import { getPrisma } from './prisma';
import {
    User as PrismaUser,
    Session as PrismaSession,
    ContentItem as PrismaContent,
    PlatformAccount as PrismaAccount,
    ActivityLog as PrismaActivity,
    AutomationConfig as PrismaAutomation,
    SystemSettings as PrismaSettings,
    ScheduledPost as PrismaScheduled
} from '@prisma/client';

function uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// ---- Types (Re-exported/Compatible) ----
export interface ContentItem extends Omit<PrismaContent, 'hashtags' | 'publishedAt' | 'createdAt' | 'updatedAt'> {
    hashtags: string[];
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ScheduledPost extends Omit<PrismaScheduled, 'scheduledAt' | 'createdAt'> {
    scheduledAt: string;
    createdAt: string;
}

export interface PlatformAccount extends Omit<PrismaAccount, 'createdAt'> {
    createdAt: string;
}

export interface ActivityLog extends Omit<PrismaActivity, 'timestamp'> {
    timestamp: string;
}

export interface User extends Omit<PrismaUser, 'createdAt'> {
    createdAt: string;
}

export interface AutomationConfig {
    enabled: boolean;
    niches: string[];
    style: string;
    platforms: ('youtube' | 'tiktok' | 'facebook')[];
    types: ('video' | 'photo' | 'shorts' | 'text')[];
    frequency: 'hourly' | 'daily' | 'weekly';
    nextRun?: string;
}

export interface SystemSettings {
    openaiKey: string;
    youtubeKey: string;
    tiktokKey: string;
    facebookKey: string;
    geminiKey: string;
    contentTone: string;
    contentLength: 'short' | 'medium' | 'long';
    brandName: string;
    videoResolution: '1080p' | '4k' | 'vertical';
    videoLanguage: string;
    targetKeywords: string[];
    font: string;
    primaryColor: string;
    backgroundStyle: string;
    aiProvider: 'gemini' | 'openai' | 'custom';
    customBaseUrl: string;
    customKey: string;
    customModel: string;
}

// Helper to map Prisma types to internal types
const mapContent = (c: PrismaContent): ContentItem => ({
    ...c,
    hashtags: c.hashtags ? c.hashtags.split(',').filter(Boolean) : [],
    publishedAt: c.publishedAt?.toISOString(),
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    type: c.type as any,
    platform: c.platform as any,
    status: c.status as any,
});

class DataStore {
    private initPromise: Promise<void> | null = null;

    constructor() {
        // Initialization is triggered on first use
    }

    private async ensureInitialized() {
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            if (process.env.NEXT_PHASE === 'phase-production-build') return;
            await this.seedIfEmpty();
        })();

        return this.initPromise;
    }

    private async seedIfEmpty() {
        const prisma = getPrisma();
        try {
            const userCount = await prisma.user.count();
            if (userCount > 0) return; // Already has data

            // Seed demo user for first-time setup
            await this.seedDemoData();
            console.log('Seeded demo user (demo@example.com / password123)');
        } catch (err) {
            console.error('Database seed check failed:', err);
        }
    }

    private async seedDemoData() {
        const prisma = getPrisma();
        const userId = uuidv4();
        await prisma.user.create({
            data: {
                id: userId,
                email: 'demo@example.com',
                password: 'password123',
                name: 'Demo User',
            }
        });
        await prisma.session.create({ data: { id: 'demo-session-id', userId } });
    }

    async getContent() {
        await this.ensureInitialized();
        const prisma = getPrisma();
        const items = await prisma.contentItem.findMany({ orderBy: { createdAt: 'desc' } });
        return items.map(mapContent);
    }

    async getContentById(id: string) {
        await this.ensureInitialized();
        const prisma = getPrisma();
        const item = await prisma.contentItem.findUnique({ where: { id } });
        return item ? mapContent(item) : null;
    }

    async addContent(item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentItem> {
        await this.ensureInitialized();
        const prisma = getPrisma();
        const newItem = await prisma.contentItem.create({
            data: {
                ...item,
                hashtags: item.hashtags.join(','),
                publishedAt: item.publishedAt ? new Date(item.publishedAt) : undefined,
            }
        });
        await this.addActivity('generate', 'Content Generated', `${newItem.type.toUpperCase()}: "${newItem.title}"`);
        return mapContent(newItem);
    }

    async getPlatformAccounts() {
        await this.ensureInitialized();
        const prisma = getPrisma();
        const accounts = await prisma.platformAccount.findMany({ orderBy: { platform: 'asc' } });
        return accounts.map((a: PrismaAccount) => ({ ...a, createdAt: a.createdAt.toISOString() }));
    }

    async updatePlatformAccount(platform: string, updates: Partial<PlatformAccount>) {
        await this.ensureInitialized();
        const prisma = getPrisma();
        await prisma.platformAccount.updateMany({
            where: { platform },
            data: updates as any
        });
    }

    async updateContent(id: string, updates: Partial<ContentItem>) {
        await this.ensureInitialized();
        const prisma = getPrisma();
        const data: any = { ...updates };
        if (updates.hashtags) data.hashtags = updates.hashtags.join(',');
        if (updates.publishedAt) data.publishedAt = new Date(updates.publishedAt);

        await prisma.contentItem.update({ where: { id }, data });
    }

    async signup(email: string, password: string, name: string): Promise<User | null> {
        await this.ensureInitialized();
        const prisma = getPrisma();
        try {
            const user = await prisma.user.create({ data: { email, password, name } });
            await this.addActivity('auth', 'New User Sign Up', `User ${email} created an account`);
            return { ...user, createdAt: user.createdAt.toISOString() };
        } catch (e) {
            return null;
        }
    }

    async login(email: string, password: string): Promise<{ user: User; sessionId: string } | null> {
        await this.ensureInitialized();
        const prisma = getPrisma();
        const user = await prisma.user.findFirst({ where: { email, password } });
        if (!user) return null;
        const session = await prisma.session.create({ data: { userId: user.id } });
        console.log(`[LOGIN] Successful login for: ${email}`);
        return {
            user: { ...user, createdAt: user.createdAt.toISOString() },
            sessionId: session.id
        };
    }

    async logout(sessionId: string) {
        await this.ensureInitialized();
        const prisma = getPrisma();
        await prisma.session.delete({ where: { id: sessionId } }).catch(() => { });
    }

    async getUserBySession(sessionId: string): Promise<User | null> {
        await this.ensureInitialized();
        const prisma = getPrisma();
        const session = await prisma.session.findUnique({ where: { id: sessionId }, include: { user: true } });
        if (!session) return null;
        return { ...session.user, createdAt: session.user.createdAt.toISOString() };
    }

    async addActivity(type: PrismaActivity['type'] | any, title: string, description: string) {
        await this.ensureInitialized();
        const prisma = getPrisma();
        await prisma.activityLog.create({
            data: { type: type as string, title, description }
        });
    }

    async getActivities() {
        await this.ensureInitialized();
        const prisma = getPrisma();
        const logs = await prisma.activityLog.findMany({ orderBy: { timestamp: 'desc' }, take: 50 });
        return logs.map((l: PrismaActivity) => ({ ...l, timestamp: l.timestamp.toISOString(), type: l.type as any }));
    }

    async getAutomationConfig(): Promise<AutomationConfig> {
        await this.ensureInitialized();
        const prisma = getPrisma();
        let a = await prisma.automationConfig.findUnique({ where: { id: 1 } });
        if (!a) {
            a = await prisma.automationConfig.create({ data: { id: 1, niches: 'Technology,Motivation', platforms: 'youtube,tiktok,facebook', types: 'video,shorts' } });
        }
        return {
            ...a,
            niches: a.niches ? a.niches.split(',').filter(Boolean) : [],
            platforms: a.platforms ? a.platforms.split(',').filter(Boolean) : [] as any,
            types: a.types ? a.types.split(',').filter(Boolean) : [] as any,
            frequency: a.frequency as any,
            nextRun: a.nextRun?.toISOString(),
        };
    }

    async updateAutomationConfig(updates: Partial<AutomationConfig>) {
        await this.ensureInitialized();
        const prisma = getPrisma();
        const data: any = { ...updates };
        if (updates.niches) data.niches = updates.niches.join(',');
        if (updates.platforms) data.platforms = updates.platforms.join(',');
        if (updates.types) data.types = updates.types.join(',');
        if (updates.nextRun) data.nextRun = new Date(updates.nextRun);

        await prisma.automationConfig.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
    }

    async getScheduledPosts() {
        await this.ensureInitialized();
        const prisma = getPrisma();
        const items = await prisma.scheduledPost.findMany({ orderBy: { scheduledAt: 'asc' } });
        return items.map((s: PrismaScheduled) => ({
            ...s,
            scheduledAt: s.scheduledAt.toISOString(),
            createdAt: s.createdAt.toISOString(),
            platform: s.platform as any,
            status: s.status as any,
        }));
    }

    async getSettings(): Promise<SystemSettings> {
        await this.ensureInitialized();
        const prisma = getPrisma();
        let s = await prisma.systemSettings.findUnique({ where: { id: 1 } });
        if (!s) {
            s = await prisma.systemSettings.create({ data: { id: 1 } });
        }
        return {
            ...s,
            contentLength: s.contentLength as any,
            aiProvider: s.aiProvider as any,
            videoResolution: s.videoResolution as any,
            targetKeywords: s.targetKeywords ? s.targetKeywords.split(',').filter(Boolean) : [],
        } as SystemSettings;
    }

    async getStats() {
        await this.ensureInitialized();
        const prisma = getPrisma();
        const totalContent = await prisma.contentItem.count();
        const published = await prisma.contentItem.count({ where: { status: 'published' } });
        const generating = await prisma.contentItem.count({ where: { status: 'generating' } });
        const scheduled = await prisma.scheduledPost.count({ where: { status: 'pending' } });

        return {
            totalContent,
            published,
            scheduled,
            generating,
            successRate: totalContent > 0 ? Math.round((published / totalContent) * 100) : 0,
        };
    }

    async updateSettings(updates: Partial<SystemSettings>) {
        await this.ensureInitialized();
        const prisma = getPrisma();
        const data: any = { ...updates };
        if (updates.targetKeywords) data.targetKeywords = updates.targetKeywords.join(',');

        await prisma.systemSettings.upsert({
            where: { id: 1 },
            update: data,
            create: { id: 1, ...data }
        });
    }

    async addSchedule(item: Omit<ScheduledPost, 'id' | 'createdAt' | 'status'> & { status?: ScheduledPost['status'] }) {
        await this.ensureInitialized();
        const prisma = getPrisma();
        const newItem = await prisma.scheduledPost.create({
            data: {
                contentId: item.contentId,
                platform: item.platform,
                scheduledAt: new Date(item.scheduledAt),
                status: item.status || 'pending',
            }
        });
        await this.addActivity('schedule', 'Post Scheduled', `Scheduled for ${newItem.platform} at ${new Date(newItem.scheduledAt).toLocaleString()}`);
        return {
            ...newItem,
            scheduledAt: newItem.scheduledAt.toISOString(),
            createdAt: newItem.createdAt.toISOString(),
            platform: newItem.platform as any,
            status: newItem.status as any,
        };
    }

    async reset() {
        await this.ensureInitialized();
        const prisma = getPrisma();
        await prisma.session.deleteMany();
        await prisma.user.deleteMany();
        await prisma.contentItem.deleteMany();
        await prisma.activityLog.deleteMany();
        await prisma.platformAccount.deleteMany();
        await prisma.scheduledPost.deleteMany();
        await prisma.automationConfig.deleteMany();
        await prisma.systemSettings.deleteMany();

        await this.addActivity('auth', 'System Reset', 'All data has been cleared for a new beginning.');
    }
}

const store = new DataStore();
export default store;
