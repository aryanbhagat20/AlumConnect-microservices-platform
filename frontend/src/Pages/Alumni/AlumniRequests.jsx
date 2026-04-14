import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AlumniRequests() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/connections/pending');
      setRequests(response.data.requests);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (connectionId) => {
    setProcessingId(connectionId);
    try {
      await api.put(`/connections/accept/${connectionId}`);
      toast.success('Request accepted! You are now connected.');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (connectionId) => {
    setProcessingId(connectionId);
    try {
      await api.put(`/connections/reject/${connectionId}`);
      toast.success('Request rejected');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to reject request');
    } finally {
      setProcessingId(null);
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
          <span className="text-sm font-medium">Loading requests…</span>
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
                to === '/alumni/requests'
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
            <h1 className="text-2xl font-bold text-slate-800">Connection Requests</h1>
            <p className="text-slate-400 text-sm mt-1">
              {requests.length > 0 ? `${requests.length} pending request${requests.length > 1 ? 's' : ''}` : 'No pending requests'}
            </p>
          </div>

          {requests.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 flex flex-col items-center gap-3 text-slate-400">
              <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm font-medium">No pending requests</p>
              <p className="text-xs text-slate-300">When students connect with you, requests will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className="bg-white rounded-xl border border-slate-100 shadow-sm p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm flex-shrink-0">
                      {getInitial(req.requester?.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{req.requester?.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{req.requester?.role}</p>
                      {req.requester?.major && (
                        <p className="text-xs text-slate-400 mt-0.5">Major: {req.requester.major}</p>
                      )}
                      {req.message && (
                        <div className="mt-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                          <p className="text-xs text-slate-600 italic">"{req.message}"</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleAccept(req._id)}
                        disabled={processingId === req._id}
                        className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                      >
                        {processingId === req._id ? 'Processing…' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        disabled={processingId === req._id}
                        className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}