import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        alumniCount: 0,
        connections: 0,
        pendingRequests: 0,
        events: 0,
        messages: 0
    });
    const [recentAlumni, setRecentAlumni] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const [alumniRes, connectionsRes, eventsRes] = await Promise.all([
                api.get('/users/alumni'),
                api.get('/connections'),
                api.get('/events')
            ]);

            setStats({
                alumniCount: alumniRes.data.alumni?.length || 0,
                connections: connectionsRes.data.connections?.length || 0,
                pendingRequests: 0,
                events: eventsRes.data.events?.length || 0,
                messages: 0
            });

            setRecentAlumni(alumniRes.data.alumni?.slice(0, 3) || []);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('Logged out successfully');
    };

    const getInitial = (name) => name?.charAt(0).toUpperCase() || '?';

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <span className="text-sm font-medium">Loading dashboard…</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-100">

            {/* ── Sidebar ── */}
            <aside className="w-56 bg-slate-900 flex flex-col flex-shrink-0">
                {/* Brand */}
                <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        S
                    </div>
                    <div className="min-w-0">
                        <p className="text-white font-semibold text-sm leading-tight">Student Portal</p>
                        <p className="text-slate-500 text-xs truncate">{user?.name}</p>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
                    <Link
                        to="/student/dashboard"
                        className="block px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-semibold"
                    >
                        Dashboard
                    </Link>
                    {[
                        { to: '/student/profile',  label: 'Profile'  },
                        { to: '/student/alumni',   label: 'Alumni'   },
                        { to: '/student/events',   label: 'Events'   },
                        { to: '/student/messages', label: 'Messages' },
                    ].map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className="block px-3 py-2 rounded-lg text-slate-400 text-sm font-medium hover:bg-white/5 hover:text-white transition-colors"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="mx-3 mb-4 px-3 py-2 rounded-lg text-left text-red-400 text-sm font-medium hover:bg-white/5 transition-colors"
                >
                    Logout
                </button>
            </aside>

            {/* ── Main Content ── */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto px-8 py-8">

                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name}!</h1>
                        <p className="text-slate-400 text-sm mt-1">Here's what's happening in your network.</p>
                    </div>

                    {/* ── Stat Cards ── */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Alumni',      value: stats.alumniCount,  color: 'bg-blue-50 text-blue-600'   },
                            { label: 'Connections', value: stats.connections,  color: 'bg-emerald-50 text-emerald-600' },
                            { label: 'Events',      value: stats.events,       color: 'bg-violet-50 text-violet-600'  },
                            { label: 'Messages',    value: stats.messages,     color: 'bg-amber-50 text-amber-600'    },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
                                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-bold mb-3 ${color}`}>
                                    {value}
                                </div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
                                <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* ── Bottom Grid ── */}
                    <div className="grid grid-cols-2 gap-6">

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Quick Actions</h2>
                            <div className="space-y-2">
                                <Link
                                    to="/student/alumni"
                                    className="flex items-center gap-3 p-3.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-blue-800">Find Alumni Mentors</p>
                                        <p className="text-xs text-blue-500">Browse and connect with alumni</p>
                                    </div>
                                </Link>

                                <Link
                                    to="/student/events"
                                    className="flex items-center gap-3 p-3.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-emerald-800">Browse Events</p>
                                        <p className="text-xs text-emerald-500">Upcoming networking events</p>
                                    </div>
                                </Link>

                                <Link
                                    to="/student/messages"
                                    className="flex items-center gap-3 p-3.5 rounded-lg bg-violet-50 hover:bg-violet-100 transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-violet-800">View Messages</p>
                                        <p className="text-xs text-violet-500">Chat with your connections</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Featured Alumni */}
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Featured Alumni</h2>
                            <div className="space-y-3">
                                {recentAlumni.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
                                        <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="text-sm">No alumni found</p>
                                    </div>
                                ) : (
                                    recentAlumni.map(alum => (
                                        <div
                                            key={alum._id}
                                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all"
                                        >
                                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                                                {getInitial(alum.name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 truncate">{alum.name}</p>
                                                <p className="text-xs text-slate-400 truncate">{alum.company || 'Alumni'}</p>
                                            </div>
                                            <Link
                                                to="/student/alumni"
                                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                                            >
                                                Connect
                                            </Link>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;