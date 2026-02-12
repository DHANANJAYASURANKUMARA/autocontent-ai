'use client';

import { useState, useEffect } from 'react';

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
    videoUrl?: string;
    thumbnailUrl?: string;
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
    const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ title: '', description: '', script: '' });

    useEffect(() => {
        fetchHistory();
    }, []);

    async function fetchHistory() {
        try {
            const res = await fetch('/api/content');
            const data = await res.json();
            if (Array.isArray(data)) {
                setGenerated(data);
                if (data.length > 0) setSelectedContent(data[0]);
            }
        } catch (err) {
            console.error('Failed to fetch history:', err);
        }
    }

    async function handleClearAll() {
        if (!confirm('Are you sure you want to remove all generated content? This cannot be undone.')) return;
        setStatus({ type: 'loading', message: 'Clearing all content...' });
        try {
            const res = await fetch('/api/content', { method: 'DELETE' });
            if (res.ok) {
                setGenerated([]);
                setSelectedContent(null);
                setStatus({ type: 'success', message: 'All content removed' });
                setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Failed to clear content' });
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this item?')) return;
        try {
            const res = await fetch(`/api/content?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setGenerated(prev => prev.filter(item => item.id !== id));
                if (selectedContent?.id === id) setSelectedContent(null);
            }
        } catch (err) {
            alert('Failed to delete item');
        }
    }

    async function handleGenerate() {
        setIsGenerating(true);
        setPipelineStage(0);
        setStatus({ type: 'loading', message: 'Starting generation pipeline...' });

        const stages = type === 'video' || type === 'shorts'
            ? ['📝 Scripting...', '🎙️ Audio...', '🎨 Visuals...', '🎬 Rendering...', '📦 Finishing...']
            : ['📝 Writing...', '🎨 Designing...', '📦 Finishing...'];

        try {
            for (let i = 0; i < stages.length; i++) {
                setPipelineStage(i);
                setStatus({ type: 'loading', message: stages[i] });
                await new Promise(r => setTimeout(r, 600));
            }

            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ niche, style, platform, type, customTopic: customTopic || undefined, count: batchCount }),
            });

            const data = await res.json();

            if (!res.ok) {
                const errMsg = data.error || 'Generation failed at the server level';
                setStatus({ type: 'error', message: errMsg });
                console.error('[STUDIO] POST failed:', data);
                setTimeout(() => setStatus({ type: 'idle', message: '' }), 10000);
            } else {
                if (Array.isArray(data) && data.length > 0) {
                    setGenerated(prev => [...data, ...prev]);
                    setSelectedContent(data[0]);
                    setStatus({ type: 'success', message: 'Content generated successfully!' });
                    setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
                } else {
                    throw new Error('Server returned empty result. Check your API keys in Settings.');
                }
            }
        } catch (err: any) {
            console.error('[STUDIO] Generation error:', err);
            const friendlyMsg = err.message?.includes('Unexpected token')
                ? 'Server Error: Invalid response format. Possible timeout or API failure.'
                : err.message || 'Network error occurred';
            setStatus({ type: 'error', message: friendlyMsg });
            setTimeout(() => setStatus({ type: 'idle', message: '' }), 10000);
        } finally {
            setIsGenerating(false);
            setPipelineStage(-1);
        }
    }

    async function handleUpdate() {
        if (!selectedContent) return;
        setStatus({ type: 'loading', message: 'Updating content...' });
        try {
            const res = await fetch('/api/content', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedContent.id, updates: editData }),
            });
            if (res.ok) {
                const updatedItem = { ...selectedContent, ...editData };
                setGenerated(prev => prev.map(item => item.id === selectedContent.id ? updatedItem : item));
                setSelectedContent(updatedItem);
                setIsEditing(false);
                setStatus({ type: 'success', message: 'Content updated!' });
                setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Update failed' });
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
                    setSelectedContent(prev => prev ? { ...prev, status: 'published' } : null);
                }
            }
            alert(data.message);
        } catch (err) {
            console.error('Publish failed:', err);
        }
    }

    function startEditing() {
        if (!selectedContent) return;
        setEditData({
            title: selectedContent.title,
            description: selectedContent.description,
            script: selectedContent.script
        });
        setIsEditing(true);
    }

    function handleDownload() {
        if (!selectedContent) return;
        const text = `TITLE: ${selectedContent.title}\n\nDESCRIPTION: ${selectedContent.description}\n\nSCRIPT:\n${selectedContent.script}\n\nHASHTAGS: ${selectedContent.hashtags.join(', ')}`;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedContent.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_content.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async function handleDownloadImage() {
        if (!selectedContent?.imageUrl) return;
        try {
            const res = await fetch(selectedContent.imageUrl);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${selectedContent.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_image.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Image download failed:', err);
            // Fallback: open in new tab
            window.open(selectedContent.imageUrl, '_blank');
        }
    }

    async function handleDownloadVideo() {
        if (!selectedContent?.videoUrl) return;
        try {
            const res = await fetch(selectedContent.videoUrl);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${selectedContent.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_video.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Video download failed:', err);
            window.open(selectedContent.videoUrl, '_blank');
        }
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>🎬 Content Studio</h2>
                    <p>Create AI-powered videos, photos, and posts automatically</p>
                </div>
                {status.message && (
                    <div className="fade-in" style={{
                        padding: '8px 12px',
                        borderRadius: 6,
                        fontSize: 13,
                        background: status.type === 'error' ? 'rgba(255, 50, 50, 0.1)' : 'rgba(50, 255, 50, 0.1)',
                        color: status.type === 'error' ? '#ff4d4d' : '#4dff4d',
                        border: `1px solid ${status.type === 'error' ? '#ff4d4d' : '#4dff4d'}`,
                        marginLeft: 'auto',
                        marginRight: 12
                    }}>
                        {status.message}
                    </div>
                )}
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
                            <div className="progress-fill" style={{ width: `${((pipelineStage + 1) / (type === 'video' || type === 'shorts' ? 5 : 3)) * 100}%` }} />
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
                                {selectedContent.videoUrl ? (
                                    <video
                                        src={selectedContent.videoUrl}
                                        controls
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        poster={selectedContent.thumbnailUrl || selectedContent.imageUrl}
                                    />
                                ) : selectedContent.imageUrl ? (
                                    <img src={selectedContent.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontSize: 48 }}>🎬</span>
                                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>No Preview Available</p>
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                                    <span className="badge badge-info">{selectedContent.type.toUpperCase()}</span>
                                </div>
                            </div>

                            {isEditing ? (
                                <div className="fade-in">
                                    <div className="input-group">
                                        <label>Title</label>
                                        <input className="input" value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} />
                                    </div>
                                    <div className="input-group">
                                        <label>Description</label>
                                        <textarea className="input" style={{ height: 60 }} value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} />
                                    </div>
                                    <div className="input-group">
                                        <label>Script / Body</label>
                                        <textarea className="input" style={{ height: 120 }} value={editData.script} onChange={e => setEditData({ ...editData, script: e.target.value })} />
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleUpdate}>💾 Save Changes</button>
                                        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsEditing(false)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{selectedContent.title}</h4>
                                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{selectedContent.description}</p>

                                    <div style={{ marginBottom: 16 }}>
                                        <div style={{ padding: 12, background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', fontSize: 13, border: '1px solid var(--border-color)', whiteSpace: 'pre-wrap', maxHeight: 150, overflowY: 'auto' }}>
                                            {selectedContent.script}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                                        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={startEditing}>✏️ Edit Content</button>
                                        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleDownload} title="Download as .txt">📥 Download text</button>
                                        {selectedContent.imageUrl && (
                                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleDownloadImage} title="Download Image">🖼️ Download image</button>
                                        )}
                                        {selectedContent.videoUrl && (
                                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleDownloadVideo} title="Download Video">📹 Download video</button>
                                        )}
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
                            )}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>📦 Recently Generated</h3>
                        <button className="btn btn-sm btn-danger" onClick={handleClearAll}>🗑️ Remove All</button>
                    </div>
                    <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
                        {generated.map(item => (
                            <div key={item.id} className="card" style={{ padding: 16, cursor: 'pointer', position: 'relative', border: selectedContent?.id === item.id ? '1px solid var(--accent-primary)' : undefined }} onClick={() => setSelectedContent(item)}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                    style={{ position: 'absolute', top: 8, right: 8, background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: 4 }}
                                    title="Delete"
                                >
                                    ✕
                                </button>
                                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, paddingRight: 20, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</h4>
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
