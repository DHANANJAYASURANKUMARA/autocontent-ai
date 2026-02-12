'use client';

import { useState, useEffect } from 'react';

const AVAILABLE_NICHES = ['Technology', 'Motivation', 'Finance', 'Gaming', 'Education', 'Fitness', 'Comedy', 'Cooking', 'Travel', 'Science'];
const STYLES = ['educational', 'entertaining', 'tutorial', 'motivational', 'storytelling'];
const AVAILABLE_TYPES = [
    { value: 'video', label: '📹 Video' },
    { value: 'shorts', label: '📱 Shorts' },
    { value: 'photo', label: '🖼️ Photo' },
    { value: 'text', label: '✍️ Text' },
];

interface AutomationConfig {
    enabled: boolean;
    niches: string[];
    style: string;
    platforms: string[];
    types: string[];
    frequency: string;
    bulkCount: number;
    rotateNiches: boolean;
}

export default function AutomationPage() {
    const [config, setConfig] = useState<AutomationConfig>({
        enabled: false,
        niches: ['Technology'],
        style: 'educational',
        platforms: ['youtube', 'tiktok'],
        types: ['video', 'shorts'],
        frequency: 'daily',
        bulkCount: 5,
        rotateNiches: true,
    });
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);
    const [runLog, setRunLog] = useState<string[]>([]);

    useEffect(() => {
        fetchConfig();
    }, []);

    async function fetchConfig() {
        try {
            const res = await fetch('/api/automation');
            const data = await res.json();
            if (data.automation) setConfig(data.automation);
        } catch (err) {
            console.error('Failed to fetch:', err);
        } finally {
            setLoading(false);
        }
    }

    // Polling for automation
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (config.enabled) {
            interval = setInterval(async () => {
                // Check if we need to run pipeline based on frequency
                // For demo purposes, if enabled, we randomly trigger a run every 60 seconds if not running
                // In a real app, we'd check lastRun time vs frequency
                if (!running && Math.random() > 0.7) {
                    await runPipeline();
                }
            }, 10000); // Check every 10 seconds
        }
        return () => clearInterval(interval);
    }, [config.enabled, running]);

    async function toggleAutomation() {
        try {
            const res = await fetch('/api/automation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'toggle' }),
            });
            const data = await res.json();
            if (data.automation) setConfig(data.automation);
        } catch (err) {
            console.error('Toggle failed:', err);
        }
    }

    async function updateConfig(updates: Partial<AutomationConfig>) {
        try {
            const res = await fetch('/api/automation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update', ...updates }),
            });
            const data = await res.json();
            if (data.automation) setConfig(data.automation);
        } catch (err) {
            console.error('Update failed:', err);
        }
    }

    async function runPipeline(count: number = 1) {
        setRunning(true);
        setRunLog(['🔍 Initializing Bulk Pipeline...', `🤖 Generation target: ${count} items`]);

        try {
            const res = await fetch('/api/automation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'run', count }),
            });
            const data = await res.json();

            if (data.results) {
                setRunLog(prev => [...prev, `✅ Bulk Generation Successful (${data.results.length} items)`]);
                data.results.forEach((item: any, i: number) => {
                    setTimeout(() => {
                        setRunLog(prev => [...prev, `✨ [Item ${i + 1}] ${item.title} (${item.type})`]);
                    }, i * 200);
                });
            } else if (data.generated) {
                setRunLog(prev => [...prev, `✅ Pipeline Complete: ${data.generated.title}`]);
            }
        } catch (err) {
            setRunLog(prev => [...prev, '❌ Pipeline error occurred']);
        } finally {
            setRunning(false);
        }
    }

    function toggleInArray(arr: string[], val: string) {
        return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
    }

    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><div className="spinner" /></div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>⚡ Automation</h2>
                    <p>Manage your autonomous multi-modal pipeline</p>
                </div>
                <button className="btn btn-primary" onClick={() => runPipeline(config.bulkCount)} disabled={running}>
                    {running ? 'Running...' : `▶️ Run Bulk (${config.bulkCount})`}
                </button>
            </div>

            <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                            {config.enabled ? '🟢 Status: Active' : '🔴 Status: Paused'}
                        </h3>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                            Automatically posting to {config.platforms.join(', ')}
                        </p>
                        {config.enabled && (
                            <p style={{ fontSize: 12, color: 'var(--accent-primary)', marginTop: 4 }}>
                                ⏱️ Next run scheduled in: {Math.floor(Math.random() * 10) + 1} mins
                            </p>
                        )}
                    </div>
                    <button className={`btn ${config.enabled ? 'btn-danger' : 'btn-primary'} btn-lg`} onClick={toggleAutomation}>
                        {config.enabled ? '⏸ Pause Pipeline' : '▶️ Start Pipeline'}
                    </button>
                </div>
            </div>

            <div className="two-col">
                <div className="card">
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>⚙️ Pipeline Config</h3>

                    <div className="input-group">
                        <label>Content Types</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {AVAILABLE_TYPES.map(t => (
                                <button key={t.value} className={`btn btn-sm ${config.types?.includes(t.value) ? 'btn-primary' : 'btn-secondary'}`} onClick={() => updateConfig({ types: toggleInArray(config.types || [], t.value) })}>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Target Platforms</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {['youtube', 'tiktok', 'facebook'].map(p => (
                                <button key={p} className={`btn btn-sm ${config.platforms.includes(p) ? 'btn-primary' : 'btn-secondary'}`} onClick={() => updateConfig({ platforms: toggleInArray(config.platforms, p) })}>
                                    {p.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Niches</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxHeight: 120, overflowY: 'auto', padding: 8, background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                            {AVAILABLE_NICHES.map(n => (
                                <button key={n} className={`btn btn-sm ${config.niches.includes(n) ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: 10 }} onClick={() => updateConfig({ niches: toggleInArray(config.niches, n) })}>
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Frequency</label>
                        <select className="input" value={config.frequency} onChange={e => updateConfig({ frequency: e.target.value })}>
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                        </select>
                    </div>

                    <div className="input-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(108, 92, 231, 0.05)', padding: 12, borderRadius: 8 }}>
                        <div>
                            <label style={{ margin: 0 }}>Smart Niche Rotation</label>
                            <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Cycle through selected niches automatically</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={config.rotateNiches}
                            onChange={e => updateConfig({ rotateNiches: e.target.checked })}
                            style={{ width: 20, height: 20 }}
                        />
                    </div>

                    <div className="input-group">
                        <label>Bulk Generation Count ({config.bulkCount})</label>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            className="input"
                            value={config.bulkCount}
                            onChange={e => updateConfig({ bulkCount: parseInt(e.target.value) })}
                        />
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📋 Pipeline Console</h3>
                    {runLog.length === 0 ? (
                        <div className="empty-state"><h3>Console Ready</h3><p>Trigger a run to see live logs</p></div>
                    ) : (
                        <div style={{ padding: 16, background: '#0a0a12', borderRadius: 8, border: '1px solid var(--border-color)', fontFamily: 'monospace', fontSize: 12, lineHeight: 2, height: 350, overflowY: 'auto' }}>
                            {runLog.map((log, i) => (
                                <div key={i} style={{ color: log.includes('✅') ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                                    {`> ${log}`}
                                </div>
                            ))}
                            {running && <div className="spinner" style={{ width: 12, height: 12, marginTop: 8 }} />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
