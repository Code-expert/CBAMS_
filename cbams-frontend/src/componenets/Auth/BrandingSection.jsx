// components/BrandingSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, CheckCircle } from 'lucide-react';

const BrandingSection = ({ isLogin }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="hidden lg:block space-y-8"
    >
      {/* Logo */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-3 cursor-pointer"
      >
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
          <Leaf className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Agri Assist
        </h1>
      </motion.div>

      {/* Welcome Message */}
      <div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          {isLogin ? 'Welcome Back!' : 'Join Our Community'}
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          {isLogin 
            ? 'Sign in to access your personalized farm dashboard and continue your smart farming journey.'
            : 'Start your smart farming journey with AI-powered insights, weather forecasting, and expert guidance.'
          }
        </p>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 text-gray-700"
        >
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <span>AI-powered crop monitoring and disease detection</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 text-gray-700"
        >
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <span>Real-time weather forecasting and market prices</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 text-gray-700"
        >
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <span>24/7 expert consultation and community support</span>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
        {/* <div className="text-center">
          <div className="text-2xl font-bold text-green-600">50K+</div>
          <div className="text-sm text-gray-600">Active Farmers</div>
        </div> */}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">95%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">24/7</div>
          <div className="text-sm text-gray-600">Support</div>
        </div>
      </div>
    </motion.div>
  );
};

export default BrandingSection;