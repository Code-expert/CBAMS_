import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Settings, 
  Cloud, 
  ShoppingCart,
  Bot,
  Users,
  Tv
} from 'lucide-react';
import { translations } from '../../constants/languages';

const Sidebar = ({ sidebarOpen, activeTab, setActiveTab, currentLanguage }) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];
  
  const sidebarItems = [
    { id: 'overview', icon: BarChart3, label: t('overview') },
    { id: 'analytics', icon: TrendingUp, label: t('analytics') },
    { id: 'tasks', icon: Calendar, label: t('tasks') },
    { id: 'marketplace', icon: ShoppingCart, label: t('marketplace') },
    { id: 'chatbot', icon: Bot, label: currentLanguage === 'hi' ? 'AI सहायक' : currentLanguage === 'pa' ? 'AI ਸਹਾਇਕ' : 'AI Assistant' },
    { id: 'session', icon: Tv, label: t('session') },
    { id: 'weather', icon: Cloud, label: t('weather') },
    { id: 'community', icon: Users, label: t('community') },
    { id: 'settings', icon: Settings, label: t('settings') }
  ];

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          className="w-64 bg-white shadow-lg min-h-screen border-r border-green-100 relative z-40 lg:relative lg:z-auto"
        >
          <div className="p-6">
            <div className="space-y-2">
              {sidebarItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === item.id 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                        : 'hover:bg-green-50 text-gray-600 hover:text-green-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;