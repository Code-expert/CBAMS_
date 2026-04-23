import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Settings, 
  Cloud, 
  ShoppingCart,
  Bot,
  Users,
  Tv,
  Droplet
} from 'lucide-react';
import { translations } from '../../constants/languages';

const Sidebar = ({ sidebarOpen, activeTab, currentLanguage }) => {
  const navigate = useNavigate();
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];
  
  const sidebarItems = [
    { id: 'overview', icon: BarChart3, label: t('overview'), path: '/dashboard' },
    { id: 'analytics', icon: TrendingUp, label: t('analytics'), path: '/dashboard/analytics' },
    { id: 'tasks', icon: Calendar, label: t('tasks'), path: '/dashboard/tasks' },
    { id: 'marketplace', icon: ShoppingCart, label: t('marketplace'), path: '/dashboard/marketplace' },
    { id: 'chatbot', icon: Bot, label: t('aiAssistant'), path: '/dashboard/chatbot' },
    { id: 'session', icon: Tv, label: t('session'), path: '/dashboard/session' },
    { id: 'weather', icon: Cloud, label: t('weather'), path: '/dashboard/weather' },
    { id: 'community', icon: Users, label: t('community'), path: '/dashboard/community' },
    { id: 'settings', icon: Settings, label: t('settings'), path: '/dashboard/settings' }
  ];

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          className="w-64 bg-white shadow-xl min-h-screen border-r border-slate-100 relative z-40 lg:relative lg:z-auto"
        >
          <div className="p-6 sticky top-20">
            <div className="space-y-2">
              {sidebarItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-slate-900 text-white shadow-lg'
                        : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-bold text-xs uppercase tracking-widest overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.label}
                    </span>
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