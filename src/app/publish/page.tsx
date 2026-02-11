'use client';

import { useState, useEffect } from 'react';

interface Account {
    id: string;
    platform: string;
    name: string;
    connected: boolean;
}

interface ContentItem {
    id: string;
    title: string;
    platform: string;
    status: string;
    publishedUrl?: string;
    publishedAt?: string;
}

export default function PublishPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [publishHistory, setPublishHistory] = useState<ContentItem[]>([]);
    const [readyContent, setReadyContent] = useState<ContentItem[]>([]);
    const [publishing, setPublishing] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [pubRes, contentRes] = await Promise.all([
                fetch('/api/publish'),
                fetch('/api/content'),
            ]);
            const pubData = await pubRes.json();
            const contentData = await contentRes.json();
            setAccounts(pubData.accounts || []);
            setPublishHistory(pubData.publishHistory || []);
            setReadyContent((contentData.content || []).filter((c: any) => c.status === 'ready'));
        } catch (err) {
            console.error('Failed to fetch:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handlePublish(contentId: string, platform: 'youtube' | 'tiktok') {
        setPublishing(contentId);
        try {
            const res = await fetch('/api/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contentId, platform }),
            });
            const data = await res.json();
            fetchData();
        } catch (err) {
            console.error('Publish failed:', err);
        } finally {
            setPublishing(null);
        }
    }

    async function handlePublishAll() {
        for (const item of readyContent) {
            const platforms: ('youtube' | 'tiktok')[] = item.platform === 'both' ? ['youtube', 'tiktok'] : [item.platform as 'youtube' | 'tiktok'];
            for (const p of platforms) {
                await handlePublish(item.id, p);
            }
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div className="spinner" style={{ width: 40, height: 40 }} />
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>🚀 Publishing Hub</h2>
                    <p>Manage your connected accounts and publish content</p>
                </div>
                {readyContent.length > 0 && (
                    <button className="btn btn-primary" onClick={handlePublishAll}>
                        🚀 Publish All ({readyContent.length})
                    </button>
                )}
            </div>

            {/* Connected Accounts */}
            <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🔗 Connected Accounts</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    {accounts.map(account => (
                        <div key={account.id} style={{
                            padding: 20,
                            background: 'var(--bg-glass)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                        }}>
                            <div style={{
                                width: 48,
                                height: 48,
                                borderRadius: 'var(--radius-md)',
                                background: account.platform === 'youtube' ? 'rgba(255, 0, 0, 0.15)' : 'rgba(0, 210, 255, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 24,
                            }}>
                                {account.platform === 'youtube' ? '📺' : '🎵'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>{account.name}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{account.platform}</div>
                            </div>
                            <span className={`badge ${account.connected ? 'badge-success' : 'badge-danger'}`}>
                                {account.connected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>
                    ))}
                    <div style={{
                        padding: 20,
                        background: 'var(--bg-glass)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px dashed var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        fontSize: 14,
                        minHeight: 88,
                    }}>
                        ➕ Add Account
                    </div>
                </div>
            </div>

            {/* Ready to Publish Queue */}
            {readyContent.length > 0 && (
                <div className="card" style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📋 Ready to Publish ({readyContent.length})</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {readyContent.map(item => (
                            <div key={item.id} className="activity-item" style={{ alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: 14, fontWeight: 600 }}>{item.title}</h4>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                                        {item.platform === 'both' ? '📺 YouTube + 🎵 TikTok' : item.platform === 'youtube' ? '📺 YouTube' : '🎵 TikTok'}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {(item.platform === 'youtube' || item.platform === 'both') && (
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => handlePublish(item.id, 'youtube')}
                                            disabled={publishing === item.id}
                                        >
                                            {publishing === item.id ? <div className="spinner" style={{ width: 12, height: 12 }} /> : '📺 YouTube'}
                                        </button>
                                    )}
                                    {(item.platform === 'tiktok' || item.platform === 'both') && (
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => handlePublish(item.id, 'tiktok')}
                                            disabled={publishing === item.id}
                                        >
                                            {publishing === item.id ? <div className="spinner" style={{ width: 12, height: 12 }} /> : '🎵 TikTok'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Publish History */}
            <div className="card">
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📜 Published History</h3>
                {publishHistory.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📜</div>
                        <h3>No published content yet</h3>
                        <p>Generate and publish content to see history here</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {publishHistory.map(item => (
                            <div key={item.id} className="activity-item" style={{ alignItems: 'center' }}>
                                <div className="activity-icon publish">🚀</div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: 14, fontWeight: 600 }}>{item.title}</h4>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                        {item.publishedUrl && (
                                            <a href={item.publishedUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-tertiary)' }}>
                                                🔗 View Post
                                            </a>
                                        )}
                                        {item.publishedAt && ` • Published ${new Date(item.publishedAt).toLocaleDateString()}`}
                                    </div>
                                </div>
                                <span className="badge badge-success">Published</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
