import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
    title: 'AutoContent AI — Automated Content Platform',
    description: 'Fully automated TikTok & YouTube content creation, video generation, publishing, and sharing platform',
    manifest: '/manifest.json',
    themeColor: '#6c5ce7',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div className="app-bg" />
                <div className="app-layout">
                    <Sidebar />
                    <main className="main-content">
                        {children}
                    </main>
                </div>
                <div id="toast-root" className="toast-container" />
                <div id="modal-root" />
            </body>
        </html>
    );
}
