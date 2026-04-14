import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import toast from 'react-hot-toast';

const StudentRegister = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        major: "",
        enrollmentYear: "",
        bio: ""
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const userData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: "student",
            major: formData.major,
            enrollmentYear: parseInt(formData.enrollmentYear),
            bio: formData.bio
        };
        
        const result = await register(userData);
        
        if (result.success) {
            toast.success('Registration successful!');
            navigate("/student/dashboard");
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-100 via-gray-100 to-stone-200 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-200/15 rounded-full blur-3xl" />

            <div className="relative z-10 w-full max-w-md">
                <Link to="/student/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Login
                </Link>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <div className="flex justify-center mb-5">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-2xl shadow-sm">
                        <img src="/AlumConnectLogo.png" alt="AlumConnect" className="h-20 w-20 object-contain" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1 text-center">Student Registration</h2>
                <p className="text-sm text-slate-400 text-center mb-6">Create your student account</p>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="name"
                        placeholder="Full Name" 
                        className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.name}
                        onChange={handleChange}
                        required 
                    />
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Email" 
                        className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.email}
                        onChange={handleChange}
                        required 
                    />
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Password (min 6 characters)" 
                        className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.password}
                        onChange={handleChange}
                        required 
                        minLength="6"
                    />
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <select 
                            name="major"
                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.major}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Major</option>
                            <option value="CSE">Computer Science</option>
                            <option value="IT">Information Technology</option>
                            <option value="ECE">Electronics & Communication</option>
                            <option value="EEE">Electrical & Electronics</option>
                            <option value="MECH">Mechanical</option>
                            <option value="CIVIL">Civil</option>
                        </select>
                        <select 
                            name="enrollmentYear"
                            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.enrollmentYear}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>
                    
                    <textarea
                        name="bio"
                        placeholder="Tell us about yourself, your interests, and what you're looking for in a mentor..."
                        rows="3"
                        className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.bio}
                        onChange={handleChange}
                    />
                    
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link to="/student/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Login</Link>
                    </p>
                </div>
            </div>
            </div>
        </div>
    );
};

export default StudentRegister;