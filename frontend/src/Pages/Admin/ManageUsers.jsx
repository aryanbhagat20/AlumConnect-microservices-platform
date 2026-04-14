import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            setUsers(response.data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            await api.put(`/users/${userId}/toggle-status`);
            toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error('Error toggling status:', error);
            toast.error(error.response?.data?.message || 'Failed to update user status');
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
            return;
        }
        
        try {
            await api.delete(`/users/${userId}`);
            toast.success('User deleted successfully');
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('Logged out successfully');
    };

    // Filter users based on search and role
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">Loading users...</div>
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
                    <Link to="/admin/dashboard" className="block p-3 hover:bg-gray-100 rounded">Dashboard</Link>
                    <Link to="/admin/users" className="block p-3 bg-purple-100 rounded">Manage Users</Link>
                    <Link to="/admin/events" className="block p-3 hover:bg-gray-100 rounded">Events</Link>
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
                <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
                
                {/* Filters */}
                <div className="bg-white p-4 rounded shadow mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
                            <select
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                            >
                                <option value="all">All Users</option>
                                <option value="alumni">Alumni</option>
                                <option value="student">Students</option>
                                <option value="admin">Admins</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                {/* Users Table */}
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Role</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Joined</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                                    <span className="text-purple-600 font-medium">
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="font-medium">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-gray-600">{user.email}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-sm ${
                                                user.role === 'alumni' ? 'bg-blue-100 text-blue-800' : 
                                                user.role === 'student' ? 'bg-green-100 text-green-800' : 
                                                'bg-purple-100 text-purple-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-sm ${
                                                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-3 space-x-2">
                                            <button 
                                                onClick={() => handleToggleStatus(user._id, user.isActive)}
                                                className={`px-3 py-1 rounded text-sm ${
                                                    user.isActive 
                                                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                }`}
                                            >
                                                {user.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                            {user.role !== 'admin' && (
                                                <button 
                                                    onClick={() => handleDeleteUser(user._id, user.name)}
                                                    className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Stats Summary */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded shadow text-center">
                        <p className="text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold">{users.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow text-center">
                        <p className="text-gray-600">Active Users</p>
                        <p className="text-2xl font-bold">{users.filter(u => u.isActive).length}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow text-center">
                        <p className="text-gray-600">Inactive Users</p>
                        <p className="text-2xl font-bold">{users.filter(u => !u.isActive).length}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;