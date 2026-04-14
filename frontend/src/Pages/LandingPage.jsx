import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-gray-100 to-stone-200 flex flex-col relative overflow-hidden">

      {/* ── Subtle background decorations ── */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-violet-100/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      {/* ── Navbar ── */}
      <nav className="w-full px-6 py-5 flex items-center justify-between max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-xl shadow-sm">
            <img src="/AlumConnectLogo.png" alt="AlumConnect Logo" className="h-12 w-12 object-contain" />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-800 tracking-tight block leading-tight">AlumConnect</span>
            <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">VIT University</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/alumni/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2.5 rounded-lg hover:bg-white/60"
          >
            Alumni Login
          </Link>
          <Link
            to="/student/login"
            className="text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 transition-all px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg"
          >
            Student Login
          </Link>
        </div>
      </nav>

      {/* ── Divider line ── */}
      <div className="max-w-6xl mx-auto w-full px-6">
        <div className="border-t border-slate-200/80" />
      </div>

      {/* ── Hero Section ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16 pt-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          {/* Logo with glow effect */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-200/30 rounded-full blur-2xl scale-150" />
              <div className="relative bg-white p-1 rounded-2xl shadow-lg">
                <img
                  src="/AlumConnectLogo.png"
                  alt="VIT AlumConnect"
                  className="h-48 w-48 object-contain"
                />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
            VIT AlumConnect
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-300" />
            <p className="text-base text-slate-500 font-semibold tracking-wide">
              Connect · Collaborate · Succeed
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-300" />
          </div>
          <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto leading-relaxed">
            A platform bridging the gap between alumni and students —
            mentorship, networking, and opportunities all in one place.
          </p>
        </div>

        {/* ── Role Cards ── */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full mx-auto">

          {/* Alumni Card */}
          <div className="group bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-7 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Alumni</h2>
              <p className="text-slate-400 text-sm mb-6">Share your journey, inspire the next generation</p>
              <Link
                to="/alumni/login"
                className="block w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold text-sm px-5 py-3 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-sm hover:shadow-md"
              >
                Get Started
              </Link>
              <Link
                to="/alumni/signup"
                className="inline-block mt-3 text-xs text-indigo-500 font-medium hover:text-indigo-700 transition-colors"
              >
                Create account →
              </Link>
            </div>
          </div>

          {/* Student Card */}
          <div className="group bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-7 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Student</h2>
              <p className="text-slate-400 text-sm mb-6">Learn from those who've walked the path</p>
              <Link
                to="/student/login"
                className="block w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-sm px-5 py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-sm hover:shadow-md"
              >
                Get Started
              </Link>
              <Link
                to="/student/register"
                className="inline-block mt-3 text-xs text-emerald-500 font-medium hover:text-emerald-700 transition-colors"
              >
                New student? Register →
              </Link>
            </div>
          </div>

          {/* Admin Card */}
          <div className="group bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:border-slate-400 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-slate-600 to-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-7 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Admin</h2>
              <p className="text-slate-400 text-sm mb-6">Oversee and manage the community</p>
              <Link
                to="/admin/login"
                className="block w-full bg-gradient-to-r from-slate-700 to-slate-800 text-white font-semibold text-sm px-5 py-3 rounded-xl hover:from-slate-800 hover:to-slate-900 transition-all shadow-sm hover:shadow-md"
              >
                Access Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="mt-16 text-center">
          <div className="h-px w-24 bg-slate-300/50 mx-auto mb-4" />
          <p className="text-slate-400 text-xs">
            © 2025 VIT AlumConnect — Global Alumni Network
          </p>
        </div>
      </div>
    </div>
  );
}