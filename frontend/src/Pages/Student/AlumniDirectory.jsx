import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AlumniDirectory = () => {
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sendingRequest, setSendingRequest] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAlumni();
    }, []);

    const fetchAlumni = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/alumni');
            const allAlumni = response.data.alumni || [];
            const filteredAlumni = allAlumni.filter(alum => alum._id !== user?._id);
            setAlumni(filteredAlumni);
        } catch (error) {
            console.error('Error fetching alumni:', error);
            toast.error('Failed to load alumni');
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (alumniId) => {
        if (alumniId === user?._id) {
            toast.error("You cannot connect with yourself");
            return;
        }
        setSendingRequest(alumniId);
        try {
            await api.post(`/connections/request/${alumniId}`);
            toast.success('Connection request sent!');
        } catch (error) {
            console.error('Error sending request:', error);
            toast.error(error.response?.data?.message || 'Failed to send request');
        } finally {
            setSendingRequest(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('Logged out successfully');
    };

    const filteredAlumni = alumni.filter(alum =>
        alum.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alum.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alum.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitial = (name) => name?.charAt(0).toUpperCase() || '?';

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <span className="text-sm font-medium">Loading alumni…</span>
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
                        { to: '/student/alumni',    label: 'Alumni',   active: true },
                        { to: '/student/events',    label: 'Events'   },
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
                <div className="max-w-5xl mx-auto px-8 py-8">

                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-800">Alumni Directory</h1>
                        <p className="text-slate-400 text-sm mt-1">Connect with alumni mentors from your college.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by name, company, or role…"
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Results count */}
                    {filteredAlumni.length > 0 && (
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-4">
                            {filteredAlumni.length} alumni found
                        </p>
                    )}

                    {filteredAlumni.length === 0 ? (
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
                            <svg className="w-10 h-10 text-slate-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="text-slate-400 text-sm">No alumni found</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredAlumni.map(alum => (
                                <div
                                    key={alum._id}
                                    className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 hover:border-slate-200 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start gap-3">
                                        {alum.profilePicture ? (
                                            <img
                                                src={alum.profilePicture}
                                                alt={alum.name}
                                                className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-base flex-shrink-0">
                                                {getInitial(alum.name)}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-800 text-sm truncate">{alum.name}</p>
                                            <p className="text-slate-500 text-xs truncate">{alum.jobTitle || 'Professional'}</p>
                                            {alum.company && (
                                                <p className="text-slate-400 text-xs truncate">at {alum.company}</p>
                                            )}
                                            {alum.graduationYear && (
                                                <span className="inline-block mt-1.5 text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                                                    Batch of {alum.graduationYear}
                                                </span>
                                            )}
                                            {alum.bio && (
                                                <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">{alum.bio}</p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleConnect(alum._id)}
                                        disabled={sendingRequest === alum._id}
                                        className="mt-4 w-full bg-blue-500 text-white text-xs font-semibold py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                                    >
                                        {sendingRequest === alum._id ? 'Sending…' : 'Connect'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlumniDirectory;