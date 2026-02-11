// AutoContent AI — Persistent Model Store
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

function uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// ---- Types ----
export interface ContentItem {
    id: string;
    title: string;
    description: string;
    script: string;
    hashtags: string[];
    niche: string;
    style: string;
    type: 'video' | 'photo' | 'shorts' | 'text';
    platform: 'youtube' | 'tiktok' | 'facebook' | 'all';
    status: 'draft' | 'generating' | 'ready' | 'publishing' | 'published' | 'failed';
    imageUrl?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    publishedUrl?: string;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ScheduledPost {
    id: string;
    contentId: string;
    platform: 'youtube' | 'tiktok' | 'facebook';
    scheduledAt: string;
    status: 'pending' | 'publishing' | 'published' | 'failed';
    publishedUrl?: string;
    error?: string;
    createdAt: string;
}

export interface PlatformAccount {
    id: string;
    platform: 'youtube' | 'tiktok' | 'facebook';
    name: string;
    connected: boolean;
    apiKey?: string;
    createdAt: string;
}

export interface ActivityLog {
    id: string;
    type: 'generate' | 'publish' | 'schedule' | 'error' | 'automation' | 'auth';
    title: string;
    description: string;
    timestamp: string;
}

export interface User {
    id: string;
    email: string;
    password?: string;
    name: string;
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
    // New "Customize Everything" settings
    contentTone: string;
    contentLength: 'short' | 'medium' | 'long';
    brandName: string;
    videoResolution: '1080p' | '4k' | 'vertical';
    videoLanguage: string;
    targetKeywords: string[];
    // Visual Branding
    font: string;
    primaryColor: string;
    backgroundStyle: string;
    // AI Provider
    aiProvider: 'gemini' | 'openai' | 'custom';
    // openaiKey is already defined above
    customBaseUrl: string;
    customKey: string;
    customModel: string;
}

// ---- Store ----
class DataStore {
    content: ContentItem[] = [];
    scheduled: ScheduledPost[] = [];
    accounts: PlatformAccount[] = [];
    activities: ActivityLog[] = [];
    users: User[] = [];
    sessions: Record<string, string> = {};
    automation: AutomationConfig = {
        enabled: false,
        niches: ['Technology', 'Motivation'],
        style: 'educational',
        platforms: ['youtube', 'tiktok', 'facebook'],
        types: ['video', 'shorts'],
        frequency: 'daily',
    };
    settings: SystemSettings = {
        openaiKey: '',
        youtubeKey: '',
        tiktokKey: '',
        facebookKey: '',
        geminiKey: '',
        contentTone: 'Professional & Engaging',
        contentLength: 'medium',
        brandName: 'AutoContent AI',
        videoResolution: '1080p',
        videoLanguage: 'English',
        targetKeywords: [],
        font: 'Inter',
        primaryColor: '#0070f3',
        backgroundStyle: 'solid',
        aiProvider: 'gemini',
        customBaseUrl: 'https://api.openai.com/v1',
        customKey: '',
        customModel: 'gpt-3.5-turbo',
    };

    constructor() {
        this.load();
    }

    private save() {
        try {
            const data = {
                content: this.content,
                scheduled: this.scheduled,
                accounts: this.accounts,
                activities: this.activities,
                users: this.users,
                sessions: this.sessions,
                automation: this.automation,
                settings: this.settings,
            };
            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        } catch (err) {
            console.error('Failed to save data:', err);
        }
    }

    private load() {
        try {
            if (fs.existsSync(DATA_FILE)) {
                const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
                this.content = data.content || [];
                this.scheduled = data.scheduled || [];
                this.accounts = data.accounts || [];
                this.activities = data.activities || [];
                this.users = data.users || [];
                this.sessions = data.sessions || {};
                this.automation = data.automation || this.automation;
                this.settings = { ...this.settings, ...(data.settings || {}) };
                if (!this.automation.types) this.automation.types = ['video', 'shorts'];
            } else {
                this.seedDemoData();
                this.save();
            }
        } catch (err) {
            console.error('Failed to load data:', err);
            this.seedDemoData();
        }
    }

    private seedDemoData() {
        const now = new Date();
        this.users = [
            {
                id: uuidv4(),
                email: 'demo@example.com',
                password: 'password123',
                name: 'Demo User',
                createdAt: now.toISOString(),
            },
        ];
        this.sessions['demo-session-id'] = this.users[0].id;

        this.accounts = [
            { id: uuidv4(), platform: 'youtube', name: 'Tech Master YT', connected: true, createdAt: now.toISOString() },
            { id: uuidv4(), platform: 'tiktok', name: 'Daily Motivation TT', connected: true, createdAt: now.toISOString() },
            { id: uuidv4(), platform: 'facebook', name: 'AutoContent FB Page', connected: false, createdAt: now.toISOString() },
        ];
    }

    getContent() { return this.content; }
    addContent(item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): ContentItem {
        const now = new Date().toISOString();
        const newItem: ContentItem = { ...item, id: uuidv4(), createdAt: now, updatedAt: now };
        this.content.unshift(newItem);
        this.addActivity('generate', 'Content Generated', `${newItem.type.toUpperCase()}: "${newItem.title}"`);
        this.save();
        return newItem;
    }

    updateContent(id: string, updates: Partial<ContentItem>) {
        const index = this.content.findIndex(c => c.id === id);
        if (index !== -1) {
            this.content[index] = { ...this.content[index], ...updates, updatedAt: new Date().toISOString() };
            this.save();
        }
    }

    signup(email: string, password: string, name: string): User | null {
        if (this.users.find(u => u.email === email)) return null;
        const user: User = { id: uuidv4(), email, password, name, createdAt: new Date().toISOString() };
        this.users.push(user);
        this.addActivity('auth', 'New User Sign Up', `User ${email} created an account`);
        this.save();
        return user;
    }

    login(email: string, password: string): { user: User; sessionId: string } | null {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (!user) return null;
        const sessionId = uuidv4();
        this.sessions[sessionId] = user.id;
        this.save();
        return { user, sessionId };
    }

    logout(sessionId: string) {
        delete this.sessions[sessionId];
        this.save();
    }

    getUserBySession(sessionId: string): User | null {
        const userId = this.sessions[sessionId];
        return this.users.find(u => u.id === userId) || null;
    }

    addActivity(type: ActivityLog['type'], title: string, description: string) {
        const activity: ActivityLog = { id: uuidv4(), type, title, description, timestamp: new Date().toISOString() };
        this.activities.unshift(activity);
        if (this.activities.length > 50) this.activities = this.activities.slice(0, 50);
        this.save();
    }

    getActivities() { return this.activities; }
    getSettings() { return this.settings; }

    getStats() {
        return {
            totalContent: this.content.length,
            published: this.content.filter(c => c.status === 'published').length,
            scheduled: this.scheduled.filter(s => s.status === 'pending').length,
            generating: this.content.filter(c => c.status === 'generating').length,
            successRate: this.content.length > 0 ? Math.round((this.content.filter(c => c.status === 'published').length / this.content.length) * 100) : 0,
        };
    }

    updateSettings(updates: Partial<SystemSettings>) {
        this.settings = { ...this.settings, ...updates };
        this.save();
    }

    addSchedule(item: Omit<ScheduledPost, 'id' | 'createdAt' | 'status'> & { status?: ScheduledPost['status'] }) {
        const newItem: ScheduledPost = {
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            status: 'pending',
            ...item
        };
        this.scheduled.push(newItem);
        this.addActivity('schedule', 'Post Scheduled', `Scheduled for ${newItem.platform} at ${new Date(newItem.scheduledAt).toLocaleString()}`);
        this.save();
        return newItem;
    }
}

const store = new DataStore();
export default store;
