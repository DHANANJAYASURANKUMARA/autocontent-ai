'use client';

import { useState, useEffect } from 'react';

export default function DatabasePage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const res = await fetch('/api/debug/db');
            if (!res.ok) throw new Error('Failed to fetch DB data');
            const json = await res.json();
            setData(json);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="p-8">Loading database...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">🗄️ Database Inspection</h2>

            <div className="space-y-8">
                <section className="card p-6">
                    <h3 className="text-xl font-semibold mb-4 text-purple-400">Users</h3>
                    <div className="overflow-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="pb-2">Name</th>
                                    <th className="pb-2">Email</th>
                                    <th className="pb-2">Password</th>
                                    <th className="pb-2">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.users?.map((u: any) => (
                                    <tr key={u.id} className="border-b border-gray-800">
                                        <td className="py-2">{u.name}</td>
                                        <td className="py-2">{u.email}</td>
                                        <td className="py-2 font-mono text-xs">{u.password}</td>
                                        <td className="py-2 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="card p-6">
                    <h3 className="text-xl font-semibold mb-4 text-blue-400">Sessions</h3>
                    <div className="overflow-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="pb-2">Session ID</th>
                                    <th className="pb-2">User ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.sessions?.map((s: any) => (
                                    <tr key={s.id} className="border-b border-gray-800">
                                        <td className="py-2 font-mono text-xs">{s.id}</td>
                                        <td className="py-2 font-mono text-xs">{s.userId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <p className="text-xs text-gray-500 mt-8">
                    Note: This is a debug view. In a real production app, passwords should be hashed and this page would be restricted.
                </p>
            </div>
        </div>
    );
}
