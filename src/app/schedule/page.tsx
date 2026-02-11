'use client';

import { useState, useEffect } from 'react';

interface ScheduledPost {
    id: string;
    contentId: string;
    platform: string;
    scheduledAt: string;
    status: string;
    content?: { title: string; niche: string };
}

interface ContentItem {
    id: string;
    title: string;
    platform: string;
    status: string;
}

export default function SchedulePage() {
    const [scheduled, setScheduled] = useState<ScheduledPost[]>([]);
    const [readyContent, setReadyContent] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [selectedContentId, setSelectedContentId] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState<'youtube' | 'tiktok'>('youtube');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [schedRes, contentRes] = await Promise.all([
                fetch('/api/schedule'),
                fetch('/api/content'),
            ]);
            const schedData = await schedRes.json();
            const contentData = await contentRes.json();
            setScheduled(schedData.scheduled || []);
            setReadyContent((contentData.content || []).filter((c: any) => c.status === 'ready'));
        } catch (err) {
            console.error('Failed to fetch:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSchedule() {
        if (!selectedContentId || !selectedDate || !selectedTime) return;

        const scheduledAt = new Date(`${selectedDate}T${selectedTime}`).toISOString();
        try {
            await fetch('/api/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contentId: selectedContentId, platform: selectedPlatform, scheduledAt }),
            });
            setShowScheduleForm(false);
            setSelectedContentId('');
            setSelectedDate('');
            setSelectedTime('');
            fetchData();
        } catch (err) {
            console.error('Schedule failed:', err);
        }
    }

    function getDaysInMonth(date: Date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return { firstDay, daysInMonth };
    }

    function hasPostsOnDay(day: number) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return scheduled.some(s => {
            const sd = new Date(s.scheduledAt);
            return sd.getDate() === day && sd.getMonth() === date.getMonth() && sd.getFullYear() === date.getFullYear();
        });
    }

    const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
    const today = new Date();
    const isToday = (day: number) =>
        today.getDate() === day &&
        today.getMonth() === currentMonth.getMonth() &&
        today.getFullYear() === currentMonth.getFullYear();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div className="spinner" style={{ width: 40, height: 40 }} />
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>📅 Schedule</h2>
                    <p>Schedule your content for optimal publishing times</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowScheduleForm(true)}>
                    ➕ Schedule Post
                </button>
            </div>

            <div className="two-col">
                {/* Calendar */}
                <div className="card">
                    <div className="calendar-header">
                        <button className="btn btn-sm btn-secondary" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                            ◀
                        </button>
                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h3>
                        <button className="btn btn-sm btn-secondary" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                            ▶
                        </button>
                    </div>

                    <div className="calendar-grid">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="calendar-day-header">{d}</div>
                        ))}
                        {Array.from({ length: firstDay }, (_, i) => (
                            <div key={`empty-${i}`} className="calendar-day inactive" />
                        ))}
                        {Array.from({ length: daysInMonth }, (_, i) => {
                            const day = i + 1;
                            return (
                                <div
                                    key={day}
                                    className={`calendar-day ${isToday(day) ? 'today' : ''} ${hasPostsOnDay(day) ? 'has-posts' : ''}`}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Scheduled Posts */}
                <div className="card">
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📋 Scheduled Posts</h3>
                    {scheduled.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📅</div>
                            <h3>No scheduled posts</h3>
                            <p>Schedule your content to publish at the perfect time</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {scheduled.map(post => (
                                <div key={post.id} className="activity-item">
                                    <div className={`activity-icon schedule`}>
                                        {post.platform === 'youtube' ? '📺' : '🎵'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: 14, fontWeight: 600 }}>{post.content?.title || 'Content'}</h4>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                            {new Date(post.scheduledAt).toLocaleString()} • {post.platform}
                                        </div>
                                    </div>
                                    <span className={`badge ${post.status === 'pending' ? 'badge-pending' : post.status === 'published' ? 'badge-success' : 'badge-danger'}`}>
                                        {post.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Schedule Form Modal */}
            {showScheduleForm && (
                <div className="modal-overlay" onClick={() => setShowScheduleForm(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📅 Schedule New Post</h3>
                            <button className="btn btn-sm btn-secondary" onClick={() => setShowScheduleForm(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="input-group">
                                <label>Content</label>
                                <select className="input" value={selectedContentId} onChange={e => setSelectedContentId(e.target.value)}>
                                    <option value="">Select content...</option>
                                    {readyContent.map(c => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Platform</label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className={`btn btn-sm ${selectedPlatform === 'youtube' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelectedPlatform('youtube')}>📺 YouTube</button>
                                    <button className={`btn btn-sm ${selectedPlatform === 'tiktok' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelectedPlatform('tiktok')}>🎵 TikTok</button>
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Date</label>
                                <input type="date" className="input" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Time</label>
                                <input type="time" className="input" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowScheduleForm(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSchedule} disabled={!selectedContentId || !selectedDate || !selectedTime}>
                                📅 Schedule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
