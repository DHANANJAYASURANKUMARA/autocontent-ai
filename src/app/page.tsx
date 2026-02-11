'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        // Intersection Observer for reveal animations
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

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
                padding: scrolled ? '16px 5%' : '24px 5%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 1000,
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                background: scrolled || mobileMenuOpen ? 'rgba(10, 10, 18, 0.85)' : 'transparent',
                backdropFilter: scrolled || mobileMenuOpen ? 'blur(20px)' : 'none',
                borderBottom: scrolled || mobileMenuOpen ? '1px solid rgba(255,255,255,0.08)' : 'none'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="animate-float" style={{ width: 32, height: 32, background: 'var(--accent-primary)', borderRadius: 8, display: 'grid', placeItems: 'center', fontWeight: 'bold', boxShadow: 'var(--glow-purple)' }}>A</div>
                    <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>AutoContent <span style={{ color: 'var(--accent-primary)' }}>AI</span></span>
                </div>

                {/* Desktop Nav */}
                <div className="desktop-nav" style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
                    <a href="#features" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', transition: '0.2s', textTransform: 'uppercase', letterSpacing: 1 }}>Features</a>
                    <a href="#pricing" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', transition: '0.2s', textTransform: 'uppercase', letterSpacing: 1 }}>Pricing</a>
                    <Link href="/dashboard" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: 100, fontSize: 14 }}>Log In</Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{ fontSize: 24, padding: 4 }}
                >
                    {mobileMenuOpen ? '✕' : '☰'}
                </button>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="mobile-menu-overlay fade-in" style={{
                        position: 'fixed',
                        top: '100%',
                        left: 0,
                        width: '100%',
                        background: 'rgba(10, 10, 18, 0.98)',
                        padding: '24px 5% 40px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 24,
                        borderBottom: '1px solid var(--border-color)',
                        zIndex: 999,
                        backdropFilter: 'blur(24px)'
                    }}>
                        <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 18, fontWeight: 600 }}>Features</a>
                        <a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 18, fontWeight: 600 }}>Pricing</a>
                        <Link href="/dashboard" className="btn btn-primary" style={{ padding: '14px', textAlign: 'center', borderRadius: 12 }}>Go to Dashboard</Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section style={{
                padding: 'var(--section-padding-hero)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Elements */}
                <div className="animate-float-alt" style={{ position: 'absolute', top: '15%', left: '10%', width: 60, height: 60, borderRadius: 16, border: '1px solid rgba(108, 92, 231, 0.3)', background: 'rgba(108, 92, 231, 0.05)', backdropFilter: 'blur(5px)', display: 'grid', placeItems: 'center', fontSize: 24, zIndex: 0 }}>🧠</div>
                <div className="animate-float" style={{ position: 'absolute', top: '40%', right: '8%', width: 50, height: 50, borderRadius: '50%', border: '1px solid rgba(0, 210, 255, 0.3)', background: 'rgba(0, 210, 255, 0.05)', backdropFilter: 'blur(5px)', display: 'grid', placeItems: 'center', fontSize: 20, zIndex: 0 }}>⚡</div>
                <div className="animate-float-slow" style={{ position: 'absolute', bottom: '20%', left: '15%', width: 70, height: 70, borderRadius: 20, border: '1px solid rgba(168, 85, 247, 0.3)', background: 'rgba(168, 85, 247, 0.05)', backdropFilter: 'blur(5px)', display: 'grid', placeItems: 'center', fontSize: 28, zIndex: 0 }}>🎬</div>

                {/* Floating Glows */}
                <div style={{ position: 'absolute', top: '10%', left: '20%', width: 'clamp(200px, 40vw, 400px)', height: 'clamp(200px, 40vw, 400px)', background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)', opacity: 0.15, filter: 'blur(80px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: 'clamp(300px, 50vw, 600px)', height: 'clamp(300px, 50vw, 600px)', background: 'radial-gradient(circle, #6c5ce7 0%, transparent 70%)', opacity: 0.15, filter: 'blur(100px)', pointerEvents: 'none' }} />

                <div className="reveal active" style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        borderRadius: 100,
                        background: 'rgba(108, 92, 231, 0.1)',
                        border: '1px solid rgba(108, 92, 231, 0.2)',
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--text-accent)',
                        marginBottom: 24,
                        textTransform: 'uppercase',
                        letterSpacing: 2
                    }}>
                        ✨ AI-Powered Content Revolution
                    </div>
                    <h1 style={{ fontSize: 'clamp(38px, 9vw, 82px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: -2.5, marginBottom: 24 }}>
                        Automate Your <br className="desktop-only" /> <span style={{ background: 'linear-gradient(90deg, #fff 30%, var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Social Empire</span>
                    </h1>
                    <p style={{ fontSize: 'clamp(17px, 4.5vw, 21px)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 40, maxWidth: 680, margin: '0 auto 48px' }}>
                        Generate, schedule, and publish viral content across YouTube, TikTok, and Facebook with a single click. No more manual edits. Just growth.
                    </p>
                    <div className="hero-btns" style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/dashboard" className="btn btn-primary" style={{ padding: '18px 48px', borderRadius: 100, fontSize: 17, fontWeight: 800, boxShadow: '0 0 30px rgba(108, 92, 231, 0.4)', flex: '1 0 220px', maxWidth: 300 }}>Start for Free</Link>
                        <button className="btn btn-secondary" style={{ padding: '18px 48px', borderRadius: 100, fontSize: 17, fontWeight: 800, flex: '1 0 220px', maxWidth: 300, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>Watch Demo</button>
                    </div>
                </div>

                {/* Dashboard Preview */}
                <div className="reveal preview-container stagger-2" style={{ marginTop: 80, padding: 'clamp(10px, 3vw, 24px)', background: 'rgba(255,255,255,0.02)', borderRadius: 'clamp(20px, 4vw, 32px)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(30px)', maxWidth: 1040, margin: '80px auto 0', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
                    <div style={{ width: '100%', height: 'clamp(240px, 55vh, 600px)', borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'grid', placeItems: 'center', color: 'var(--text-muted)', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40, background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8 }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
                        </div>
                        <p style={{ textAlign: 'center', padding: 20, fontSize: 18, fontWeight: 500 }}>
                            Interactive Dashboard Preview<br />
                            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 400 }}>Experience the power of automated content</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" style={{ padding: 'var(--section-padding)' }}>
                <div className="reveal" style={{ textAlign: 'center', marginBottom: 80 }}>
                    <h2 style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 900, marginBottom: 20, letterSpacing: -1 }}>Everything you need to <span style={{ color: 'var(--accent-primary)', textShadow: '0 0 20px rgba(108, 92, 231, 0.3)' }}>go viral</span></h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto', fontSize: 18 }}>Leverage the world's most powerful AI models to automate your content pipeline from ideation to distribution.</p>
                </div>
                <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
                    {[
                        { title: 'Multi-Model AI', desc: 'Switch between Gemini, OpenAI, or local LLMs for the perfect script.', icon: '🧠', color: 'var(--accent-primary)' },
                        { title: 'One-Click Pipeline', desc: 'Pick your niche, click run, and watch your content queue grow.', icon: '⚡', color: 'var(--accent-tertiary)' },
                        { title: 'Visual Branding', desc: 'Custom fonts, colors, and styles applied automatically to every asset.', icon: '🎨', color: 'var(--accent-pink)' },
                        { title: 'Auto-Publishing', desc: 'Schedule weeks of content in minutes across all platforms.', icon: '🚀', color: 'var(--accent-green)' },
                        { title: 'Real-time Analytics', desc: 'Track your growth and optimize your content strategy with ease.', icon: '📈', color: 'var(--accent-orange)' },
                        { title: 'Smart Niche Selection', desc: 'AI-driven topic generation that targets the latest trends in your niche.', icon: '🎯', color: 'var(--accent-secondary)' }
                    ].map((f, i) => (
                        <div key={i} className={`card feature-card reveal stagger-${(i % 3) + 1}`} style={{ padding: 40, borderBottom: `2px solid transparent`, transition: 'all 0.4s ease' }}>
                            <div style={{ fontSize: 40, marginBottom: 24, padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 16, display: 'inline-block' }}>{f.icon}</div>
                            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" style={{ padding: 'var(--section-padding)', background: 'linear-gradient(180deg, transparent, rgba(108, 92, 231, 0.03))' }}>
                <div className="reveal" style={{ textAlign: 'center', marginBottom: 80 }}>
                    <h2 style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 900, marginBottom: 20, letterSpacing: -1 }}>Choose your <span style={{ color: 'var(--accent-primary)' }}>Growth Plan</span></h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 18 }}>Simple pricing for content creators of all sizes. No hidden fees.</p>
                </div>
                <div className="pricing-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
                    {[
                        { name: 'Starter', price: '$0', features: ['3 Videos / week', 'Single AI Provider', 'Basic Branding', 'Manual Scheduling'] },
                        { name: 'Pro', price: '$29', features: ['Unlimited Videos', 'All AI Providers', 'Full Visual Branding', 'Auto-Publishing', 'Priority Support'], popular: true },
                        { name: 'Agency', price: '$99', features: ['Multi-Account Mgmt', 'API Access', 'Custom AI Training', 'White-label Support'] }
                    ].map((p, i) => (
                        <div key={i} className={`card pricing-card reveal stagger-${i + 1}`} style={{
                            padding: 'clamp(32px, 6vw, 56px)',
                            border: p.popular ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                            background: p.popular ? 'rgba(108, 92, 231, 0.05)' : 'var(--bg-card)',
                            position: 'relative'
                        }}>
                            {p.popular && <span style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-primary)', color: '#fff', padding: '6px 20px', borderRadius: 100, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', boxShadow: '0 10px 20px rgba(108, 92, 231, 0.4)' }}>Most Popular</span>}
                            <h3 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>{p.name}</h3>
                            <div style={{ marginBottom: 40 }}>
                                <span style={{ fontSize: 56, fontWeight: 900 }}>{p.price}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>/mo</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 48px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                                {p.features.map((f, j) => (
                                    <li key={j} style={{ fontSize: 16, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(0, 230, 118, 0.1)', color: 'var(--accent-green)', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 900 }}>✓</div>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button className={`btn ${p.popular ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', borderRadius: 100, padding: 18, fontWeight: 800, fontSize: 16 }}>Get Started Now</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '100px 5% 60px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'var(--bg-dark)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '60px 100px', marginBottom: 80 }}>
                    <div style={{ maxWidth: 360, flex: '1 0 300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <div style={{ width: 36, height: 36, background: 'var(--accent-primary)', borderRadius: 10, display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: 20 }}>A</div>
                            <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>AutoContent AI</span>
                        </div>
                        <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.7 }}>The world's first fully automated AI content platform. Built for the future of social media growth and creator freedom.</p>
                    </div>
                    <div style={{ display: 'flex', gap: 'clamp(60px, 12vw, 120px)', flexWrap: 'wrap', flex: 1 }}>
                        <div>
                            <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 28, textTransform: 'uppercase', letterSpacing: 1 }}>Product</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 15, color: 'var(--text-muted)' }}>
                                <a href="#" className="footer-link">Features</a>
                                <a href="#" className="footer-link">Dashboard</a>
                                <a href="#" className="footer-link">API Access</a>
                                <a href="#" className="footer-link">Roadmap</a>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 28, textTransform: 'uppercase', letterSpacing: 1 }}>Company</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 15, color: 'var(--text-muted)' }}>
                                <a href="#" className="footer-link">About Us</a>
                                <a href="#" className="footer-link">Success Stories</a>
                                <a href="#" className="footer-link">Help Center</a>
                                <a href="#" className="footer-link">Contact</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 40, fontSize: 14, color: 'var(--text-muted)' }}>
                    <p>© 2026 AutoContent AI. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: 32 }}>
                        <a href="#" className="footer-link">Privacy Policy</a>
                        <a href="#" className="footer-link">Terms of Service</a>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                :root {
                    --section-padding: 120px 5%;
                    --section-padding-hero: 200px 5% 120px;
                }
                .landing-container {
                    scroll-behavior: smooth;
                }
                .mobile-toggle {
                    display: none;
                }
                .footer-link {
                    transition: color 0.3s ease;
                }
                .footer-link:hover {
                    color: var(--accent-primary);
                }
                
                @media (max-width: 900px) {
                    .desktop-nav { display: none !important; }
                    .mobile-toggle { display: block !important; }
                    :root {
                        --section-padding: 80px 5%;
                        --section-padding-hero: 160px 5% 80px;
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
