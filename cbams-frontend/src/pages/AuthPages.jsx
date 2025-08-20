// AuthPages.jsx - Main Authentication Component
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BrandingSection from '../componenets/Auth/BrandingSection';
import AuthForm from '../componenets/Auth/AuthForm';
import FloatingElements from '../componenets/Auth/FloatingElements';

const AuthPages = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingElements />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
          <defs>
            <pattern id="auth-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="currentColor" />
              <circle cx="5" cy="5" r="0.5" fill="currentColor" />
              <circle cx="15" cy="5" r="0.5" fill="currentColor" />
              <circle cx="5" cy="15" r="0.5" fill="currentColor" />
              <circle cx="15" cy="15" r="0.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-pattern)" />
        </svg>
      </div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
        <BrandingSection isLogin={isLogin} />
        <AuthForm isLogin={isLogin} setIsLogin={setIsLogin} />
      </div>
    </div>
  );
};

export default AuthPages;