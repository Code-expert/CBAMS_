// src/components/Dashboard/FarmMetrics.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Sprout, 
  TrendingUp,
  Loader
} from 'lucide-react';
import { translations } from '../../constants/languages';
import { farmMetricsService } from '../../services/farmMetricsService';

const FarmMetrics = ({ currentLanguage }) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];
  
  const [metrics, setMetrics] = useState({
    cropHealth: '92%',
    soilMoisture: '--',
    temperature: '--',
    growthRate: '15%'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealTimeData();
  }, []);

  const fetchRealTimeData = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            const realTimeData = await farmMetricsService.fetchRealTimeMetrics(lat, lon);
            
            setMetrics({
              cropHealth: '92%', // Keep static or calculate from crop images
              soilMoisture: `${realTimeData.soilMoisture}%`,
              temperature: `${Math.round(realTimeData.temperature)}°C`,
              growthRate: '15%' // Keep static or calculate
            });
            
            setLoading(false);
          } catch (error) {
            console.error('Error fetching metrics:', error);
            setLoading(false);
          }
        },
        (error) => {
          console.error('Location error:', error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  };

  const farmMetrics = [
    { 
      id: 'health',
      icon: Sprout, 
      label: t('cropHealth'), 
      value: metrics.cropHealth, 
      trend: '+5%',
      color: 'from-green-400 to-emerald-600',
      bgColor: 'bg-green-50'
    },
    { 
      id: 'moisture',
      icon: Droplets, 
      label: t('soilMoisture'), 
      value: metrics.soilMoisture, 
      trend: loading ? '' : '-2%',
      color: 'from-blue-400 to-cyan-600',
      bgColor: 'bg-blue-50'
    },
    { 
      id: 'temp',
      icon: Thermometer, 
      label: t('temperature'), 
      value: metrics.temperature, 
      trend: loading ? '' : '+3°C',
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-50'
    },
    { 
      id: 'growth',
      icon: TrendingUp, 
      label: t('growthRate'), 
      value: metrics.growthRate, 
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
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={`glass-card rounded-2xl p-6 transition-all cursor-pointer group relative overflow-hidden`}
          >
            {/* Background Accent Glow */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${metric.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
            
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className={`w-14 h-14 bg-gradient-to-r ${metric.color} rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 transform group-hover:rotate-6 transition-transform`}>
                {loading && (metric.id === 'moisture' || metric.id === 'temp') ? (
                  <Loader className="w-7 h-7 text-white animate-spin" />
                ) : (
                  <Icon className="w-7 h-7 text-white" />
                )}
              </div>
              {metric.trend && (
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-bold ${metric.trend.startsWith('+') ? 'bg-green-100/80 text-green-700' : 'bg-red-100/80 text-red-700'}`}>
                   {metric.trend}
                </div>
              )}
            </div>
            
            <div className="relative z-10">
              <p className="text-sm font-semibold text-slate-500 mb-1 tracking-wide uppercase">{metric.label}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{metric.value}</h3>
              
              {loading && (metric.id === 'moisture' || metric.id === 'temp') && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full bg-gradient-to-r ${metric.color}`}
                      animate={{ x: [-100, 200] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FarmMetrics;
