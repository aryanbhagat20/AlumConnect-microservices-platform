import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AlumniDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ connections: 0, pendingRequests: 0, events: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentRequests();
  }, []);

  const fetchStats = async () => {
    try {
      const [connectionsRes, requestsRes, eventsRes] = await Promise.all([
        api.get('/connections'),
        api.get('/connections/pending'),
        api.get('/events')
      ]);
      const myEvents = eventsRes.data.events?.filter(event => {
        const creatorId = typeof event.createdBy === 'object' ? event.createdBy?._id : event.createdBy;
        return creatorId === user?._id;
      }) || [];
      setStats({
        connections: connectionsRes.data.connections?.length || 0,
        pendingRequests: requestsRes.data.requests?.length || 0,
        events: myEvents.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const fetchRecentRequests = async () => {
    try {
      const response = await api.get('/connections/pending');
      setRecentRequests(response.data.requests?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
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
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <img src="/AlumConnectLogo.png" alt="AlumConnect" className="w-8 h-8 rounded-lg object-contain bg-white flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm leading-tight">Alumni Portal</p>
            <p className="text-slate-500 text-xs truncate">{user?.name}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
          <Link
            to="/alumni/dashboard"
            className="block px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-semibold"
          >
            Dashboard
          </Link>
          {[
            { to: '/alumni/profile',   label: 'Profile'   },
            { to: '/alumni/requests',  label: 'Requests'  },
            { to: '/alumni/events',    label: 'Events'    },
            { to: '/alumni/chat',      label: 'Chat'      },
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

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name}!</h1>
            <p className="text-slate-400 text-sm mt-1">Here's what's happening in your network.</p>
          </div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Connections',      value: stats.connections,     color: 'bg-blue-50 text-blue-600'      },
              { label: 'Pending Requests', value: stats.pendingRequests, color: 'bg-amber-50 text-amber-600'    },
              { label: 'Your Events',      value: stats.events,          color: 'bg-emerald-50 text-emerald-600' },
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
                  to="/alumni/events"
                  className="flex items-center gap-3 p-3.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">Create Event</p>
                    <p className="text-xs text-emerald-500">Host a new alumni event</p>
                  </div>
                </Link>

                <Link
                  to="/alumni/requests"
                  className="flex items-center gap-3 p-3.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-800">View Requests ({stats.pendingRequests})</p>
                    <p className="text-xs text-blue-500">Manage connection requests</p>
                  </div>
                </Link>

                <Link
                  to="/alumni/chat"
                  className="flex items-center gap-3 p-3.5 rounded-lg bg-violet-50 hover:bg-violet-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-violet-800">Open Chat</p>
                    <p className="text-xs text-violet-500">Message your connections</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Requests */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Recent Connection Requests</h2>
              <div className="space-y-3">
                {recentRequests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
                    <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm">No pending requests</p>
                  </div>
                ) : (
                  recentRequests.map(req => (
                    <div
                      key={req._id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all"
                    >
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm flex-shrink-0">
                        {getInitial(req.requester?.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{req.requester?.name}</p>
                        <p className="text-xs text-slate-400 truncate capitalize">{req.requester?.role}</p>
                      </div>
                      <Link
                        to="/alumni/requests"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                      >
                        Review
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
}