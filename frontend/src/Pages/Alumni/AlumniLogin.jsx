import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import toast from 'react-hot-toast';

export default function AlumniLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password, 'alumni');
    if (result.success) {
      toast.success('Login successful!');
      navigate('/alumni/dashboard');
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-gray-100 to-stone-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-200/15 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back to home */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          {/* Logo */}
          <div className="flex justify-center mb-5">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-2xl shadow-sm">
              <img src="/AlumConnectLogo.png" alt="AlumConnect" className="h-20 w-20 object-contain" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">Alumni Login</h2>
          <p className="text-sm text-slate-400 text-center mb-6">Welcome back! Sign in to continue</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-slate-600 text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-slate-600 text-sm font-medium mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-3.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 transition-all shadow-md hover:shadow-lg text-sm"
            >
              {loading ? 'Logging in...' : 'Login as Alumni'}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/alumni/signup" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}