'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observerRef.current?.observe(el));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observerRef.current?.disconnect();
        };
    }, []);

    return (
        <div className="landing-container" style={{ minHeight: '100vh', background: '#05050a', color: '#fff', overflowX: 'hidden' }}>
            {/* Alive Background */}
            <div className="alive-bg" />

            {/* Navigation */}
            <nav style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                padding: scrolled ? '16px 0' : '32px 0',
                zIndex: 1000,
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                background: scrolled || mobileMenuOpen ? 'rgba(5, 5, 10, 0.8)' : 'transparent',
                backdropFilter: scrolled || mobileMenuOpen ? 'blur(20px)' : 'none',
                borderBottom: scrolled || mobileMenuOpen ? '1px solid rgba(255,255,255,0.08)' : 'none'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div className="animate-float-premium" style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', borderRadius: 12, display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: 22, boxShadow: '0 0 30px rgba(108, 92, 231, 0.4)' }}>A</div>
                        <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1 }}>AutoContent <span style={{ color: 'var(--accent-primary)' }}>AI</span></span>
                    </div>

                    <div className="desktop-nav" style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
                        <a href="#features" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', transition: '0.3s', textTransform: 'uppercase', letterSpacing: 1.5 }}>Features</a>
                        <a href="#pricing" style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', transition: '0.3s', textTransform: 'uppercase', letterSpacing: 1.5 }}>Pricing</a>
                        <Link href="/dashboard" className="btn btn-primary" style={{ padding: '12px 32px', borderRadius: 100, fontSize: 14, fontWeight: 700, boxShadow: '0 10px 30px rgba(108, 92, 231, 0.3)' }}>Launch Dashboard</Link>
                    </div>

                    <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: '#fff', fontSize: 28 }}>
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{ padding: '260px 0 120px', position: 'relative' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className="reveal active" style={{ maxWidth: 1000, margin: '0 auto' }}>
                        <div className="animate-float-premium" style={{
                            display: 'inline-block',
                            padding: '10px 28px',
                            borderRadius: 100,
                            background: 'rgba(108, 92, 231, 0.1)',
                            border: '1px solid rgba(108, 92, 231, 0.2)',
                            fontSize: 13,
                            fontWeight: 700,
                            color: 'var(--accent-primary)',
                            marginBottom: 40,
                            textTransform: 'uppercase',
                            letterSpacing: 3
                        }}>
                            ✨ The Future of Content is Autonomous
                        </div>
                        <h1 style={{ fontSize: 'clamp(48px, 10vw, 110px)', fontWeight: 950, lineHeight: 0.9, letterSpacing: -4, marginBottom: 40 }}>
                            Generate Viral <br /> <span style={{ background: 'linear-gradient(180deg, #fff 30%, #666)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Content Instantly</span>
                        </h1>
                        <p style={{ fontSize: 'clamp(18px, 4vw, 24px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: 64, maxWidth: 800, margin: '0 auto 64px' }}>
                            A high-performance engine designed for the next generation of creators. Automate your entire social presence with a single click.
                        </p>
                        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/dashboard" className="btn btn-primary" style={{ padding: '24px 64px', borderRadius: 100, fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}>Start Creating Free</Link>
                            <button className="btn btn-secondary glass-card" style={{ padding: '24px 64px', borderRadius: 100, fontSize: 18, fontWeight: 800, border: '1px solid rgba(255,255,255,0.1)' }}>View Showcase</button>
                        </div>
                    </div>

                    {/* Visualizer Preview */}
                    <div className="reveal stagger-2" style={{
                        marginTop: 120,
                        padding: 2,
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent)',
                        borderRadius: 40,
                        maxWidth: 1200,
                        margin: '120px auto 0'
                    }}>
                        <div className="glass-card" style={{ padding: 'clamp(10px, 3vw, 30px)', borderRadius: 38 }}>
                            <div style={{ width: '100%', height: 'clamp(300px, 60vh, 700px)', borderRadius: 24, background: '#080810', border: '1px solid rgba(255,255,255,0.05)', display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 30px', gap: 14 }}>
                                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
                                    <div style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: 1 }}>AUTO_PIPELINE_V2.0</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div className="animate-float-premium" style={{ fontSize: 64, marginBottom: 24 }}>🚀</div>
                                    <h3 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Autonomous Video Engine</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>Processing real-time trends for viral deployment...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" style={{ padding: '160px 0' }}>
                <div className="container">
                    <div className="reveal" style={{ textAlign: 'center', marginBottom: 120 }}>
                        <h2 style={{ fontSize: 'clamp(40px, 8vw, 64px)', fontWeight: 950, letterSpacing: -3, marginBottom: 32 }}>Built for <span style={{ color: 'var(--accent-primary)' }}>Performance</span></h2>
                        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', maxWidth: 700, margin: '0 auto' }}>Scale without limits using our high-concurrency content distribution network.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 40 }}>
                        {[
                            { title: 'Multi-Core AI', desc: 'Parallel processing across Gemini, GPT-4, and specialized local models.', icon: '🧠' },
                            { title: 'Fast-Track Engine', desc: 'Zero-latency content generation from trend detection to final render.', icon: '⚡' },
                            { title: 'Recursive Branding', desc: 'AI-driven visual consistency that evolves with your brand identity.', icon: '🎨' },
                            { title: 'Stealth Distribution', desc: 'Bypass platform throttling with intelligent, human-like posting patterns.', icon: '🛰️' },
                            { title: 'Neural Analytics', desc: 'Predictive growth modeling to identify tomorrow\'s viral meta today.', icon: '📈' },
                            { title: 'Infinite Scaling', desc: 'Manage 100+ channels with the same effort as one single account.', icon: '🌌' }
                        ].map((f, i) => (
                            <div key={i} className={`glass-card reveal stagger-${(i % 3) + 1}`} style={{ padding: '64px 48px', borderRadius: 40 }}>
                                <div style={{ fontSize: 56, marginBottom: 32 }}>{f.icon}</div>
                                <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20 }}>{f.title}</h3>
                                <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '160px 0 80px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 100, marginBottom: 120 }}>
                        <div style={{ maxWidth: 450 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
                                <div style={{ width: 48, height: 48, background: 'var(--accent-primary)', borderRadius: 14, display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: 26 }}>A</div>
                                <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5 }}>AutoContent AI</span>
                            </div>
                            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8 }}>The definitive platform for autonomous content creation. Join the revolution of creators who work smarter, not harder.</p>
                        </div>
                        <div style={{ display: 'flex', gap: 'clamp(60px, 15vw, 200px)', flexWrap: 'wrap' }}>
                            <div>
                                <h4 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 40, color: 'var(--accent-primary)' }}>System</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                                    <a href="#features">Architecture</a>
                                    <Link href="/dashboard">Dashboard</Link>
                                    <a href="#">Security</a>
                                    <a href="#">Status</a>
                                </div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 40, color: 'var(--accent-primary)' }}>Network</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                                    <a href="#">About</a>
                                    <a href="#">Creators</a>
                                    <a href="#">Enterprise</a>
                                    <a href="#">Legal</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 40, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 60, fontSize: 15, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                        <p>© 2026 AutoContent AI. Global HQ — Digital First.</p>
                        <div style={{ display: 'flex', gap: 60 }}>
                            <a href="#">Privacy Protocol</a>
                            <a href="#">Operational Terms</a>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                .container {
                    width: 100%;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 5%;
                }
                .mobile-toggle { display: none; }
                
                @media (max-width: 1000px) {
                    .desktop-nav { display: none !important; }
                    .mobile-toggle { display: block !important; background: transparent; border: none; }
                }

                @media (max-width: 600px) {
                    .hero-btns { flex-direction: column; }
                    .btn { width: 100%; }
                }
            `}</style>
        </div>
    );
}
