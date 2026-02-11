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
            {/* Professional Background */}
            <div style={{ position: 'fixed', inset: 0, zIndex: -10, background: 'radial-gradient(circle at 50% -20%, #151525 0%, #05050a 100%)' }} />

            {/* Navigation */}
            <nav style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                padding: scrolled ? '16px 0' : '24px 0',
                zIndex: 1000,
                transition: 'all 0.4s ease',
                background: scrolled || mobileMenuOpen ? 'rgba(5, 5, 10, 0.9)' : 'transparent',
                backdropFilter: scrolled || mobileMenuOpen ? 'blur(10px)' : 'none',
                borderBottom: scrolled || mobileMenuOpen ? '1px solid rgba(255,255,255,0.05)' : 'none'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, background: 'var(--accent-primary)', borderRadius: 8, display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: 18 }}>A</div>
                        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>AutoContent <span style={{ color: 'var(--accent-primary)' }}>AI</span></span>
                    </div>

                    <div className="desktop-nav" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
                        <a href="#features" style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)', transition: '0.2s' }}>Features</a>
                        <a href="#pricing" style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)', transition: '0.2s' }}>Pricing</a>
                        <Link href="/dashboard" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600 }}>Dashboard</Link>
                    </div>

                    <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: '#fff', fontSize: 24, background: 'transparent', border: 'none' }}>
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{ padding: '180px 0 100px', position: 'relative' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className="reveal active" style={{ maxWidth: 850, margin: '0 auto' }}>
                        <h1 style={{ fontSize: 'clamp(40px, 8vw, 84px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, marginBottom: 32 }}>
                            Scale Your Content <br /> <span style={{ color: 'var(--accent-primary)' }}>Automatically</span>
                        </h1>
                        <p style={{ fontSize: 'clamp(18px, 3vw, 20px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 48, maxWidth: 650, margin: '0 auto 48px' }}>
                            The professional platform for automated content generation and multi-platform distribution. Built for modern growth teams.
                        </p>
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/dashboard" className="btn btn-primary" style={{ padding: '16px 40px', borderRadius: 8, fontSize: 16, fontWeight: 600 }}>Get Started Free</Link>
                            <button className="btn btn-secondary glass-card" style={{ padding: '16px 40px', borderRadius: 8, fontSize: 16, fontWeight: 600 }}>Live Demo</button>
                        </div>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="reveal stagger-1" style={{
                        marginTop: 80,
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 20,
                        overflow: 'hidden',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{ width: '100%', height: 'clamp(300px, 50vh, 600px)', background: '#080810', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: 40, background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 8 }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#333' }} />
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#333' }} />
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#333' }} />
                            </div>
                            <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Intelligent Dashboard</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Unified control for all your content pipelines.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" style={{ padding: '120px 0', background: 'rgba(255,255,255,0.02)' }}>
                <div className="container">
                    <div className="reveal" style={{ textAlign: 'center', marginBottom: 80 }}>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, marginBottom: 20 }}>Powerful Features</h2>
                        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 600, margin: '0 auto' }}>Everything you need to automate your social media presence at scale.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
                        {[
                            { title: 'AI Generation', desc: 'Powerful AI models generating high-quality scripts and visuals automatically.', icon: '🤖' },
                            { title: 'Multi-Platform', desc: 'Seamlessly publish to TikTok, YouTube Shorts, and Instagram Reels.', icon: '📱' },
                            { title: 'Smart Scheduling', desc: 'Post at the perfect time for each platform using automated analytics.', icon: '⏰' },
                            { title: 'Brand Safety', desc: 'Automated content moderation and brand consistency checks.', icon: '🛡️' },
                            { title: 'Growth Analytics', desc: 'Detailed insights into your performance across all connected channels.', icon: '📊' },
                            { title: 'Cloud Rendering', desc: 'Fast, reliable video rendering in the cloud without slowing down your PC.', icon: '☁️' }
                        ].map((f, i) => (
                            <div key={i} className={`glass-card reveal stagger-${(i % 3) + 1}`} style={{ padding: '40px', borderRadius: 16 }}>
                                <div style={{ fontSize: 32, marginBottom: 24 }}>{f.icon}</div>
                                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
                                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '100px 0 50px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
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
