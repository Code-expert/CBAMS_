import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  TrendingUp, 
  Sprout, 
  MapPin,
  Star
} from 'lucide-react';
import { translations } from '../../constants/languages';

const FarmStatistics = ({ currentLanguage }) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];
  
  const farmStats = [
    { icon: TrendingUp, label: t('totalYield'), value: '2.5T', change: '+12%' },
    { icon: Sprout, label: t('activeCrops'), value: '8', change: '+2' },
    { icon: MapPin, label: t('farmSize'), value: '15 Acres', change: 'Same' },
    { icon: Star, label: t('efficiency'), value: '94%', change: '+8%' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-green-100"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-green-600" />
        {t('farmStats')}
      </h3>
      <div className="space-y-4">
        {farmStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors">
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">{stat.label}</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">{stat.value}</div>
                <div className="text-xs text-green-600">{stat.change}</div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FarmStatistics;