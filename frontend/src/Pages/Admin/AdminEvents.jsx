import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await api.get('/events');
            setEvents(response.data.events || []);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        
        try {
            await api.delete(`/events/${eventId}`);
            toast.success('Event deleted successfully');
            fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            toast.error('Failed to delete event');
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
                <div className="text-center">Loading events...</div>
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
                    <Link to="/admin/users" className="block p-3 hover:bg-gray-100 rounded">Manage Users</Link>
                    <Link to="/admin/events" className="block p-3 bg-purple-100 rounded">Manage Events</Link>
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
                <h1 className="text-3xl font-bold mb-6">Manage Events</h1>
                
                {events.length === 0 ? (
                    <div className="bg-white p-8 rounded shadow text-center">
                        <p className="text-gray-500">No events found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {events.map(event => (
                            <div key={event._id} className="bg-white p-4 rounded shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">{event.title}</h3>
                                        <p className="text-gray-600 mt-1">{event.description}</p>
                                        <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-gray-500">
                                            <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                                            <p>📍 {event.location || 'Online'}</p>
                                            <p>👤 Created by: {event.createdBy?.name || 'Unknown'}</p>
                                        </div>
                                        <p className="text-sm text-gray-400 mt-2">
                                            Attendees: {event.attendees?.length || 0}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteEvent(event._id)}
                                        className="bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminEvents;