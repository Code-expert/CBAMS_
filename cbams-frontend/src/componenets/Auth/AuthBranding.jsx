import React from "react";
import { motion } from "framer-motion";
import { Leaf, CheckCircle } from "lucide-react";

const AuthBranding = ({ isLogin }) => {
  return (
    <div>
      {/* Logo */}
      <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3 cursor-pointer">
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
          <Leaf className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Agri Assist
        </h1>
      </motion.div>

      {/* Message */}
      <div className="mt-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          {isLogin ? "Welcome Back!" : "Join Our Community"}
        </h2>
        <p className="text-lg text-gray-600">
          {isLogin
            ? "Sign in to access your personalized farm dashboard and continue your smart farming journey."
            : "Start your smart farming journey with AI-powered insights, weather forecasting, and expert guidance."}
        </p>
      </div>

      {/* Features */}
      <div className="space-y-4 mt-8">
        {[
          "AI-powered crop monitoring and disease detection",
          "Real-time weather forecasting and market prices",
          "24/7 expert consultation and community support",
        ].map((text, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="flex items-center gap-3 text-gray-700"
          >
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span>{text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AuthBranding;
