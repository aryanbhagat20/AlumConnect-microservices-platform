import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Alumni Connect
          </h1>
          <p className="text-xl text-slate-500">
            Where mentors meet ambition
          </p>
        </div>
        
        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Alumni Card */}
          <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-8 text-center">
              <div className="text-5xl mb-4">🎓</div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Alumni</h2>
              <p className="text-slate-500 mb-6">Share your journey, inspire the next generation</p>
              <Link 
                to="/alumni/login" 
                className="inline-block w-full bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
              <Link 
                to="/alumni/signup" 
                className="inline-block mt-3 text-sm text-indigo-600 font-medium hover:text-indigo-700"
              >
                Create account →
              </Link>
            </div>
          </div>
          
          {/* Student Card */}
          <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-8 text-center">
              <div className="text-5xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Student</h2>
              <p className="text-slate-500 mb-6">Learn from those who've walked the path</p>
              <Link 
                to="/student/login" 
                className="inline-block w-full bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
          
          {/* Admin Card */}
          <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-8 text-center">
              <div className="text-5xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Admin</h2>
              <p className="text-slate-500 mb-6">Oversee and manage the community</p>
              <Link 
                to="/admin/login" 
                className="inline-block w-full bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Access Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-slate-400 text-sm mt-16">
          Join a community of alumni and students
        </p>
      </div>
    </div>
  );
}