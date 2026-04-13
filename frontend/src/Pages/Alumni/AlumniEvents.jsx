import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AlumniEvents = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "", description: "", date: "", location: "",
        mode: "online", targetAudience: "all", maxAttendees: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const eventData = {
                title: formData.title,
                description: formData.description,
                date: formData.date,
                location: formData.location,
                targetAudience: formData.targetAudience,
                maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined
            };
            await api.post('/events', eventData);
            toast.success('Event created successfully!');
            setFormData({ title: "", description: "", date: "", location: "", mode: "online", targetAudience: "all", maxAttendees: "" });
        } catch (error) {
            console.error('Error creating event:', error);
            toast.error(error.response?.data?.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('Logged out successfully');
    };

    const inputClass = "w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";

    return (
        <div className="flex h-screen overflow-hidden bg-slate-100">

            {/* ── Sidebar ── */}
            <aside className="w-56 bg-slate-900 flex flex-col flex-shrink-0">
                <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        A
                    </div>
                    <div className="min-w-0">
                        <p className="text-white font-semibold text-sm leading-tight">Alumni Portal</p>
                        <p className="text-slate-500 text-xs truncate">{user?.name}</p>
                    </div>
                </div>

                <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
                    {[
                        { to: '/alumni/dashboard', label: 'Dashboard' },
                        { to: '/alumni/profile',   label: 'Profile'   },
                        { to: '/alumni/requests',  label: 'Requests'  },
                        { to: '/alumni/events',    label: 'Events'    },
                        { to: '/alumni/chat',      label: 'Chat'      },
                    ].map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                to === '/alumni/events'
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
                <div className="max-w-3xl mx-auto px-8 py-8">

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-800">Create Alumni Event</h1>
                        <p className="text-slate-400 text-sm mt-1">Fill in the details to host a new event.</p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Event Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="e.g., Alumni Networking Night 2024"
                                        className={inputClass}
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Description *</label>
                                    <textarea
                                        name="description"
                                        placeholder="Describe the event, agenda, speakers, etc."
                                        rows="4"
                                        className={`${inputClass} resize-none`}
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Date & Time *</label>
                                    <input
                                        type="datetime-local"
                                        name="date"
                                        className={inputClass}
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            placeholder="e.g., Bangalore or Online"
                                            className={inputClass}
                                            value={formData.location}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Mode</label>
                                        <select name="mode" className={inputClass} value={formData.mode} onChange={handleChange}>
                                            <option value="online">Online</option>
                                            <option value="offline">Offline</option>
                                            <option value="hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Target Audience</label>
                                        <select name="targetAudience" className={inputClass} value={formData.targetAudience} onChange={handleChange}>
                                            <option value="all">All Users</option>
                                            <option value="alumni">Alumni Only</option>
                                            <option value="student">Students Only</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Max Attendees (Optional)</label>
                                        <input
                                            type="number"
                                            name="maxAttendees"
                                            placeholder="Leave blank for unlimited"
                                            className={inputClass}
                                            value={formData.maxAttendees}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        {loading ? 'Creating Event…' : 'Create Event'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlumniEvents;