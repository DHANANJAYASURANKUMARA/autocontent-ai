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
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observerRef.current?.observe(el));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observerRef.current?.disconnect();
        };
    }, []);

    return (
        <div className="landing-container" style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
            {/* Header / Nav */}
            <nav style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                padding: scrolled ? '12px 0' : '24px 0',
                zIndex: 1000,
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                background: scrolled || mobileMenuOpen ? 'rgba(10, 10, 18, 0.95)' : 'transparent',
                backdropFilter: scrolled || mobileMenuOpen ? 'blur(30px)' : 'none',
                borderBottom: scrolled || mobileMenuOpen ? '1px solid rgba(255,255,255,0.1)' : 'none',
                boxShadow: scrolled ? '0 10px 40px rgba(0,0,0,0.4)' : 'none'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, background: 'var(--accent-primary)', borderRadius: 10, display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: 18, boxShadow: 'var(--glow-purple)' }}>A</div>
                        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>AutoContent <span style={{ color: 'var(--accent-primary)' }}>AI</span></span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="desktop-nav" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
                        <a href="#features" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', transition: '0.3s', textTransform: 'uppercase', letterSpacing: 1.5 }}>Features</a>
                        <a href="#pricing" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', transition: '0.3s', textTransform: 'uppercase', letterSpacing: 1.5 }}>Pricing</a>
                        <Link href="/dashboard" className="btn btn-primary" style={{ padding: '10px 28px', borderRadius: 100, fontSize: 14, fontWeight: 700 }}>Log In</Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{ fontSize: 24, padding: 8, color: 'var(--text-primary)', background: 'transparent', border: 'none' }}
                    >
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="mobile-menu-overlay reveal active" style={{
                        position: 'fixed',
                        top: '100%',
                        left: 0,
                        width: '100%',
                        background: 'rgba(10, 10, 18, 0.98)',
                        padding: '40px 5%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 24,
                        borderBottom: '1px solid var(--border-color)',
                        zIndex: 999,
                        backdropFilter: 'blur(40px)'
                    }}>
                        <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 20, fontWeight: 600 }}>Features</a>
                        <a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 20, fontWeight: 600 }}>Pricing</a>
                        <Link href="/dashboard" className="btn btn-primary" style={{ padding: '16px', textAlign: 'center', borderRadius: 12 }}>Go to Dashboard</Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="section" style={{ padding: 'var(--section-padding-hero) 0 100px' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className="reveal active" style={{ maxWidth: 900, margin: '0 auto' }}>
                        <div style={{
                            display: 'inline-block',
                            padding: '8px 24px',
                            borderRadius: 100,
                            background: 'rgba(108, 92, 231, 0.08)',
                            border: '1px solid rgba(108, 92, 231, 0.15)',
                            fontSize: 12,
                            fontWeight: 700,
                            color: 'var(--accent-primary)',
                            marginBottom: 32,
                            textTransform: 'uppercase',
                            letterSpacing: 2
                        }}>
                            ✨ Next-Gen Content Engine
                        </div>
                        <h1 style={{ fontSize: 'clamp(42px, 8vw, 84px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: -2, marginBottom: 32 }}>
                            Scale Your <br className="desktop-only" /> <span style={{ background: 'linear-gradient(90deg, #fff 40%, var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Digital Empire</span>
                        </h1>
                        <p style={{ fontSize: 'clamp(18px, 4vw, 22px)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 48, maxWidth: 720, margin: '0 auto 48px' }}>
                            Human-quality content, fully automated. Generate, distribute, and grow across all social platforms with a single click.
                        </p>
                        <div className="hero-btns" style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                            <Link href="/dashboard" className="btn btn-primary" style={{ padding: '20px 52px', borderRadius: 100, fontSize: 17, fontWeight: 800, flex: '0 1 280px' }}>Start for Free</Link>
                            <button className="btn btn-secondary" style={{ padding: '20px 52px', borderRadius: 100, fontSize: 17, fontWeight: 800, flex: '0 1 280px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>Watch Demo</button>
                        </div>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="reveal stagger-2" style={{
                        marginTop: 100,
                        padding: '1px',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent)',
                        borderRadius: '40px',
                        maxWidth: 1080,
                        margin: '100px auto 0',
                        boxShadow: '0 40px 120px rgba(0,0,0,0.6)'
                    }}>
                        <div style={{ padding: 'clamp(10px, 2vw, 20px)', background: 'rgba(15, 15, 25, 0.8)', borderRadius: '39px', backdropFilter: 'blur(40px)' }}>
                            <div style={{ width: '100%', height: 'clamp(300px, 60vh, 600px)', borderRadius: 24, background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)', display: 'grid', placeItems: 'center', overflow: 'hidden', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 48, background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12 }}>
                                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
                                    <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Dynamic Dashboard Preview</p>
                                    <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Automated Content Pipeline Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="section">
                <div className="container">
                    <div className="reveal" style={{ textAlign: 'center', marginBottom: 100 }}>
                        <h2 style={{ fontSize: 'clamp(36px, 6vw, 52px)', fontWeight: 900, marginBottom: 24, letterSpacing: -1.5 }}>Viral Content <span style={{ color: 'var(--accent-primary)' }}>Simplified</span></h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: 680, margin: '0 auto', fontSize: 19, lineHeight: 1.6 }}>The ultimate engine for creators who want to spend more time creating and less time managing.</p>
                    </div>
                    <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
                        {[
                            { title: 'Multi-Model AI', desc: 'Seamlessly toggle between Gemini, OpenAI, or specialized local models for any niche.', icon: '🧠' },
                            { title: 'Auto-Pipeline', desc: 'From script to asset generation, everything runs on autopilot with zero friction.', icon: '⚡' },
                            { title: 'Pro Branding', desc: 'Consistent visual identity across all platforms with automated font and color syncing.', icon: '🎨' },
                            { title: 'Peak Scheduling', desc: 'Hit maximum engagement with AI that knows exactly when your audience is active.', icon: '🚀' },
                            { title: 'Actionable Data', desc: 'Understand your growth with deep insights that help you replicate viral success.', icon: '📈' },
                            { title: 'Trend Discovery', desc: 'Instantly find high-potential topics before they saturate the market.', icon: '🎯' }
                        ].map((f, i) => (
                            <div key={i} className={`card feature-card reveal stagger-${(i % 3) + 1}`} style={{
                                padding: '48px 40px',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: 32,
                                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}>
                                <div style={{ fontSize: 48, marginBottom: 28 }}>{f.icon}</div>
                                <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.75 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="section" style={{ background: 'rgba(255,255,255,0.01)' }}>
                <div className="container">
                    <div className="reveal" style={{ textAlign: 'center', marginBottom: 100 }}>
                        <h2 style={{ fontSize: 'clamp(36px, 6vw, 52px)', fontWeight: 900, marginBottom: 24, letterSpacing: -1.5 }}>Scale Your <span style={{ color: 'var(--accent-primary)' }}>Empire</span></h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 19 }}>Professional tools for creators at every stage of their journey.</p>
                    </div>
                    <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 40 }}>
                        {[
                            { name: 'Starter', price: '$0', features: ['3 Videos / week', 'Essential AI Access', 'Standard Branding', 'Manual Posting'] },
                            { name: 'Professional', price: '$29', features: ['Unlimited Videos', 'Priority AI Engine', 'Full Visual Kits', 'Auto-Publishing', 'Advanced Analytics'], popular: true },
                            { name: 'Enterprise', price: '$99', features: ['Multi-Account Teams', 'API Integration', 'Custom AI Training', 'White-glove Support'] }
                        ].map((p, i) => (
                            <div key={i} className={`card pricing-card reveal stagger-${i + 1}`} style={{
                                padding: '64px 48px',
                                border: p.popular ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.08)',
                                background: p.popular ? 'rgba(108, 92, 231, 0.05)' : 'rgba(255,255,255,0.01)',
                                borderRadius: 40,
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%'
                            }}>
                                {p.popular && <span style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-primary)', color: '#fff', padding: '10px 24px', borderRadius: 100, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', boxShadow: '0 10px 20px rgba(108, 92, 231, 0.4)' }}>Most Popular</span>}
                                <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1.5 }}>{p.name}</h3>
                                <div style={{ marginBottom: 48 }}>
                                    <span style={{ fontSize: 64, fontWeight: 900 }}>{p.price}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: 20 }}> / mo</span>
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 56px', display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
                                    {p.features.map((f, j) => (
                                        <li key={j} style={{ fontSize: 16, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 14 }}>
                                            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(0, 230, 118, 0.1)', color: 'var(--accent-green)', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 900 }}>✓</div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`btn ${p.popular ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', borderRadius: 100, padding: 22, fontWeight: 800, fontSize: 17 }}>Join the Future</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '120px 0 60px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '80px 100px', marginBottom: 100 }}>
                        <div style={{ maxWidth: 400 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
                                <div style={{ width: 40, height: 40, background: 'var(--accent-primary)', borderRadius: 12, display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: 22 }}>A</div>
                                <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>AutoContent AI</span>
                            </div>
                            <p style={{ fontSize: 17, color: 'var(--text-muted)', lineHeight: 1.8 }}>The world's most powerful autonomous content engine. Built for creators who think big.</p>
                        </div>
                        <div style={{ display: 'flex', gap: 'clamp(60px, 10vw, 140px)', flexWrap: 'wrap' }}>
                            <div>
                                <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 32, textTransform: 'uppercase', letterSpacing: 2 }}>Product</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 18, fontSize: 15, color: 'var(--text-muted)' }}>
                                    <a href="#features" className="footer-link">Features</a>
                                    <a href="/dashboard" className="footer-link">Dashboard</a>
                                    <a href="#" className="footer-link">API Access</a>
                                    <a href="#" className="footer-link">Security</a>
                                </div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 32, textTransform: 'uppercase', letterSpacing: 2 }}>Company</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 18, fontSize: 15, color: 'var(--text-muted)' }}>
                                    <a href="#" className="footer-link">About Us</a>
                                    <a href="#" className="footer-link">Blog</a>
                                    <a href="#" className="footer-link">Careers</a>
                                    <a href="#" className="footer-link">Support</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 32, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 48, fontSize: 15, color: 'var(--text-muted)' }}>
                        <p>© 2026 AutoContent AI. All rights reserved.</p>
                        <div style={{ display: 'flex', gap: 40 }}>
                            <a href="#" className="footer-link">Privacy Policy</a>
                            <a href="#" className="footer-link">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                :root {
                    --section-padding: 140px 0;
                    --section-padding-hero: 240px;
                }
                .landing-container {
                    scroll-behavior: smooth;
                }
                .mobile-toggle {
                    display: none;
                }
                .footer-link {
                    transition: all 0.3s ease;
                    text-decoration: none;
                }
                .footer-link:hover {
                    color: var(--accent-primary);
                }
                
                @media (max-width: 900px) {
                    .desktop-nav { display: none !important; }
                    .mobile-toggle { display: block !important; }
                    :root {
                        --section-padding: 100px 0;
                        --section-padding-hero: 180px;
                    }
                }

                @media (max-width: 600px) {
                    .pricing-card { transform: none !important; }
                    .hero-btns { flex-direction: column; }
                    .hero-btns .btn { width: 100%; max-width: none !important; }
                    .desktop-only { display: none; }
                }
            `}</style>
        </div>
    );
}
