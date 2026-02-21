'use client';

import { useEffect, useMemo, useState } from 'react';

type Team = {
    name: string;
    shortName: string;
    score: string;
    overs: string;
};

type LiveMatch = {
    id: string;
    status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
    format: string;
    series: string;
    venue: string;
    startTime: string;
    teamA: Team;
    teamB: Team;
    currentInnings: string;
    lastUpdated: string;
};

export default function LiveCricketPage() {
    const [matches, setMatches] = useState<LiveMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'COMPLETED'>('LIVE');

    async function loadMatches() {
        try {
            const response = await fetch('/api/matches', { cache: 'no-store' });
            if (!response.ok) {
                throw new Error('Failed to load match data.');
            }
            const data = await response.json();
            setMatches(data.matches ?? []);
            setError('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unexpected error while loading matches.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMatches();
        const timer = setInterval(loadMatches, 30000);
        return () => clearInterval(timer);
    }, []);

    const filteredMatches = useMemo(() => {
        if (activeTab === 'ALL') {
            return matches;
        }
        return matches.filter((match) => match.status === activeTab);
    }, [activeTab, matches]);

    return (
        <main className="cricket-page">
            <section className="cricket-hero">
                <p className="eyebrow">Live Cricket Center</p>
                <h1>Live Cricket Match Results</h1>
                <p>Track real-time scores, innings summaries, and match status updates from one dashboard.</p>
                <div className="actions-row">
                    {(['LIVE', 'UPCOMING', 'COMPLETED', 'ALL'] as const).map((tab) => (
                        <button
                            key={tab}
                            className={activeTab === tab ? 'tab-btn active' : 'tab-btn'}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </section>

            {loading && <p className="state-text">Loading latest scores...</p>}
            {error && <p className="state-text error">{error}</p>}

            {!loading && !error && filteredMatches.length === 0 && (
                <p className="state-text">No matches found for this filter.</p>
            )}

            <section className="matches-grid">
                {filteredMatches.map((match) => (
                    <article key={match.id} className="match-card">
                        <div className="card-top-row">
                            <span className={`status-pill ${match.status.toLowerCase()}`}>{match.status}</span>
                            <span>{match.format}</span>
                        </div>
                        <h2>{match.series}</h2>
                        <p className="meta">{match.venue}</p>

                        <div className="score-row">
                            <div>
                                <strong>{match.teamA.shortName}</strong>
                                <p>{match.teamA.name}</p>
                            </div>
                            <div className="score-block">
                                <strong>{match.teamA.score || '-'}</strong>
                                <span>{match.teamA.overs || '-'}</span>
                            </div>
                        </div>

                        <div className="score-row">
                            <div>
                                <strong>{match.teamB.shortName}</strong>
                                <p>{match.teamB.name}</p>
                            </div>
                            <div className="score-block">
                                <strong>{match.teamB.score || '-'}</strong>
                                <span>{match.teamB.overs || '-'}</span>
                            </div>
                        </div>

                        <p className="innings">{match.currentInnings}</p>
                        <div className="card-footer">
                            <span>Start: {new Date(match.startTime).toLocaleString()}</span>
                            <span>Updated: {new Date(match.lastUpdated).toLocaleTimeString()}</span>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}
