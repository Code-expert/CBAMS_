// components/AuthForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthForm = ({ isLogin, setIsLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (formData, isSignup = false) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log(`${isSignup ? 'Signup' : 'Login'} successful:`, formData);
      // Handle successful authentication
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
        {/* Form Toggle */}
        <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              isLogin 
                ? 'bg-white text-green-600 shadow-md' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              !isLogin 
                ? 'bg-white text-green-600 shadow-md' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <LoginForm 
              key="login"
              onSubmit={handleAuthSubmit}
              loading={loading}
            />
          ) : (
            <SignupForm 
              key="signup"
              onSubmit={handleAuthSubmit}
              loading={loading}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AuthForm;