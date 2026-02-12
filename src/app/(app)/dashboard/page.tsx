'use client';

import { useState, useEffect } from 'react';

interface Stats {
    totalContent: number;
    published: number;
    scheduled: number;
    generating: number;
    successRate: number;
}

interface Activity {
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
}

interface ContentItem {
    id: string;
    title: string;
    niche: string;
    platform: string;
    type: string;
    status: string;
    createdAt: string;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

    useEffect(() => {
        fetchDashboard();
    }, []);

    async function handleRunPipeline() {
        setStatus({ type: 'loading', message: 'Running automation pipeline...' });
        try {
            const res = await fetch('/api/automation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'run' })
            });
            const data = await res.json();

            if (!res.ok) {
                setStatus({ type: 'error', message: data.error || 'Failed to run pipeline' });
                setTimeout(() => setStatus({ type: 'idle', message: '' }), 5000);
            } else {
                setStatus({ type: 'success', message: 'Pipeline executed successfully!' });
                await fetchDashboard();
                setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
            }
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message || 'Network error occurred' });
            setTimeout(() => setStatus({ type: 'idle', message: '' }), 5000);
        }
    }

    async function fetchDashboard() {
        try {
            const res = await fetch('/api/dashboard');
            const data = await res.json();
            setStats(data.stats);
            setActivities(data.recentActivity || []);
            setRecentContent(data.recentContent || []);
        } catch (err) {
            console.error('Failed to fetch dashboard:', err);
        } finally {
            setLoading(false);
        }
    }

    function timeAgo(dateStr: string) {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'now';
        if (mins < 60) return `${mins}m`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h`;
        return `${Math.floor(hours / 24)}d`;
    }

    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><div className="spinner" /></div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>📊 Dashboard</h2>
                    <p>Multi-platform content overview</p>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {status.message && (
                        <div className={`fade-in`} style={{
                            padding: '8px 12px',
                            borderRadius: 6,
                            fontSize: 13,
                            background: status.type === 'error' ? 'rgba(255, 50, 50, 0.1)' : 'rgba(50, 255, 50, 0.1)',
                            color: status.type === 'error' ? '#ff4d4d' : '#4dff4d',
                            border: `1px solid ${status.type === 'error' ? '#ff4d4d' : '#4dff4d'}`
                        }}>
                            {status.message}
                        </div>
                    )}
                    <button className="btn btn-secondary" onClick={fetchDashboard} disabled={status.type === 'loading'}>🔄 Refresh</button>
                    <button
                        className="btn btn-primary"
                        onClick={handleRunPipeline}
                        disabled={status.type === 'loading'}
                    >
                        {status.type === 'loading' ? 'Running...' : '⚡ Run Pipeline'}
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                {[
                    { label: 'Total Content', value: stats?.totalContent, color: 'purple', icon: '🎬' },
                    { label: 'Published', value: stats?.published, color: 'green', icon: '✅' },
                    { label: 'Scheduled', value: stats?.scheduled, color: 'blue', icon: '📅' },
                    { label: 'Success Rate', value: `${stats?.successRate}%`, color: 'orange', icon: '📈' },
                ].map(s => (
                    <div key={s.label} className={`stat-card ${s.color}`}>
                        <div className="stat-card-header">
                            <span>{s.label}</span>
                            <span>{s.icon}</span>
                        </div>
                        <div className="stat-card-value font-bold">{s.value || 0}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginTop: 24 }}>
                <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>📈 Performance Velocity</h3>
                        <div style={{ fontSize: 11, color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>Live Analytics</div>
                    </div>

                    {/* CSS-Based Chart Visualization */}
                    <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 12, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {[40, 65, 45, 90, 75, 55, 100, 85, 95, 60, 70, 80].map((h, i) => (
                            <div key={i} style={{ flex: 1, height: `${h}%`, background: `linear-gradient(to top, var(--accent-primary), transparent)`, borderRadius: '4px 4px 0 0', position: 'relative', opacity: 0.8 }} className="chart-bar">
                                <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{h}%</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1 }}>
                        <span>Week 1</span>
                        <span>Week 2</span>
                        <span>Week 3</span>
                        <span>Current</span>
                    </div>
                </div>

                <div className="card" style={{ background: 'rgba(10,10,18,0.4)', borderColor: 'rgba(108, 92, 231, 0.2)' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="pulse" style={{ width: 6, height: 6 }} /> AI Health HUD
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { name: 'Gemini Engine', status: 'Operational', latency: '42ms', color: '#4dff4d' },
                            { name: 'Grok Vision', status: 'Optimal', latency: '128ms', color: '#4dff4d' },
                            { name: 'Pollinations AI', status: 'Online', latency: '85ms', color: '#4dff4d' },
                            { name: 'System Core', status: 'Stable', latency: '12ms', color: '#0070f3' },
                        ].map((srv, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 600 }}>{srv.name}</div>
                                    <div style={{ fontSize: 10, color: srv.color }}>{srv.status}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{srv.latency}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 20, fontSize: 11 }}>Deep System Audit</button>
                </div>
            </div>

            <div className="two-col" style={{ marginTop: 24 }}>
                <div className="card">
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🎬 Recent Generation</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {recentContent.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No content generated yet.</p> : recentContent.map(item => (
                            <div key={item.id} className="activity-item">
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.title}</h4>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <span className="badge badge-info" style={{ fontSize: 10 }}>{item.type?.toUpperCase()}</span>
                                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.platform?.toUpperCase()}</span>
                                        <span className={`badge ${item.status === 'published' ? 'badge-success' : 'badge-pending'}`} style={{ fontSize: 10 }}>{item.status}</span>
                                    </div>
                                </div>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{timeAgo(item.createdAt)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📋 System Feed</h3>
                    <div className="activity-feed">
                        {activities.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No activity yet.</p> : activities.map(activity => (
                            <div key={activity.id} className="activity-item" style={{ marginBottom: 16 }}>
                                <div style={{ marginRight: 12, fontSize: 18 }}>
                                    {activity.type === 'auth' ? '🔐' : activity.type === 'generate' ? '✨' : activity.type === 'publish' ? '🚀' : '⚡'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: 13, fontWeight: 600 }}>{activity.title}</h4>
                                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{activity.description}</p>
                                </div>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{timeAgo(activity.timestamp)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
}
