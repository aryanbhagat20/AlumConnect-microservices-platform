import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Student Registration</h2>
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
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                <p className="text-center mt-4">
                    <Link to="/student/login" className="text-blue-600 hover:underline">Already have account? Login</Link>
                </p>
            </div>
        </div>
    );
};

export default StudentRegister;