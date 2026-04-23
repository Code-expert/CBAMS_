import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';

// Import components
import Header from '../componenets/Header';
import Sidebar from '../componenets/Layouts/Sidebar';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const location = useLocation();

  // Extract active tab from pathname for Sidebar highlighting
  const activeTab = location.pathname.split('/').pop() || 'overview';

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 selection:bg-emerald-100">
      {/* Premium Animated Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-100/40 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/30 blur-[100px] animate-pulse delay-700" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-green-100/20 blur-[80px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          currentLanguage={currentLanguage}
          setCurrentLanguage={setCurrentLanguage}
        />

        <div className="flex">
          <Sidebar 
            sidebarOpen={sidebarOpen} 
            activeTab={activeTab === 'dashboard' ? 'overview' : activeTab} 
            currentLanguage={currentLanguage}
          />

          {/* Main Content Area with Modern Shadow Box */}
          <main className={`flex-1 transition-all duration-300 ease-in-out px-4 py-8 md:px-8 max-w-[1600px] mx-auto`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 1.01 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Outlet context={{ currentLanguage, setCurrentLanguage }} />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Global CSS for Custom Scrollbar and Glass Effects */}
      <style dangerouslySetInnerHTML={{ __html: `
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default Dashboard;