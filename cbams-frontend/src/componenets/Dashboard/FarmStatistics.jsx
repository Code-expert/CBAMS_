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
    { icon: MapPin, label: t('farmSize'), value: '15 Acres', change: t('noChange') },
    { icon: Star, label: t('efficiency'), value: '94%', change: '+8%' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card rounded-3xl p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-blue-100 rounded-xl">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          {t('farmStats')}
        </h3>
        <button className="text-blue-600 font-bold text-xs hover:underline">Details</button>
      </div>

      <div className="space-y-5">
        {farmStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={index} 
              whileHover={{ x: 5 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-sm font-black text-slate-800">{stat.value}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-lg text-[10px] font-black ${stat.change.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                {stat.change}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FarmStatistics;