'use client';

import { useState } from 'react';

const NICHES = ['Technology', 'Motivation', 'Finance', 'Gaming', 'Education', 'Fitness', 'Comedy', 'Cooking', 'Travel', 'Science'];
const STYLES = ['educational', 'entertaining', 'tutorial', 'motivational', 'storytelling'];
const TYPES = [
    { value: 'video', label: '📹 Video', icon: '🎬' },
    { value: 'shorts', label: '📱 Shorts', icon: '📱' },
    { value: 'photo', label: '🖼️ Photo', icon: '🖼️' },
    { value: 'text', label: '✍️ Text', icon: '📄' },
];

interface GeneratedItem {
    id: string;
    title: string;
    description: string;
    script: string;
    hashtags: string[];
    niche: string;
    platform: string;
    type: string;
    status: string;
    imageUrl?: string;
}

export default function StudioPage() {
    const [niche, setNiche] = useState('Technology');
    const [style, setStyle] = useState('educational');
    const [platform, setPlatform] = useState<string>('all');
    const [type, setType] = useState<string>('video');
    const [customTopic, setCustomTopic] = useState('');
    const [batchCount, setBatchCount] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generated, setGenerated] = useState<GeneratedItem[]>([]);
    const [pipelineStage, setPipelineStage] = useState(-1);
    const [selectedContent, setSelectedContent] = useState<GeneratedItem | null>(null);

    async function handleGenerate() {
        setIsGenerating(true);
        setPipelineStage(0);

        const stages = type === 'video' || type === 'shorts'
            ? ['📝 Scripting...', '🎙️ Audio...', '🎨 Visuals...', '🎬 Rendering...', '📦 Finishing...']
            : ['📝 Writing...', '🎨 Designing...', '📦 Finishing...'];

        for (let i = 0; i < stages.length; i++) {
            setPipelineStage(i);
            await new Promise(r => setTimeout(r, 600));
        }

        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ niche, style, platform, type, customTopic: customTopic || undefined, count: batchCount }),
            });
            const items = await res.json();
            if (Array.isArray(items)) {
                setGenerated(prev => [...items, ...prev]);
                setSelectedContent(items[0]);
            }
        } catch (err) {
            console.error('Generation failed:', err);
        } finally {
            setIsGenerating(false);
            setPipelineStage(-1);
        }
    }

    async function handlePublish(contentId: string, targetPlatform: string) {
        try {
            const res = await fetch('/api/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contentId, platform: targetPlatform }),
            });
            const data = await res.json();
            if (data.success) {
                setGenerated(prev => prev.map(g => g.id === contentId ? { ...g, status: 'published' } : g));
                if (selectedContent?.id === contentId) {
                    setSelectedContent({ ...selectedContent, status: 'published' });
                }
            }
            alert(data.message);
        } catch (err) {
            console.error('Publish failed:', err);
        }
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>🎬 Content Studio</h2>
                    <p>Create AI-powered videos, photos, and posts automatically</p>
                </div>
            </div>

            <div className="two-col">
                <div className="card">
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>⚡ Create Content</h3>

                    <div className="input-group">
                        <label>Content Type</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {TYPES.map(t => (
                                <button
                                    key={t.value}
                                    className={`btn ${type === t.value ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setType(t.value)}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Target Platform</label>
                        <select className="input" value={platform} onChange={e => setPlatform(e.target.value)}>
                            <option value="all">All Platforms</option>
                            <option value="youtube">YouTube</option>
                            <option value="tiktok">TikTok</option>
                            <option value="facebook">Facebook</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Niche & Style</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <select className="input" style={{ flex: 1 }} value={niche} onChange={e => setNiche(e.target.value)}>
                                {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <select className="input" style={{ flex: 1 }} value={style} onChange={e => setStyle(e.target.value)}>
                                {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Topic</label>
                        <input className="input" placeholder="AI chooses if empty..." value={customTopic} onChange={e => setCustomTopic(e.target.value)} />
                    </div>

                    <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? 'Generating...' : `🚀 Generate ${type.toUpperCase()}`}
                    </button>

                    {isGenerating && (
                        <div className="progress-bar" style={{ marginTop: 12 }}>
                            <div className="progress-fill" style={{ width: `${((pipelineStage + 1) / 5) * 100}%` }} />
                        </div>
                    )}
                </div>

                <div className="card">
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>👁️ Preview</h3>
                    {selectedContent ? (
                        <div>
                            <div style={{
                                width: '100%',
                                aspectRatio: selectedContent.type === 'shorts' ? '9/16' : selectedContent.type === 'photo' ? '1/1' : '16/9',
                                background: 'var(--bg-glass)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 16,
                                border: '1px solid var(--border-color)',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                {selectedContent.imageUrl ? (
                                    <img src={selectedContent.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontSize: 48 }}>🎬</span>
                                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Video Placeholder</p>
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                                    <span className="badge badge-info">{selectedContent.type.toUpperCase()}</span>
                                </div>
                            </div>

                            <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{selectedContent.title}</h4>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{selectedContent.description}</p>

                            <div style={{ marginBottom: 16 }}>
                                <div style={{ padding: 12, background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', fontSize: 13, border: '1px solid var(--border-color)', whiteSpace: 'pre-wrap', maxHeight: 150, overflowY: 'auto' }}>
                                    {selectedContent.script}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handlePublish(selectedContent.id, 'facebook')}>
                                    👥 Facebook
                                </button>
                                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handlePublish(selectedContent.id, 'youtube')}>
                                    📺 YouTube
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>Generate content to preview</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Explorer */}
            {generated.length > 0 && (
                <div className="card" style={{ marginTop: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📦 Recently Generated</h3>
                    <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
                        {generated.map(item => (
                            <div key={item.id} className="card" style={{ padding: 16, cursor: 'pointer', border: selectedContent?.id === item.id ? '1px solid var(--accent-primary)' : undefined }} onClick={() => setSelectedContent(item)}>
                                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</h4>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <span className="badge badge-info" style={{ fontSize: 10 }}>{item.type.toUpperCase()}</span>
                                    <span className="badge badge-success" style={{ fontSize: 10 }}>{item.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
