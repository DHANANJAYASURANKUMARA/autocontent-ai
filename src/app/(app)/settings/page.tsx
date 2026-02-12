'use client';

import { useState, useEffect } from 'react';

interface Settings {
    openaiKey: string;
    youtubeKey: string;
    tiktokKey: string;
    facebookKey: string;
    geminiKey: string;
    grokKey: string;
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
    customBaseUrl: string;
    customKey: string;
    customModel: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        openaiKey: '',
        youtubeKey: '',
        tiktokKey: '',
        facebookKey: '',
        geminiKey: '',
        grokKey: '',
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
    });
    const [keywordsStr, setKeywordsStr] = useState('');
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [activeTab, setActiveTab] = useState<'api' | 'content' | 'video'>('api');
    const [accounts, setAccounts] = useState<any[]>([]);

    useEffect(() => {
        fetchSettings();
        fetchAccounts();
    }, []);

    async function fetchAccounts() {
        try {
            const res = await fetch('/api/accounts');
            const data = await res.json();
            setAccounts(data.accounts || []);
        } catch (err) {
            console.error('Failed to fetch accounts:', err);
        }
    }

    async function toggleConnection(platform: string, currentStatus: boolean, key?: string) {
        try {
            const res = await fetch('/api/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    platform,
                    action: currentStatus ? 'disconnect' : 'connect',
                    apiKey: key
                }),
            });
            const data = await res.json();
            if (data.accounts) setAccounts(data.accounts);
        } catch (err) {
            console.error('Failed to toggle connection:', err);
        }
    }

    async function fetchSettings() {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            setSettings(data);
            setKeywordsStr(data.targetKeywords?.join(', ') || '');
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        }
    }

    async function handleSave() {
        setStatus('saving');
        try {
            const finalSettings = {
                ...settings,
                targetKeywords: keywordsStr.split(',').map(s => s.trim()).filter(s => s !== ''),
            };
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalSettings),
            });
            if (res.ok) {
                setStatus('success');
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>⚙️ Settings</h2>
                    <p>Customize everything from AI behavior to platform connections</p>
                </div>
                <button
                    className={`btn ${status === 'saving' ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={handleSave}
                    disabled={status === 'saving'}
                >
                    {status === 'saving' ? 'Saving...' : status === 'success' ? '✅ Saved!' : '💾 Save Settings'}
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
                    <button className={`tab-btn ${activeTab === 'api' ? 'active' : ''}`} onClick={() => setActiveTab('api')}>🔐 API & Authentication</button>
                    <button className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>✍️ Content & Tone</button>
                    <button className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`} onClick={() => setActiveTab('video')}>🎬 Video & Assets</button>
                </div>

                <div style={{ padding: 24 }}>
                    {activeTab === 'api' && (
                        <div className="fade-in">
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🔑 API Configurations & Connections</h3>

                            <div className="input-group">
                                <label>AI Provider</label>
                                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                                    {[
                                        { id: 'gemini', label: 'Google Gemini' },
                                        { id: 'openai', label: 'OpenAI' },
                                        { id: 'custom', label: 'Custom / Local' }
                                    ].map(p => (
                                        <button
                                            key={p.id}
                                            className={`btn ${settings.aiProvider === p.id ? 'btn-primary' : 'btn-secondary'}`}
                                            onClick={() => setSettings({ ...settings, aiProvider: p.id as any })}
                                            style={{ flex: 1 }}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>

                                {settings.aiProvider === 'gemini' && (
                                    <div className="fade-in">
                                        <label>Google Gemini API Key</label>
                                        <input
                                            type="password"
                                            className="input"
                                            value={settings.geminiKey}
                                            onChange={e => setSettings({ ...settings, geminiKey: e.target.value })}
                                            placeholder="AI_KEY_..."
                                        />
                                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Get a free key from <a href="https://aistudio.google.com/" target="_blank" style={{ color: 'var(--accent-primary)' }}>Google AI Studio</a></p>
                                    </div>
                                )}

                                <div className="fade-in" style={{ marginTop: 16 }}>
                                    <label>xAI (Grok) API Key (for Visuals)</label>
                                    <input
                                        type="password"
                                        className="input"
                                        value={settings.grokKey}
                                        onChange={e => setSettings({ ...settings, grokKey: e.target.value })}
                                        placeholder="xai-..."
                                    />
                                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Used for Imagine (Images) and Grok-powered Videos. Get it from <a href="https://console.x.ai/" target="_blank" style={{ color: 'var(--accent-primary)' }}>xAI Console</a></p>
                                </div>

                                {settings.aiProvider === 'openai' && (
                                    <div className="fade-in">
                                        <label>OpenAI API Key</label>
                                        <input
                                            type="password"
                                            className="input"
                                            value={settings.openaiKey}
                                            onChange={e => setSettings({ ...settings, openaiKey: e.target.value })}
                                            placeholder="sk-..."
                                        />
                                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Get a key from <a href="https://platform.openai.com/" target="_blank" style={{ color: 'var(--accent-primary)' }}>OpenAI Platform</a></p>
                                    </div>
                                )}

                                {settings.aiProvider === 'custom' && (
                                    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        <div>
                                            <label>Base URL</label>
                                            <input
                                                type="text"
                                                className="input"
                                                value={settings.customBaseUrl}
                                                onChange={e => setSettings({ ...settings, customBaseUrl: e.target.value })}
                                                placeholder="https://api.openai.com/v1"
                                            />
                                        </div>
                                        <div>
                                            <label>API Key (Optional)</label>
                                            <input
                                                type="password"
                                                className="input"
                                                value={settings.customKey}
                                                onChange={e => setSettings({ ...settings, customKey: e.target.value })}
                                                placeholder="Bearer Token..."
                                            />
                                        </div>
                                        <div>
                                            <label>Model Name</label>
                                            <input
                                                type="text"
                                                className="input"
                                                value={settings.customModel}
                                                onChange={e => setSettings({ ...settings, customModel: e.target.value })}
                                                placeholder="gpt-3.5-turbo, deepseek-coder, etc."
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <hr style={{ borderColor: 'var(--border-color)', margin: '24px 0' }} />

                            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Social Platforms</h4>

                            {['youtube', 'tiktok', 'facebook'].map(platform => {
                                const account = accounts.find(a => a.platform === platform);
                                const isConnected = account?.connected || false;
                                // We use the specific key from settings for the input value
                                const settingsKey = platform === 'youtube' ? settings.youtubeKey : platform === 'tiktok' ? settings.tiktokKey : settings.facebookKey;
                                const setSettingsKey = (val: string) => {
                                    if (platform === 'youtube') setSettings({ ...settings, youtubeKey: val });
                                    else if (platform === 'tiktok') setSettings({ ...settings, tiktokKey: val });
                                    else if (platform === 'facebook') setSettings({ ...settings, facebookKey: val });
                                };

                                return (
                                    <div key={platform} className="card" style={{ background: 'rgba(255,255,255,0.02)', padding: 16, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ flex: 1, marginRight: 16 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                                <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{platform}</span>
                                                {isConnected && <span className="badge badge-success" style={{ marginLeft: 8, fontSize: 10 }}>Connected</span>}
                                            </div>
                                            <input
                                                type="password"
                                                className="input"
                                                style={{ fontSize: 12, padding: 8 }}
                                                value={settingsKey}
                                                onChange={e => setSettingsKey(e.target.value)}
                                                placeholder={`${platform} API Key / Token`}
                                                disabled={isConnected}
                                            />
                                        </div>
                                        <button
                                            className={`btn ${isConnected ? 'btn-danger' : 'btn-primary'} btn-sm`}
                                            onClick={() => toggleConnection(platform, isConnected, settingsKey)}
                                        >
                                            {isConnected ? 'Disconnect' : 'Connect'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === 'content' && (
                        <div className="fade-in">
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🎭 Customize Tone & Branding</h3>

                            <div className="input-group">
                                <label>Brand Name / Persona</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={settings.brandName}
                                    onChange={e => setSettings({ ...settings, brandName: e.target.value })}
                                    placeholder="e.g. FinanceGuru AI"
                                />
                                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>This will be identified in the content as the author/voice.</p>
                            </div>

                            <div className="input-group">
                                <label>Content Tone</label>
                                <select className="input" value={settings.contentTone} onChange={e => setSettings({ ...settings, contentTone: e.target.value })}>
                                    <option value="Professional & Engaging">Professional & Engaging</option>
                                    <option value="Witty & Sarcastic">Witty & Sarcastic</option>
                                    <option value="Aggressive & Fast-paced">Aggressive & Fast-paced</option>
                                    <option value="Calm & Educational">Calm & Educational</option>
                                    <option value="Hype & Energetic">Hype & Energetic</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Default Content Length</label>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    {['short', 'medium', 'long'].map(l => (
                                        <button
                                            key={l}
                                            className={`btn btn-sm ${settings.contentLength === l ? 'btn-primary' : 'btn-secondary'}`}
                                            onClick={() => setSettings({ ...settings, contentLength: l as any })}
                                            style={{ flex: 1 }}
                                        >
                                            {l.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Target Keywords (comma separated)</label>
                                <textarea
                                    className="input"
                                    style={{ height: 80 }}
                                    value={keywordsStr}
                                    onChange={e => setKeywordsStr(e.target.value)}
                                    placeholder="AI, Innovation, Future, Automation..."
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'video' && (
                        <div className="fade-in">
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🎥 Asset & Visual Preferences</h3>

                            <div className="input-group">
                                <label>Video Resolution</label>
                                <select className="input" value={settings.videoResolution} onChange={e => setSettings({ ...settings, videoResolution: e.target.value as any })}>
                                    <option value="1080p">Full HD (1080p)</option>
                                    <option value="4k">Ultra HD (4K)</option>
                                    <option value="vertical">Vertical (9:16)</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Preferred Language</label>
                                <select className="input" value={settings.videoLanguage} onChange={e => setSettings({ ...settings, videoLanguage: e.target.value })}>
                                    <option value="English">English</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">French</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="German">German</option>
                                </select>
                            </div>

                            <div className="card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border-color)', marginTop: 24, padding: 24 }}>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                        <span style={{ fontSize: 24 }}>🎨</span>
                                        <h4 style={{ fontSize: 16, margin: 0 }}>Visual Branding</h4>
                                    </div>

                                    <div className="input-group">
                                        <label>Primary Font</label>
                                        <select
                                            className="input"
                                            value={settings.font}
                                            onChange={e => setSettings({ ...settings, font: e.target.value })}
                                        >
                                            <option value="Inter">Inter</option>
                                            <option value="Roboto">Roboto</option>
                                            <option value="Poppins">Poppins</option>
                                            <option value="Montserrat">Montserrat</option>
                                            <option value="Open Sans">Open Sans</option>
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label>Brand Accent Color</label>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            <input
                                                type="color"
                                                value={settings.primaryColor}
                                                onChange={e => setSettings({ ...settings, primaryColor: e.target.value })}
                                                style={{ width: 60, height: 40, border: 'none', background: 'transparent', cursor: 'pointer' }}
                                            />
                                            <input
                                                type="text"
                                                className="input"
                                                value={settings.primaryColor}
                                                onChange={e => setSettings({ ...settings, primaryColor: e.target.value })}
                                                placeholder="#000000"
                                                style={{ flex: 1 }}
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label>Background Style</label>
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            {['solid', 'gradient', 'abstract'].map(style => (
                                                <button
                                                    key={style}
                                                    className={`btn btn-sm ${settings.backgroundStyle === style ? 'btn-primary' : 'btn-secondary'}`}
                                                    onClick={() => setSettings({ ...settings, backgroundStyle: style as any })}
                                                    style={{ flex: 1, textTransform: 'capitalize' }}
                                                >
                                                    {style}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .tab-btn {
                    padding: 12px 16px;
                    background: transparent;
                    border: none;
                    border-bottom: 2px solid transparent;
                    color: var(--text-muted);
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                @media (max-width: 600px) {
                    .tab-btn {
                        padding: 10px 8px;
                        font-size: 11px;
                    }
                }
                .tab-btn:hover {
                    color: var(--text-primary);
                    background: rgba(255,255,255,0.02);
                }
                .tab-btn.active {
                    color: var(--accent-primary);
                    border-bottom-color: var(--accent-primary);
                    background: rgba(var(--accent-primary-rgb), 0.05);
                }
                .fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div >
    );
}
