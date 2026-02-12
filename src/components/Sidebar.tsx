'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
    { href: '/dashboard', icon: '📊', label: 'Dashboard' },
    { href: '/studio', icon: '🎬', label: 'Studio' },
    { href: '/forge', icon: '🔥', label: 'Forge' },
    { href: '/publish', icon: '🚀', label: 'Publish' },
    { href: '/automation', icon: '⚡', label: 'Compute' },
    { href: '/settings', icon: '⚙️', label: 'Settings' },
    { href: '/schedule', icon: '📅', label: 'Schedule' },
];

// ... inside component ...



export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthPage = pathname === '/login' || pathname === '/signup';

    useEffect(() => {
        if (isAuthPage) {
            setLoading(false);
            return;
        }

        async function checkAuth() {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                if (data.user) {
                    setUser(data.user);
                } else {
                    router.push('/login');
                }
            } catch (err) {
                console.error('Auth check failed:', err);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, [pathname, router, isAuthPage]);

    async function handleLogout() {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
            router.refresh();
        } catch (err) {
            console.error('Logout failed:', err);
        }
    }

    if (isAuthPage) return null;
    if (loading) return <aside className="sidebar" style={{ opacity: 0.5 }} />;

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">🤖</div>
                    <div>
                        <h1>AutoContent AI</h1>
                        <span>Fully Automated</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <span className="nav-section-label">Main</span>
                    {navItems.slice(0, 5).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}

                    <span className="nav-section-label">System</span>
                    {navItems.slice(5).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ marginBottom: '12px', padding: '0 8px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700 }}>{user?.name || 'User'}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{user?.email}</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="nav-item"
                        style={{ width: '100%', cursor: 'pointer', textAlign: 'left', background: 'rgba(255, 71, 87, 0.05)', border: 'none', color: 'inherit' }}
                    >
                        <span className="nav-icon">🚪</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="mobile-nav">
                <div className="mobile-nav-items">
                    {/* Show top 5 items for mobile, prioritizing Settings */}
                    {navItems.slice(0, 5).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`mobile-nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </div>
            </nav>
        </>
    );
}
