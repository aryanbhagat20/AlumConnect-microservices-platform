import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const StudentProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        major: "",
        enrollmentYear: "",
        bio: "",
        profilePicture: "",
        phone: ""
    });
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name || "",
                email: user.email || "",
                major: user.major || "",
                enrollmentYear: user.enrollmentYear || "",
                bio: user.bio || "",
                profilePicture: user.profilePicture || "",
                phone: user.phone || ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updateData = {
                name: profile.name,
                major: profile.major,
                enrollmentYear: parseInt(profile.enrollmentYear),
                bio: profile.bio,
                profilePicture: profile.profilePicture,
                phone: profile.phone
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

    return (
        <div className="flex h-screen overflow-hidden bg-slate-100">

            {/* ── Sidebar ── */}
            <aside className="w-56 bg-slate-900 flex flex-col flex-shrink-0">
                <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
                    <img src="/AlumConnectLogo.png" alt="AlumConnect" className="w-8 h-8 rounded-lg object-contain bg-white flex-shrink-0" />
                    <div className="min-w-0">
                        <p className="text-white font-semibold text-sm leading-tight">Student Portal</p>
                        <p className="text-slate-500 text-xs truncate">{user?.name}</p>
                    </div>
                </div>
                <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
                    {[
                        { to: '/student/dashboard', label: 'Dashboard' },
                        { to: '/student/profile',   label: 'Profile',  active: true },
                        { to: '/student/alumni',    label: 'Alumni'   },
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
                <div className="max-w-3xl mx-auto px-8 py-8">

                    {/* Page Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
                            <p className="text-slate-400 text-sm mt-1">Manage your personal information and preferences.</p>
                        </div>
                        {!editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-5">

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-400 bg-slate-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Profile Picture URL</label>
                                    <input
                                        type="url"
                                        name="profilePicture"
                                        value={profile.profilePicture}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        placeholder="https://example.com/photo.jpg"
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Major</label>
                                        <select
                                            name="major"
                                            value={profile.major}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                                        >
                                            <option value="">Select Major</option>
                                            <option value="CSE">Computer Science</option>
                                            <option value="IT">Information Technology</option>
                                            <option value="ECE">Electronics & Communication</option>
                                            <option value="EEE">Electrical & Electronics</option>
                                            <option value="MECH">Mechanical</option>
                                            <option value="CIVIL">Civil</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Year</label>
                                        <select
                                            name="enrollmentYear"
                                            value={profile.enrollmentYear}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                                        >
                                            <option value="">Select Year</option>
                                            <option value="1">1st Year</option>
                                            <option value="2">2nd Year</option>
                                            <option value="3">3rd Year</option>
                                            <option value="4">4th Year</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Bio</label>
                                    <textarea
                                        name="bio"
                                        rows="4"
                                        value={profile.bio}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        placeholder="Tell us about yourself, your interests, and what you're looking for in a mentor..."
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition resize-none"
                                    />
                                </div>

                                {editing && (
                                    <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => setEditing(false)}
                                            className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
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

export default StudentProfile;