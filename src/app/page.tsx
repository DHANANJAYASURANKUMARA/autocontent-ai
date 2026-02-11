'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="landing-container" style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
            {/* Header / Nav */}
            <nav style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                padding: scrolled ? '20px 5%' : '30px 5%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 1000,
                transition: 'all 0.3s',
                background: scrolled ? 'rgba(10, 10, 18, 0.9)' : 'transparent',
                backdropFilter: scrolled ? 'blur(10px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, background: 'var(--accent-primary)', borderRadius: 8, display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>A</div>
                    <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>AutoContent <span style={{ color: 'var(--accent-primary)' }}>AI</span></span>
                </div>
                <div style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
                    <a href="#features" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', transition: '0.2s' }}>Features</a>
                    <a href="#pricing" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', transition: '0.2s' }}>Pricing</a>
                    <Link href="/dashboard" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: 100 }}>Log In</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{
                padding: '200px 5% 100px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Floating Glows */}
                <div style={{ position: 'absolute', top: '10%', left: '20%', width: 400, height: 400, background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)', opacity: 0.15, filter: 'blur(80px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: 500, height: 500, background: 'radial-gradient(circle, #6c5ce7 0%, transparent 70%)', opacity: 0.15, filter: 'blur(100px)', pointerEvents: 'none' }} />

                <div className="fade-in" style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        borderRadius: 100,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--accent-primary)',
                        marginBottom: 24,
                        textTransform: 'uppercase',
                        letterSpacing: 2
                    }}>
                        ✨ AI-Powered Content Revolution
                    </div>
                    <h1 style={{ fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: -2, marginBottom: 24 }}>
                        Automate Your <span style={{ background: 'linear-gradient(90deg, #fff, var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Social Empire</span>
                    </h1>
                    <p style={{ fontSize: 20, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
                        Generate, schedule, and publish viral content across YouTube, TikTok, and Facebook with a single click. No more manual edits. Just growth.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                        <Link href="/dashboard" className="btn btn-primary" style={{ padding: '16px 40px', borderRadius: 100, fontSize: 16, fontWeight: 700, boxShadow: '0 0 30px rgba(var(--accent-primary-rgb), 0.3)' }}>Start Growing for Free</Link>
                        <button className="btn btn-secondary" style={{ padding: '16px 40px', borderRadius: 100, fontSize: 16, fontWeight: 700 }}>Watch Demo</button>
                    </div>
                </div>

                {/* Dashboard Preview */}
                <div className="fade-in-delayed" style={{ marginTop: 80, padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', maxWidth: 1000, margin: '80px auto 0' }}>
                    <div style={{ width: '100%', height: 500, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
                        <p>Application Dashboard Preview (Glass Interface)</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" style={{ padding: '100px 5%' }}>
                <div style={{ textAlign: 'center', marginBottom: 60 }}>
                    <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Everything you need to <span style={{ color: 'var(--accent-primary)' }}>go viral</span></h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>Leverage the world's most powerful AI models to automate your content pipeline from ideation to distribution.</p>
                </div>
                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                    {[
                        { title: 'Multi-Model AI', desc: 'Switch between Gemini, OpenAI, or local LLMs for the perfect script.', icon: '🧠' },
                        { title: 'One-Click Pipeline', desc: 'Pick your niche, click run, and watch your content queue grow.', icon: '⚡' },
                        { title: 'Visual Branding', desc: 'Custom fonts, colors, and styles applied automatically to every asset.', icon: '🎨' },
                        { title: 'Auto-Publishing', desc: 'Schedule weeks of content in minutes across all platforms.', icon: '🚀' },
                        { title: 'Real-time Analytics', desc: 'Track your growth and optimize your content strategy with ease.', icon: '📈' },
                        { title: 'Smart Niche Selection', desc: 'AI-driven topic generation that targets the latest trends in your niche.', icon: '🎯' }
                    ].map((f, i) => (
                        <div key={i} className="card" style={{ padding: 32, transition: 'all 0.3s', cursor: 'default' }}>
                            <div style={{ fontSize: 40, marginBottom: 20 }}>{f.icon}</div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" style={{ padding: '100px 5%', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ textAlign: 'center', marginBottom: 60 }}>
                    <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Choose your <span style={{ color: 'var(--accent-primary)' }}>Growth Plan</span></h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Simple pricing for content creators of all sizes.</p>
                </div>
                <div className="stats-grid" style={{ maxWidth: 1000, margin: '0 auto', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
                    {[
                        { name: 'Starter', price: '$0', features: ['3 Videos / week', 'Single AI Provider', 'Basic Branding', 'Manual Scheduling'] },
                        { name: 'Pro', price: '$29', features: ['Unlimited Videos', 'All AI Providers', 'Full Visual Branding', 'Auto-Publishing', 'Priority Support'], popular: true },
                        { name: 'Agency', price: '$99', features: ['Multi-Account Mgmt', 'API Access', 'Custom AI Training', 'White-label Support'] }
                    ].map((p, i) => (
                        <div key={i} className="card" style={{
                            padding: 40,
                            border: p.popular ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                            transform: p.popular ? 'scale(1.05)' : 'none',
                            position: 'relative'
                        }}>
                            {p.popular && <span style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-primary)', color: '#fff', padding: '4px 12px', borderRadius: 100, fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>Most Popular</span>}
                            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{p.name}</h3>
                            <div style={{ marginBottom: 32 }}>
                                <span style={{ fontSize: 48, fontWeight: 900 }}>{p.price}</span>
                                <span style={{ color: 'var(--text-muted)' }}>/month</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {p.features.map((f, j) => (
                                    <li key={j} style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ color: 'var(--accent-primary)' }}>✓</span> {f}
                                    </li>
                                ))}
                            </ul>
                            <button className={`btn ${p.popular ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', borderRadius: 100, padding: 14, fontWeight: 700 }}>Get Started</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '80px 5% 40px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'var(--bg-dark)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40, marginBottom: 40 }}>
                    <div style={{ maxWidth: 300 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <div style={{ width: 32, height: 32, background: 'var(--accent-primary)', borderRadius: 8, display: 'grid', placeItems: 'center', fontWeight: 'bold' }}>A</div>
                            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>AutoContent AI</span>
                        </div>
                        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>The world's first fully automated AI content platform. Built for the future of social media growth.</p>
                    </div>
                    <div style={{ display: 'flex', gap: 80 }}>
                        <div>
                            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20 }}>Product</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: 'var(--text-muted)' }}>
                                <a href="#">Features</a>
                                <a href="#">Dashboard</a>
                                <a href="#">API</a>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20 }}>Company</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: 'var(--text-muted)' }}>
                                <a href="#">About</a>
                                <a href="#">Blog</a>
                                <a href="#">Support</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
                    <p>© 2026 AutoContent AI. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: 24 }}>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                .landing-container {
                    scroll-behavior: smooth;
                }
                .fade-in {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                .fade-in-delayed {
                    animation: fadeInUp 0.8s ease-out 0.3s forwards;
                    opacity: 0;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
