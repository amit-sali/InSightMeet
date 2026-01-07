import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        alert('Login successful!');
        navigate('/dashboard');
      } else {
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      alert('Login error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold tracking-tighter text-black mb-2">
            Welcome back<span className="text-[#1DB954]">.</span>
          </h2>
          <p className="text-gray-500">Log in to InSightMeet to manage your lectures.</p>
        </div>

        {/* Social Login Button */}
        <button type="button" className="w-full flex items-center justify-center gap-3 border-2 border-gray-100 hover:border-black py-3 px-4 rounded-full font-bold transition-all mb-6" disabled>
          <span className="text-gray-400">OAuth Disabled</span>
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-gray-100 w-full"></div>
          <span className="bg-white px-4 text-xs text-gray-400 uppercase tracking-widest absolute">or</span>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full bg-gray-50 border border-transparent focus:border-[#1DB954] focus:bg-white outline-none py-3 px-12 rounded-2xl transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-transparent focus:border-[#1DB954] focus:bg-white outline-none py-3 px-12 rounded-2xl transition-all"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <a href="#" className="text-sm font-bold text-[#1DB954] hover:underline">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-4 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-95 uppercase tracking-wider shadow-lg shadow-[#1DB954]/20 disabled:opacity-50"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500">
          Don't have an account?
           <Link to="/signup" className="font-bold text-black hover:text-[#1DB954] underline decoration-2 underline-offset-4">
           Sign up for free
           </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;