import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const loginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    const success = await login({ email, password });
    if (!success) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-8 bg-white">
        <div className="w-full max-w-md p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-indigo-700">NewMedihub</h1>
            <p className="mt-2 text-gray-600">Welcome back! Please sign in to your account</p>
          </div>
          
          {error && (
            <div className="p-4 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
              <div className="flex">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                {error}
              </div>
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Register here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      {/* Right side - Illustration */}
      <div className="hidden md:flex w-full md:w-1/2 bg-indigo-50 items-center justify-center">
        <div className="p-8 w-full max-w-lg">
          <svg className="w-full" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <circle cx="250" cy="250" r="200" fill="#f5f3ff" />
            <path d="M370 250a120 120 0 11-240 0 120 120 0 01240 0z" fill="url(#grad1)" />
            <path d="M320 250a70 70 0 11-140 0 70 70 0 01140 0z" fill="#f5f3ff" />
            <path fill="#4f46e5" d="M230 180h40v140h-40z" />
            <path fill="#4f46e5" d="M180 230h140v40H180z" />
            <circle cx="250" cy="250" r="20" fill="#f5f3ff" />
            <path d="M390 150c-10-30-30-50-60-60M110 150c10-30 30-50 60-60M390 350c-10 30-30 50-60 60M110 350c10 30 30 50 60 60" stroke="#4f46e5" strokeWidth="8" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default loginForm;