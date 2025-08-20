import React from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Sprout, 
  TrendingUp
} from 'lucide-react';
import { translations } from '../../constants/languages';

const FarmMetrics = ({ currentLanguage }) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];
  
  const farmMetrics = [
    { 
      id: 'health',
      icon: Sprout, 
      label: t('cropHealth'), 
      value: '92%', 
      trend: '+5%',
      color: 'from-green-400 to-emerald-600',
      bgColor: 'bg-green-50'
    },
    { 
      id: 'moisture',
      icon: Droplets, 
      label: t('soilMoisture'), 
      value: '68%', 
      trend: '-2%',
      color: 'from-blue-400 to-cyan-600',
      bgColor: 'bg-blue-50'
    },
    { 
      id: 'temp',
      icon: Thermometer, 
      label: t('temperature'), 
      value: '28°C', 
      trend: '+3°C',
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-50'
    },
    { 
      id: 'growth',
      icon: TrendingUp, 
      label: t('growthRate'), 
      value: '15%', 
      trend: '+8%',
      color: 'from-purple-400 to-pink-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {farmMetrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${metric.bgColor} rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer border border-white/50`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center shadow-sm`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-semibold ${metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                {metric.trend}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</h3>
            <p className="text-sm text-gray-600">{metric.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FarmMetrics;