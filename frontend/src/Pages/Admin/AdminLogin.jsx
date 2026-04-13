import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const result = await login(email, password, 'admin');
        
        if (result.success) {
            toast.success('Admin login successful!');
            navigate("/admin/dashboard");
        } else {
            toast.error(result.message || "Invalid admin credentials");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        placeholder="Admin Email" 
                        className="w-full p-4 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="w-full p-4 border rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 text-white p-4 rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login as Admin"}
                    </button>
                </form>
                <p className="text-center mt-4">
                    <Link to="/" className="text-purple-600 hover:underline">Back to Home</Link>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;