import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const StudentEvents = () => {
    const [events, setEvents] = useState([]);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await api.get('/events');
            setEvents(response.data.events || []);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (eventId) => {
        setRegistering(eventId);
        try {
            setRegisteredEvents([...registeredEvents, eventId]);
            toast.success('Registered for event successfully!');
        } catch (error) {
            toast.error('Failed to register for event');
        } finally {
            setRegistering(null);
        }
    };

    const handleUnregister = async (eventId) => {
        try {
            setRegisteredEvents(registeredEvents.filter(id => id !== eventId));
            toast.success('Unregistered from event');
        } catch (error) {
            toast.error('Failed to unregister');
        }
    };

    const isRegistered = (eventId) => registeredEvents.includes(eventId);

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('Logged out successfully');
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <span className="text-sm font-medium">Loading events…</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-100">

            {/* ── Sidebar ── */}
            <aside className="w-56 bg-slate-900 flex flex-col flex-shrink-0">
                <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        S
                    </div>
                    <div className="min-w-0">
                        <p className="text-white font-semibold text-sm leading-tight">Student Portal</p>
                        <p className="text-slate-500 text-xs truncate">{user?.name}</p>
                    </div>
                </div>
                <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
                    {[
                        { to: '/student/dashboard', label: 'Dashboard' },
                        { to: '/student/profile',   label: 'Profile'  },
                        { to: '/student/alumni',    label: 'Alumni'   },
                        { to: '/student/events',    label: 'Events',   active: true },
                        { to: '/student/messages',  label: 'Messages' },
                    ].map(({ to, label, active }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                active
                                    ? 'bg-blue-500/20 text-blue-400 font-semibold'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
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
                <div className="max-w-4xl mx-auto px-8 py-8">

                    {/* Page Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Events</h1>
                            <p className="text-slate-400 text-sm mt-1">Browse and register for upcoming networking events.</p>
                        </div>
                        {registeredEvents.length > 0 && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-full text-xs font-semibold">
                                {registeredEvents.length} Registered
                            </span>
                        )}
                    </div>

                    {events.length === 0 ? (
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
                            <svg className="w-10 h-10 text-slate-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-slate-400 text-sm">No events available</p>
                        </div>
                    ) : (
                        <>
                            {/* All Events */}
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-4">All Events</p>
                            <div className="space-y-3 mb-10">
                                {events.map(event => {
                                    const registered = isRegistered(event._id);
                                    return (
                                        <div
                                            key={event._id}
                                            className={`bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-all ${
                                                registered ? 'border-emerald-100' : 'border-slate-100'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h2 className="text-sm font-semibold text-slate-800">{event.title}</h2>
                                                        {registered && (
                                                            <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full font-medium">
                                                                Registered
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-slate-500 text-xs leading-relaxed mb-3">{event.description}</p>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {new Date(event.date).toLocaleDateString()} · {new Date(event.date).toLocaleTimeString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {event.location || 'Online'}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            {event.createdBy?.name || 'Alumni'}
                                                        </span>
                                                        {event.maxAttendees && (
                                                            <span className="flex items-center gap-1">
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                {event.attendees?.length || 0} / {event.maxAttendees}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {registered ? (
                                                        <button
                                                            onClick={() => handleUnregister(event._id)}
                                                            className="px-4 py-2 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-colors"
                                                        >
                                                            Unregister
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleRegister(event._id)}
                                                            disabled={registering === event._id}
                                                            className="px-4 py-2 text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg disabled:opacity-50 transition-colors"
                                                        >
                                                            {registering === event._id ? 'Registering…' : 'Register'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* My Registered Events */}
                            {registeredEvents.length > 0 && (
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-4">My Registered Events</p>
                                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-50">
                                        {events
                                            .filter(event => registeredEvents.includes(event._id))
                                            .map(event => (
                                                <div key={event._id} className="flex justify-between items-center px-5 py-4">
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800">{event.title}</p>
                                                        <p className="text-xs text-slate-400 mt-0.5">
                                                            {new Date(event.date).toLocaleDateString()} · {new Date(event.date).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleUnregister(event._id)}
                                                        className="text-xs text-red-400 font-semibold hover:text-red-600 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentEvents;