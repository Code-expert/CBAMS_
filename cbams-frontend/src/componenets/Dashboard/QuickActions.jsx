import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  Bot,
  Calendar, 
  Phone, 
  ShoppingCart,
  Target
} from 'lucide-react';
import { translations } from '../../constants/languages';

const QuickActions = ({ currentLanguage }) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];
  
  const quickActions = [
    { icon: BarChart3, label: t('soilAnalysis'), color: 'bg-emerald-500', href: '/soil-analysis' },
    { icon: Bot, label: t('aiAssistant'), color: 'bg-blue-500', href: '/ai-assistant' },
    { icon: Calendar, label: t('scheduleTask'), color: 'bg-purple-500', href: '/schedule' },
    { icon: Phone, label: t('session'), color: 'bg-orange-500', href: '/expert-call' },
    { icon: ShoppingCart, label: t('marketplace'), color: 'bg-pink-500', href: '/marketplace' },
    { icon: BarChart3, label: t('viewAnalytics'), color: 'bg-indigo-500', href: '/analytics' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="lg:col-span-2"
    >
      <div className="glass-card rounded-3xl p-8 h-full">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            {t('quickActions')}
          </h3>
          <div className="w-12 h-1 bg-emerald-100 rounded-full" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={index}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex flex-col items-center gap-4 p-5 rounded-2xl transition-all bg-white/50 border border-slate-200 hover:border-emerald-400 hover:bg-white hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{action.label}</span>
                
                {/* Subtle Hover Indicator */}
                <div className="absolute bottom-2 w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default QuickActions;