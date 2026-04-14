import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import toast from 'react-hot-toast';

const AlumniSignup = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "alumni",
        graduationYear: "",
        company: "",
        jobTitle: "",
        branch: "",
        bio: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Prepare data for backend
        const userData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: "alumni",
            graduationYear: parseInt(formData.graduationYear),
            company: formData.company,
            jobTitle: formData.jobTitle,
            major: formData.branch,
            bio: formData.bio
        };
        
        const result = await register(userData);
        
        if (result.success) {
            toast.success('Account created successfully!');
            navigate("/alumni/dashboard");
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-100 via-gray-100 to-stone-200 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-200/15 rounded-full blur-3xl" />

            <div className="w-full max-w-2xl relative z-10">
                <Link to="/alumni/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Login
                </Link>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                    <div className="flex justify-center mb-5">
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-2xl shadow-sm">
                            <img src="/AlumConnectLogo.png" alt="AlumConnect" className="h-20 w-20 object-contain" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1 text-center">Create Alumni Account</h2>
                    <p className="text-sm text-slate-400 text-center mb-6">Join the VIT alumni community</p>
                    
                    <form onSubmit={handleSignup}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Create a password"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength="6"
                                    disabled={loading}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Graduation Year *
                                </label>
                                <select
                                    name="graduationYear"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.graduationYear}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Select Year</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                    <option value="2019">2019</option>
                                    <option value="2018">2018</option>
                                    <option value="2017">2017</option>
                                    <option value="2016">2016</option>
                                    <option value="2015">2015</option>
                                    <option value="2014">2014</option>
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Company
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    placeholder="Current company"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.company}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Job Title
                                </label>
                                <input
                                    type="text"
                                    name="jobTitle"
                                    placeholder="Your job title"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.jobTitle}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Branch / Department
                                </label>
                                <select
                                    name="branch"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    <option value="">Select Branch</option>
                                    <option value="CSE">Computer Science</option>
                                    <option value="IT">Information Technology</option>
                                    <option value="ECE">Electronics & Communication</option>
                                    <option value="EEE">Electrical & Electronics</option>
                                    <option value="MECH">Mechanical</option>
                                    <option value="CIVIL">Civil</option>
                                    <option value="MBA">MBA</option>
                                </select>
                            </div>

                            <div className="mb-6 md:col-span-2">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    placeholder="Tell us about yourself, your experience, and how you can help students..."
                                    rows="3"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <span>Create Alumni Account</span>
                            )}
                        </button>
                    </form>
                    
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                            </div>
                        </div>
                    </div>

                    <Link 
                        to="/alumni/login" 
                        className="block w-full text-center border-2 border-indigo-600 text-indigo-600 p-4 rounded-xl font-semibold hover:bg-indigo-50 mt-4 transition-colors"
                    >
                        Sign In to Existing Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AlumniSignup;