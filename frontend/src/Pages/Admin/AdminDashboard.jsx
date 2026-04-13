import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        alumni: 0,
        students: 0,
        activeEvents: 0,
        pendingConnections: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch all data in parallel
            const [usersRes, alumniRes, studentsRes, eventsRes, connectionsRes] = await Promise.all([
                api.get('/users'),
                api.get('/users/alumni'),
                api.get('/users/students'),
                api.get('/events'),
                api.get('/connections/pending')
            ]);
            
            setStats({
                totalUsers: usersRes.data.users?.length || 0,
                alumni: alumniRes.data.alumni?.length || 0,
                students: studentsRes.data.students?.length || 0,
                activeEvents: eventsRes.data.events?.length || 0,
                pendingConnections: connectionsRes.data.requests?.length || 0
            });
            
            // Get recent users (last 5)
            const recentUsers = usersRes.data.users?.slice(0, 5) || [];
            setRecentActivity(recentUsers.map(user => ({
                id: user._id,
                name: user.name,
                role: user.role,
                time: new Date(user.createdAt).toLocaleDateString()
            })));
            
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('Logged out successfully');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold">Admin Portal</h2>
                </div>
                <nav className="p-4 space-y-2">
                    <Link to="/admin/dashboard" className="block p-3 bg-purple-100 rounded">Dashboard</Link>
                    <Link to="/admin/users" className="block p-3 hover:bg-gray-100 rounded">Manage Users</Link>
                    <button 
                        onClick={handleLogout}
                        className="block w-full text-left p-3 hover:bg-gray-100 rounded mt-20"
                    >
                        Logout
                    </button>
                </nav>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 rounded shadow">
                        <p className="text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold">{stats.totalUsers}</p>
                        <p className="text-sm text-gray-500">Alumni: {stats.alumni} | Students: {stats.students}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <p className="text-gray-600">Active Events</p>
                        <p className="text-2xl font-bold">{stats.activeEvents}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <p className="text-gray-600">Pending Connections</p>
                        <p className="text-2xl font-bold">{stats.pendingConnections}</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link to="/admin/users" className="block p-4 bg-purple-100 rounded hover:bg-purple-200 transition">
                                Manage Users
                            </Link>
                            <Link to="/admin/events" className="block p-4 bg-green-100 rounded hover:bg-green-200 transition">
                                View All Events
                            </Link>
                        </div>
                    </div>
                    
                    <div>
                        <h2 className="text-xl font-bold mb-4">Recent Users</h2>
                        <div className="space-y-3">
                            {recentActivity.length === 0 ? (
                                <div className="p-3 border rounded text-center text-gray-500">
                                    No recent activity
                                </div>
                            ) : (
                                recentActivity.map(activity => (
                                    <div key={activity.id} className="p-3 border rounded">
                                        <p className="font-medium">{activity.name}</p>
                                        <p className="text-sm text-gray-500 capitalize">
                                            {activity.role} registered on {activity.time}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;