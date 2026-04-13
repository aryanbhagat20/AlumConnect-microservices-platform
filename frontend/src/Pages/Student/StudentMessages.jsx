import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const StudentMessages = () => {
    const { userId } = useParams();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [selectedAlumni, setSelectedAlumni] = useState(null);
    const [message, setMessage] = useState("");
    const [connections, setConnections] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const selectedAlumniRef = useRef(null);

    const { sendMessage, onMessageReceived, onlineUsers } = useSocket();

    useEffect(() => {
        fetchConnections();

        const unsubscribe = onMessageReceived((newMessage) => {
            if (selectedAlumniRef.current &&
                newMessage.sender._id === selectedAlumniRef.current._id) {
                setMessages(prev => [...prev, newMessage]);
            }
            fetchConnections();
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userId && connections.length > 0) {
            const alumni = connections.find(c => c._id === userId);
            if (alumni) {
                setSelectedAlumni(alumni);
                selectedAlumniRef.current = alumni;
                fetchMessages(userId);
            }
        }
    }, [userId, connections]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchConnections = async () => {
        try {
            const response = await api.get('/connections');
            const connectedUsers = response.data.connections || [];
            setConnections(connectedUsers);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching connections:', error);
            toast.error('Failed to load connections');
            setLoading(false);
        }
    };

    const fetchMessages = async (alumniId) => {
        try {
            const response = await api.get(`/messages/${alumniId}`);
            setMessages(response.data.messages || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to load messages');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedAlumni) return;

        setSending(true);
        try {
            sendMessage(selectedAlumni._id, message);
            setMessages(prev => [...prev, {
                _id: Date.now(),
                content: message,
                sender: { _id: user._id },
                createdAt: new Date().toISOString()
            }]);
            setMessage("");
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleSelectAlumni = (alumni) => {
        setSelectedAlumni(alumni);
        selectedAlumniRef.current = alumni;
        fetchMessages(alumni._id);
        navigate(`/student/messages/${alumni._id}`, { replace: true });
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('Logged out successfully');
    };

    const getInitial = (name) => name?.charAt(0).toUpperCase() || '?';

    const formatTime = (date) =>
        new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <span className="text-sm font-medium">Loading messages…</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-100">

            {/* ── Sidebar ── */}
            <aside className="w-56 bg-slate-900 flex flex-col flex-shrink-0">
                {/* Brand */}
                <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        S
                    </div>
                    <div className="min-w-0">
                        <p className="text-white font-semibold text-sm leading-tight">Student Portal</p>
                        <p className="text-slate-500 text-xs truncate">{user?.name}</p>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
                    {[
                        { to: '/student/dashboard', label: 'Dashboard' },
                        { to: '/student/profile',   label: 'Profile'   },
                        { to: '/student/alumni',    label: 'Alumni'    },
                        { to: '/student/events',    label: 'Events'    },
                    ].map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className="block px-3 py-2 rounded-lg text-slate-400 text-sm font-medium hover:bg-white/5 hover:text-white transition-colors"
                        >
                            {label}
                        </Link>
                    ))}
                    <Link
                        to="/student/messages"
                        className="block px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-semibold"
                    >
                        Messages
                    </Link>
                </nav>

                <button
                    onClick={handleLogout}
                    className="mx-3 mb-4 px-3 py-2 rounded-lg text-left text-red-400 text-sm font-medium hover:bg-white/5 transition-colors"
                >
                    Logout
                </button>
            </aside>

            {/* ── Contacts Panel ── */}
            <div className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
                <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
                    <p className="font-bold text-slate-800 text-base">Messages</p>
                    <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {connections.length}
                    </span>
                </div>

                <div className="overflow-y-auto flex-1">
                    {connections.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">
                            No connections yet
                        </div>
                    ) : (
                        connections.map(alumni => {
                            const isSelected = selectedAlumni?._id === alumni._id;
                            const isOnline   = onlineUsers.has(alumni._id);
                            return (
                                <div
                                    key={alumni._id}
                                    onClick={() => handleSelectAlumni(alumni)}
                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-slate-50 transition-all
                                        ${isSelected
                                            ? 'bg-blue-50 border-l-4 border-l-blue-500 pl-3'
                                            : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                                        }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        {alumni.profilePicture ? (
                                            <img src={alumni.profilePicture} alt={alumni.name} className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                                {getInitial(alumni.name)}
                                            </div>
                                        )}
                                        {isOnline && (
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{alumni.name}</p>
                                        <p className="text-xs text-slate-400 truncate">
                                            {alumni.company || alumni.role}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ── Chat Area ── */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
                {selectedAlumni ? (
                    <>
                        {/* Chat Header */}
                        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-white flex-shrink-0">
                            <div className="relative flex-shrink-0">
                                {selectedAlumni.profilePicture ? (
                                    <img src={selectedAlumni.profilePicture} alt={selectedAlumni.name} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                        {getInitial(selectedAlumni.name)}
                                    </div>
                                )}
                                {onlineUsers.has(selectedAlumni._id) && (
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">{selectedAlumni.name}</p>
                                <p className={`text-xs font-medium ${onlineUsers.has(selectedAlumni._id) ? 'text-green-500' : 'text-slate-400'}`}>
                                    {onlineUsers.has(selectedAlumni._id) ? '● Online' : '○ Offline'}
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50 min-h-0">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm">No messages yet. Say hello!</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isMine = msg.sender?._id === user?._id;
                                    return (
                                        <div
                                            key={msg._id || index}
                                            className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
                                        >
                                            {!isMine && (
                                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0 mb-1">
                                                    {getInitial(selectedAlumni.name)}
                                                </div>
                                            )}
                                            <div className={`flex flex-col max-w-sm ${isMine ? 'items-end' : 'items-start'}`}>
                                                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                                                    ${isMine
                                                        ? 'bg-blue-600 text-white rounded-br-sm'
                                                        : 'bg-white text-slate-800 rounded-bl-sm shadow-sm border border-slate-100'
                                                    }`}
                                                >
                                                    {msg.content}
                                                </div>
                                                <p className="text-xs mt-1 px-1 text-slate-400">
                                                    {formatTime(msg.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Bar */}
                        <form onSubmit={handleSendMessage} className="px-4 py-3 border-t border-slate-100 bg-white flex-shrink-0">
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
                                <input
                                    type="text"
                                    placeholder="Type a message…"
                                    className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={sending || !message.trim()}
                                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                                >
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13" />
                                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-slate-50 text-slate-400">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-slate-600 text-sm">No conversation selected</p>
                            <p className="text-slate-400 text-xs mt-1">Choose from {connections.length} connected alumni</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentMessages;