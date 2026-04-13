import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AlumniProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        name: "", email: "", company: "", jobTitle: "",
        branch: "", graduationYear: "", bio: "",
        profilePicture: "", phone: "", linkedIn: ""
    });
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name || "",
                email: user.email || "",
                company: user.company || "",
                jobTitle: user.jobTitle || "",
                branch: user.major || "",
                graduationYear: user.graduationYear || "",
                bio: user.bio || "",
                profilePicture: user.profilePicture || "",
                phone: user.phone || "",
                linkedIn: user.linkedIn || ""
            });
        }
    }, [user]);

    const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updateData = {
                name: profile.name,
                company: profile.company,
                jobTitle: profile.jobTitle,
                major: profile.branch,
                graduationYear: parseInt(profile.graduationYear),
                bio: profile.bio,
                profilePicture: profile.profilePicture,
                phone: profile.phone,
                linkedIn: profile.linkedIn
            };
            const response = await api.put('/users/profile', updateData);
            toast.success('Profile updated successfully!');
            setEditing(false);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('Logged out successfully');
    };

    const inputClass = (disabled) =>
        `w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            disabled ? 'bg-slate-50 border-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white border-slate-200 text-slate-800'
        }`;

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
                                to === '/alumni/profile'
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

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Alumni Profile</h1>
                            <p className="text-slate-400 text-sm mt-1">Manage your personal information.</p>
                        </div>
                        {!editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Full Name</label>
                                    <input type="text" name="name" value={profile.name} onChange={handleChange} disabled={!editing} className={inputClass(!editing)} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
                                    <input type="email" name="email" value={profile.email} disabled className={inputClass(true)} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Company</label>
                                        <input type="text" name="company" value={profile.company} onChange={handleChange} disabled={!editing} className={inputClass(!editing)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Job Title</label>
                                        <input type="text" name="jobTitle" value={profile.jobTitle} onChange={handleChange} disabled={!editing} className={inputClass(!editing)} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Branch</label>
                                        <select name="branch" value={profile.branch} onChange={handleChange} disabled={!editing} className={inputClass(!editing)}>
                                            <option value="">Select Branch</option>
                                            {['CSE','IT','ECE','EEE','MECH','CIVIL'].map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Graduation Year</label>
                                        <input type="number" name="graduationYear" value={profile.graduationYear} onChange={handleChange} disabled={!editing} className={inputClass(!editing)} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Profile Picture URL</label>
                                    <input type="url" name="profilePicture" value={profile.profilePicture} onChange={handleChange} disabled={!editing} placeholder="https://example.com/photo.jpg" className={inputClass(!editing)} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Phone</label>
                                    <input type="tel" name="phone" value={profile.phone} onChange={handleChange} disabled={!editing} className={inputClass(!editing)} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">LinkedIn Profile</label>
                                    <input type="url" name="linkedIn" value={profile.linkedIn} onChange={handleChange} disabled={!editing} placeholder="https://linkedin.com/in/username" className={inputClass(!editing)} />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Bio</label>
                                    <textarea name="bio" rows="4" value={profile.bio} onChange={handleChange} disabled={!editing} className={`${inputClass(!editing)} resize-none`} />
                                </div>

                                {editing && (
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditing(false)}
                                            className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                        >
                                            {loading ? 'Saving…' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlumniProfile;