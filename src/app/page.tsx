'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
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

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/dashboard');
                router.refresh();
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

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

                    <div className="desktop-nav" style={{ display: 'flex', gap: 32, alignItems: 'center', flexShrink: 0 }}>
                        <a href="#features" style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)', transition: '0.2s' }}>Features</a>
                        <a href="#pricing" style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)', transition: '0.2s' }}>Pricing</a>
                        <Link href="/signup" className="btn btn-secondary" style={{ padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600 }}>Create Account</Link>
                    </div>

                    <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: '#fff', fontSize: 24, background: 'transparent', border: 'none', position: 'relative', zIndex: 1002 }}>
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>

                    {/* Mobile Menu Overlay */}
                    <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(5, 5, 10, 0.98)',
                        backdropFilter: 'blur(20px)',
                        zIndex: 1001,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 32,
                        transition: 'opacity 0.3s ease, visibility 0.3s ease',
                        opacity: mobileMenuOpen ? 1 : 0,
                        visibility: mobileMenuOpen ? 'visible' : 'hidden',
                    }}>
                        <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 24, fontWeight: 700 }}>Features</a>
                        <a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 24, fontWeight: 700 }}>Pricing</a>
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 24, fontWeight: 700 }}>Login</Link>
                        <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ padding: '16px 32px', fontSize: 18 }}>Create Account</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section Container */}
            <section style={{ padding: '200px 0 120px', position: 'relative', overflow: 'hidden' }}>
                <div className="hero-glow" style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(108, 92, 231, 0.15) 0%, transparent 70%)', zIndex: -1 }} />

                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                    {/* Left Side: Value Prop */}
                    <div className="reveal active">
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(108, 92, 231, 0.1)', border: '1px solid rgba(108, 92, 231, 0.2)', borderRadius: 100, marginBottom: 24, fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: 1 }}>
                            <span className="pulse" /> AI-POWERED AUTONOMY V2.0
                        </div>
                        <h1 style={{ fontSize: 'clamp(40px, 7vw, 84px)', fontWeight: 900, lineHeight: 1, letterSpacing: -2.5, marginBottom: 24, background: 'linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0.5))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Design. <br /> Generate. <br /> <span style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dominate.</span>
                        </h1>
                        <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 44, maxWidth: 540 }}>
                            The definitive full-stack ecosystem for autonomous content empires. Create, distribute, and scale your brand with zero-touch AI pipelines.
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>
                            <div className="stat-group">
                                <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>12.4M</div>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>Impressions</div>
                            </div>
                            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)' }} />
                            <div className="stat-group">
                                <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>98.2%</div>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>AI Precision</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Login Portal */}
                    <div className="reveal stagger-1">
                        <div className="glass-card" style={{ padding: '40px', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ marginBottom: 32 }}>
                                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Welcome back</h2>
                                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Enter your details to access your dashboard</p>
                            </div>

                            {error && (
                                <div style={{
                                    padding: '12px',
                                    background: 'rgba(255, 50, 50, 0.1)',
                                    borderRadius: 12,
                                    fontSize: 13,
                                    color: '#ff4d4d',
                                    border: '1px solid rgba(255, 50, 50, 0.2)',
                                    marginBottom: 20
                                }}>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            padding: '14px 16px',
                                            borderRadius: 12,
                                            color: '#fff',
                                            fontSize: 14,
                                            transition: '0.2s'
                                        }}
                                        className="input-focus"
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>Password</label>
                                        <a href="#" style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600 }}>Forgot?</a>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            padding: '14px 16px',
                                            borderRadius: 12,
                                            color: '#fff',
                                            fontSize: 14,
                                            transition: '0.2s'
                                        }}
                                        className="input-focus"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                    style={{ padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 15, marginTop: 10, position: 'relative' }}
                                >
                                    {loading ? <div className="spinner" style={{ width: 18, height: 18 }} /> : 'Log in to Platform'}
                                </button>
                            </form>

                            <div style={{ marginTop: 32, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                                New to AutoContent? <Link href="/signup" style={{ color: '#fff', fontWeight: 600 }}>Create an account</Link>
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
                .pulse {
                    width: 8px;
                    height: 8px;
                    background: var(--accent-primary);
                    border-radius: 50%;
                    box-shadow: 0 0 0 transparent;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(108, 92, 231, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(108, 92, 231, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(108, 92, 231, 0); }
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    transition: transform 0.3s ease, border-color 0.3s ease;
                }
                .glass-card:hover {
                    border-color: rgba(108, 92, 231, 0.3);
                    transform: translateY(-5px);
                }
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
