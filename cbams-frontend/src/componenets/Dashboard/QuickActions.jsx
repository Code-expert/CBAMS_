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
    { icon: Phone, label: t('expertCall'), color: 'bg-orange-500', href: '/expert-call' },
    { icon: ShoppingCart, label: t('marketplace'), color: 'bg-pink-500', href: '/marketplace' },
    { icon: BarChart3, label: t('viewAnalytics'), color: 'bg-indigo-500', href: '/analytics' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-2"
    >
      <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-green-600" />
          {t('quickActions')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-3 p-4 rounded-lg hover:shadow-lg transition-all bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-green-200"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center shadow-sm`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default QuickActions;