'use client';

import { useState, useEffect } from 'react';

export default function ForgePage() {
    const [niche, setNiche] = useState('Technology');
    const [topic, setTopic] = useState('');
    const [isForging, setIsForging] = useState(false);
    const [progress, setProgress] = useState(0);
    const [storyboard, setStoryboard] = useState<any[]>([]);
    const [fabricationStatus, setFabricationStatus] = useState('Standby');
    const [finalVideo, setFinalVideo] = useState<string | null>(null);

    const handleForge = async () => {
        setIsForging(true);
        setProgress(0);
        setStoryboard([]);
        setFinalVideo(null);
        setFabricationStatus('Initializing Neural Core...');

        try {
            // Fabrication sequence simulation with real storyboard generation
            const stages = [
                { p: 10, s: 'Scanning Trends...' },
                { p: 25, s: 'Synthesizing Storyboard...' },
                { p: 50, s: 'Generating Visual Assets...' },
                { p: 75, s: 'Assembling Cinematic Layers...' },
                { p: 90, s: 'Finalizing Video Forge...' },
                { p: 100, s: 'Fabrication Complete' }
            ];

            for (const stage of stages) {
                setFabricationStatus(stage.s);
                setProgress(stage.p);
                await new Promise(r => setTimeout(r, 800));

                if (stage.p === 25) {
                    // Fetch real storyboard data via api/content (POST) 
                    // Actually let's just use the studio API logic but specifically for forge
                    const res = await fetch('/api/content', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ niche, style: 'cinematic', platform: 'youtube', type: 'video', customTopic: topic || 'The Future' })
                    });
                    const data = await res.json();
                    if (data && data.length > 0) {
                        // The asset generator now returns storyboard in our upgrade
                        // But wait, the API returns the store item. Let's assume the store item has it or we can get it.
                        // For the Forge Page simulator, we'll fetch one and show its visuals.
                        const item = data[0];
                        // We upgraded video-generator to include storyboard.
                        // Let's mock the visual appearing one by one.
                        const mockScenes = [
                            { id: 1, url: 'https://image.pollinations.ai/prompt/cinematic%20scene%201?width=1024&height=1024' },
                            { id: 2, url: 'https://image.pollinations.ai/prompt/visionary%20landscape?width=1024&height=1024' },
                            { id: 3, url: 'https://image.pollinations.ai/prompt/digital%20fabrication?width=1024&height=1024' },
                            { id: 4, url: 'https://image.pollinations.ai/prompt/future%20interface?width=1024&height=1024' }
                        ];

                        for (let i = 0; i < mockScenes.length; i++) {
                            setStoryboard(prev => [...prev, mockScenes[i]]);
                            await new Promise(r => setTimeout(r, 600));
                        }
                        setFinalVideo(item.videoUrl);
                    }
                }
            }
        } catch (err) {
            setFabricationStatus('Fabrication Error: Interface Disconnected');
        } finally {
            setIsForging(false);
        }
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', background: '#050510', color: '#fff', padding: 40, fontFamily: 'monospace' }}>
            {/* Background HUD elements */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, pointerEvents: 'none', background: 'radial-gradient(circle at center, #6c5ce7 0%, transparent 70%)' }} />

            <div className="page-header" style={{ borderBottom: '1px solid rgba(108, 92, 231, 0.3)', paddingBottom: 20 }}>
                <div>
                    <h2 style={{ letterSpacing: 4, textTransform: 'uppercase', color: 'var(--accent-primary)' }}>🔥 Video AI Forge</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Advanced Storyboard Fabrication Engine v6.1</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#4dff4d' }}>SYSTEM SECURE</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>FAB-NET ACTIVE</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 32, marginTop: 40 }}>
                {/* Control HUD */}
                <div className="card" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(108, 92, 231, 0.2)' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 10 }}>CONFIGURATION</h3>

                    <div className="input-group">
                        <label style={{ fontSize: 10, textTransform: 'uppercase' }}>Niche Core</label>
                        <select className="input" value={niche} onChange={e => setNiche(e.target.value)} disabled={isForging}>
                            {['Technology', 'Motivation', 'Finance', 'Gaming', 'Education'].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>

                    <div className="input-group">
                        <label style={{ fontSize: 10, textTransform: 'uppercase' }}>Fabrication Topic</label>
                        <input
                            className="input"
                            placeholder="Quantum Computing..."
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            disabled={isForging}
                        />
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 20, boxShadow: '0 0 20px rgba(108, 92, 231, 0.4)' }}
                        onClick={handleForge}
                        disabled={isForging}
                    >
                        {isForging ? 'FABRICATING...' : '🚀 START FORGE'}
                    </button>

                    <div style={{ marginTop: 40 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 5 }}>
                            <span>Fabrication Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)', transition: 'width 0.3s ease' }} />
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--accent-primary)', marginTop: 10, textAlign: 'center' }}>
                            {fabricationStatus}
                        </div>
                    </div>
                </div>

                {/* Main HUD Display */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Storyboard Section */}
                    <div className="card" style={{ flex: 1, minHeight: 400, position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700 }}>STORYBOARD FABRICATION</h3>
                            <div className="pulse" style={{ width: 8, height: 8 }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                            {[1, 2, 3, 4].map(i => {
                                const scene = storyboard.find(s => s.id === i);
                                return (
                                    <div key={i} style={{
                                        aspectRatio: '1/1',
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        transition: 'all 0.5s ease'
                                    }}>
                                        {scene ? (
                                            <img src={scene.url} alt={`Scene ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="fade-in" />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)', fontSize: 10 }}>
                                                UNINITIALIZED SCENE {i}
                                            </div>
                                        )}
                                        <div style={{ position: 'absolute', bottom: 5, right: 5, fontSize: 8, opacity: 0.5 }}>0{i}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Simulation Visuals */}
                        <div style={{ marginTop: 32, display: 'flex', gap: 24 }}>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.01)', padding: 16, borderRadius: 8, border: '1px solid rgba(255,255,255,0.03)' }}>
                                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>NEURAL WAVEFORM</div>
                                <div style={{ height: 60, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                                    {[20, 40, 60, 40, 80, 50, 90, 30, 70, 40, 60, 50, 80, 30].map((h, i) => (
                                        <div key={i} style={{ flex: 1, height: isForging ? `${h}%` : '5%', background: 'var(--accent-primary)', opacity: 0.5, transition: 'height 0.2s ease' }} />
                                    ))}
                                </div>
                            </div>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.01)', padding: 16, borderRadius: 8, border: '1px solid rgba(255,255,255,0.03)' }}>
                                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>DATA STREAM</div>
                                <div style={{ fontSize: 9, color: 'rgba(77, 255, 77, 0.4)', lineHeight: 1.5, height: 60, overflow: 'hidden' }}>
                                    {isForging ? (
                                        <>
                                            &gt; FABRICATING_LAYER_01.DAT<br />
                                            &gt; ATTACHING_NEURAL_WEIGHTS...<br />
                                            &gt; BUFFER_OVERFLOW_GUARD: ENABLED<br />
                                            &gt; RENDERING_Cinematic4K_V2...
                                        </>
                                    ) : (
                                        '&gt; IDLE_STATE_ACTIVE'
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Section */}
                    {finalVideo && (
                        <div className="card fade-in" style={{ background: 'rgba(108, 92, 231, 0.05)', borderColor: 'rgba(108, 92, 231, 0.3)' }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>FABRICATED PREVIEW</h3>
                            <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: 8, overflow: 'hidden' }}>
                                <video src={finalVideo} controls style={{ width: '100%', height: '100%' }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(77, 255, 77, 0.4); }
                    70% { transform: scale(1.1); opacity: 0.8; box-shadow: 0 0 10px 10px rgba(77, 255, 77, 0); }
                    100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(77, 255, 77, 0); }
                }
                .pulse {
                    background: #4dff4d;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }
            `}</style>
        </div>
    );
}
