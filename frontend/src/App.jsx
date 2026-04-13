import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Pages
import LandingPage from './Pages/LandingPage';

// Alumni Pages
import AlumniLogin from './Pages/Alumni/AlumniLogin';
import AlumniSignup from './Pages/Alumni/AlumniSignup';
import AlumniDashboard from './Pages/Alumni/AlumniDashboard';
import AlumniProfile from './Pages/Alumni/AlumniProfile';
import AlumniRequests from './Pages/Alumni/AlumniRequests';
import AlumniEvents from './Pages/Alumni/AlumniEvents';
import AlumniChat from './Pages/Alumni/AlumniChat';
 
// Student Pages
import StudentLogin from './Pages/Student/StudentLogin';
import StudentRegister from './Pages/Student/StudentRegister';
import StudentDashboard from './Pages/Student/StudentDashboard';
import StudentProfile from './Pages/Student/StudentProfile';
import AlumniDirectory from './Pages/Student/AlumniDirectory';
import StudentEvents from './Pages/Student/StudentEvents';
import StudentMessages from './Pages/Student/StudentMessages';

// Admin Pages
import AdminLogin from './Pages/Admin/AdminLogin';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminUsers from './Pages/Admin/ManageUsers';
import AdminEvents from './Pages/Admin/AdminEvents';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Alumni Routes */}
        <Route path="/alumni/login" element={<AlumniLogin />} />
        <Route path="/alumni/signup" element={<AlumniSignup />} />
        <Route path="/alumni/dashboard" element={
          <ProtectedRoute allowedRoles={['alumni', 'admin']}>
            <AlumniDashboard />
          </ProtectedRoute>
        } />
        <Route path="/alumni/profile" element={
          <ProtectedRoute allowedRoles={['alumni', 'admin']}>
            <AlumniProfile />
          </ProtectedRoute>
        } />
        <Route path="/alumni/requests" element={
          <ProtectedRoute allowedRoles={['alumni', 'admin']}>
            <AlumniRequests />
          </ProtectedRoute>
        } />
        <Route path="/alumni/events" element={
          <ProtectedRoute allowedRoles={['alumni', 'admin']}>
            <AlumniEvents />
          </ProtectedRoute>
        } />
        <Route path="/alumni/chat" element={
          <ProtectedRoute allowedRoles={['alumni', 'admin']}>
            <AlumniChat />
          </ProtectedRoute>
        } />
        <Route path="/alumni/chat/:userId" element={
          <ProtectedRoute allowedRoles={['alumni', 'admin']}>
            <AlumniChat />
          </ProtectedRoute>
        } />
        
        {/* Student Routes */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/profile" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentProfile />
          </ProtectedRoute>
        } />
        <Route path="/student/alumni" element={
          <ProtectedRoute allowedRoles={['student']}>
            <AlumniDirectory />
          </ProtectedRoute>
        } />
        <Route path="/student/events" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentEvents />
          </ProtectedRoute>
        } />
        <Route path="/student/messages" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentMessages />
          </ProtectedRoute>
        } />
        <Route path="/student/messages/:userId" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentMessages />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/events" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminEvents />
          </ProtectedRoute>
        } />
        
        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;