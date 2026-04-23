// components/AuthForm.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthForm = ({ isLogin, setIsLogin }) => {
  return (
    <div className="w-full max-w-md mx-auto" style={{ perspective: '1200px' }}>
      {/* Form Toggle outside the card for better 3D look */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex p-1 bg-white/40 backdrop-blur-md rounded-2xl mb-6 shadow-sm border border-white/40"
      >
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
            isLogin 
              ? 'bg-white text-green-600 shadow-md transform scale-[1.02]' 
              : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
            !isLogin 
              ? 'bg-white text-green-600 shadow-md transform scale-[1.02]' 
              : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          Sign Up
        </button>
      </motion.div>

      {/* 3D Flip Card Container */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ rotateY: -90, opacity: 0, z: -100 }}
              animate={{ rotateY: 0, opacity: 1, z: 0 }}
              exit={{ rotateY: 90, opacity: 0, z: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              <LoginForm />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ rotateY: 90, opacity: 0, z: -100 }}
              animate={{ rotateY: 0, opacity: 1, z: 0 }}
              exit={{ rotateY: -90, opacity: 0, z: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              <SignupForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthForm;