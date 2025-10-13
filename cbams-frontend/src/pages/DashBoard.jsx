import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import components
import Header from '../componenets/Header';
import Sidebar from '../componenets/Layouts/Sidebar';
import OverviewTab from '../componenets/Dashboard/OverviewTab';
import AnalyticsTab from './AnalyticsTab';
import TasksTab from './TasksTab';
import MarketplaceTab from './MarketplaceTab';
import ChatbotTab from './ChatBot';
import WeatherForecast from '../componenets/Dashboard/WeatherForecast';
import ExpertConsultationPage from './Session';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [selectedTask, setSelectedTask] = useState(null);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab 
            currentLanguage={currentLanguage} 
            selectedTask={selectedTask} 
            setSelectedTask={setSelectedTask} 
          />
        );
      case 'analytics':
        return <AnalyticsTab currentLanguage={currentLanguage} />;
      case 'tasks':
        return <TasksTab currentLanguage={currentLanguage} />;
      case 'marketplace':
        return <MarketplaceTab currentLanguage={currentLanguage} />;
      case 'chatbot':
        return <ChatbotTab currentLanguage={currentLanguage} />;
      case 'session':
        return <ExpertConsultationPage currentLanguage={currentLanguage} />;  
      case 'weather':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Weather Dashboard</h2>
            <WeatherForecast currentLanguage={currentLanguage} />
          </div>
        );
      case 'community':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Community Hub</h2>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
              <p className="text-gray-600">Community features coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return (
          <OverviewTab 
            currentLanguage={currentLanguage} 
            selectedTask={selectedTask} 
            setSelectedTask={setSelectedTask} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
<Header 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
      />

      <div className="flex">
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          currentLanguage={currentLanguage}
        />

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
                <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;