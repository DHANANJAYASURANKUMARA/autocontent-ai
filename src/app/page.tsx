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

        // Intersection Observer for reveal animations - smoother settings
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
        <div className="landing-container" style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)', overflowX: 'hidden', position: 'relative' }}>
            {/* Alive Background Wrapper */}
            <div className="alive-bg" />

            {/* Header / Nav */}
            <nav style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                padding: scrolled ? '12px 0' : '24px 0',
                zIndex: 1000,
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                background: scrolled || mobileMenuOpen ? 'rgba(10, 10, 18, 0.92)' : 'transparent',
                backdropFilter: scrolled || mobileMenuOpen ? 'blur(24px)' : 'none',
                borderBottom: scrolled || mobileMenuOpen ? '1px solid rgba(255,255,255,0.1)' : 'none',
                boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.3)' : 'none'
            }}>
                <div className="nav-content" style={{ padding: '0 5%' }}>
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
                        background: 'rgba(10, 10, 18, 0.95)',
                        padding: '32px 5% 48px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 24,
                        borderBottom: '1px solid var(--border-color)',
                        zIndex: 999,
                        backdropFilter: 'blur(32px)'
                    }}>
                        <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 20, fontWeight: 600 }}>Features</a>
                        <a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 20, fontWeight: 600 }}>Pricing</a>
                        <Link href="/dashboard" className="btn btn-primary" style={{ padding: '16px', textAlign: 'center', borderRadius: 12 }}>Go to Dashboard</Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section style={{
                padding: 'var(--section-padding-hero)',
                textAlign: 'center',
                position: 'relative'
            }}>
                <div className="reveal active" style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div className="animate-float-subtle" style={{
                        display: 'inline-block',
                        padding: '8px 20px',
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
                        ✨ AI-Powered Content Revolution
                    </div>
                    <h1 style={{ fontSize: 'clamp(42px, 9vw, 84px)', fontWeight: 900, lineHeight: 1, letterSpacing: -2, marginBottom: 32 }}>
                        Automate Your <br className="desktop-only" /> <span style={{ background: 'linear-gradient(90deg, #fff 40%, var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Social Empire</span>
                    </h1>
                    <p style={{ fontSize: 'clamp(18px, 4vw, 22px)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 56, maxWidth: 720, margin: '0 auto 56px' }}>
                        Generate, schedule, and publish viral content across YouTube, TikTok, and Facebook with a single click. Experience the future of growth.
                    </p>
                    <div className="hero-btns" style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                        <Link href="/dashboard" className="btn btn-primary" style={{ padding: '20px 52px', borderRadius: 100, fontSize: 17, fontWeight: 800, flex: '0 1 280px' }}>Start for Free</Link>
                        <button className="btn btn-secondary" style={{ padding: '20px 52px', borderRadius: 100, fontSize: 17, fontWeight: 800, flex: '0 1 280px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>Watch Demo</button>
                    </div>
                </div>

                {/* Dashboard Preview */}
                <div className="reveal stagger-2" style={{ marginTop: 100, padding: 'clamp(10px, 3vw, 24px)', background: 'rgba(255,255,255,0.01)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(40px)', maxWidth: 1080, margin: '100px auto 0', boxShadow: '0 40px 120px rgba(0,0,0,0.6)' }}>
                    <div style={{ width: '100%', height: 'clamp(280px, 60vh, 640px)', borderRadius: 24, background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'grid', placeItems: 'center', color: 'var(--text-muted)', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 48, background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10 }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56', opacity: 0.8 }} />
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e', opacity: 0.8 }} />
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f', opacity: 0.8 }} />
                        </div>
                        <div style={{ textAlign: 'center', animation: 'fadeIn 2s ease' }}>
                            <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Interactive Dashboard</p>
                            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Real-time automation preview enabled</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" style={{ padding: 'var(--section-padding)', position: 'relative' }}>
                <div className="reveal" style={{ textAlign: 'center', marginBottom: 100 }}>
                    <h2 style={{ fontSize: 'clamp(36px, 6vw, 52px)', fontWeight: 900, marginBottom: 24, letterSpacing: -1.5 }}>Viral Features <span style={{ color: 'var(--accent-primary)', textShadow: '0 0 30px rgba(108, 92, 231, 0.2)' }}>Included</span></h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: 680, margin: '0 auto', fontSize: 19, lineHeight: 1.6 }}>The most advanced toolkit for modern creators, powered by cutting-edge AI architecture.</p>
                </div>
                <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, maxWidth: 1200, margin: '0 auto' }}>
                    {[
                        { title: 'Multi-Model AI', desc: 'Seamlessly switch between Gemini 1.5, OpenAI, or local LLMs specialized for scripts.', icon: '🧠' },
                        { title: 'Automated Pipeline', desc: 'One click to ideate, script, and generate assets without manual intervention.', icon: '⚡' },
                        { title: 'Pro Visual Branding', desc: 'Consistent aesthetic across all assets with automated brand kits and fonts.', icon: '🎨' },
                        { title: 'Global Distribution', desc: 'Intelligent scheduling that hits peak engagement hours for every platform.', icon: '🚀' },
                        { title: 'Actionable Insights', desc: 'Deep analytics that go beyond views to help you replicate viral success.', icon: '📈' },
                        { title: 'Niche Domination', desc: 'AI discovery tools that find untapped, high-growth topics in your niche.', icon: '🎯' }
                    ].map((f, i) => (
                        <div key={i} className={`card feature-card reveal stagger-${(i % 3) + 1}`} style={{
                            padding: '48px 40px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: 32,
                            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}>
                            <div style={{ fontSize: 44, marginBottom: 28 }}>{f.icon}</div>
                            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.75 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" style={{ padding: 'var(--section-padding)', position: 'relative' }}>
                <div className="reveal" style={{ textAlign: 'center', marginBottom: 100 }}>
                    <h2 style={{ fontSize: 'clamp(36px, 6vw, 52px)', fontWeight: 900, marginBottom: 24, letterSpacing: -1.5 }}>Simple, <span style={{ color: 'var(--accent-primary)' }}>Transparent</span> Pricing</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 19 }}>Scale your empire with plans that grow with you.</p>
                </div>
                <div className="pricing-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 40 }}>
                    {[
                        { name: 'Starter', price: '$0', features: ['3 Videos per week', 'OpenAI / Gemini Access', 'Standard Brand Kit', 'Manual Posting'] },
                        { name: 'Professional', price: '$29', features: ['Unlimited Video Gen', 'Priority AI Processing', 'Full Brand Customization', 'Auto-Publishing', 'Analytics Dashboard'], popular: true },
                        { name: 'Enterprise', price: '$99', features: ['Multi-Account Teams', 'API Integration', 'Custom AI Training', '24/7 Priority Support'] }
                    ].map((p, i) => (
                        <div key={i} className={`card pricing-card reveal stagger-${i + 1}`} style={{
                            padding: '60px 48px',
                            border: p.popular ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.08)',
                            background: p.popular ? 'rgba(108, 92, 231, 0.04)' : 'rgba(255,255,255,0.01)',
                            borderRadius: 40,
                            position: 'relative',
                            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            {p.popular && <span style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-primary)', color: '#fff', padding: '8px 24px', borderRadius: 100, fontSize: 13, fontWeight: 800, textTransform: 'uppercase', boxShadow: '0 12px 24px rgba(108, 92, 231, 0.4)' }}>Most Popular</span>}
                            <h3 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>{p.name}</h3>
                            <div style={{ marginBottom: 48 }}>
                                <span style={{ fontSize: 64, fontWeight: 900 }}>{p.price}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: 20 }}> / mo</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 56px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                                {p.features.map((f, j) => (
                                    <li key={j} style={{ fontSize: 16, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(0, 230, 118, 0.1)', color: 'var(--accent-green)', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 900 }}>✓</div>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button className={`btn ${p.popular ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', borderRadius: 100, padding: 20, fontWeight: 800, fontSize: 16 }}>Start Your Empire</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '120px 5% 60px', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
                <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '80px 100px', marginBottom: 100 }}>
                    <div style={{ maxWidth: 400, flex: '1 0 320px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
                            <div style={{ width: 40, height: 40, background: 'var(--accent-primary)', borderRadius: 12, display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: 22 }}>A</div>
                            <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>AutoContent AI</span>
                        </div>
                        <p style={{ fontSize: 17, color: 'var(--text-muted)', lineHeight: 1.8 }}>The world's most advanced autonomous content engine. Reclaiming creator freedom through intelligent automation.</p>
                    </div>
                    <div style={{ display: 'flex', gap: 'clamp(60px, 12vw, 140px)', flexWrap: 'wrap', flex: 1 }}>
                        <div>
                            <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 32, textTransform: 'uppercase', letterSpacing: 2 }}>Product</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, fontSize: 15, color: 'var(--text-muted)' }}>
                                <a href="#features" className="footer-link">Features</a>
                                <a href="/dashboard" className="footer-link">Dashboard</a>
                                <a href="#" className="footer-link">API & Docs</a>
                                <a href="#" className="footer-link">Enterprise</a>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 32, textTransform: 'uppercase', letterSpacing: 2 }}>Resources</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, fontSize: 15, color: 'var(--text-muted)' }}>
                                <a href="#" className="footer-link">Support Hub</a>
                                <a href="#" className="footer-link">Creator Blog</a>
                                <a href="#" className="footer-link">Community</a>
                                <a href="#" className="footer-link">Status Page</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 48, fontSize: 15, color: 'var(--text-muted)' }}>
                    <p>© 2026 AutoContent AI. Built for the next billion creators.</p>
                    <div style={{ display: 'flex', gap: 40 }}>
                        <a href="#" className="footer-link">Privacy Center</a>
                        <a href="#" className="footer-link">Legal Terms</a>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                :root {
                    --section-padding: 160px 5%;
                    --section-padding-hero: 220px 5% 140px;
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
                    padding-left: 4px;
                }
                
                @media (max-width: 900px) {
                    .desktop-nav { display: none !important; }
                    .mobile-toggle { display: block !important; }
                    :root {
                        --section-padding: 100px 5%;
                        --section-padding-hero: 180px 5% 100px;
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
