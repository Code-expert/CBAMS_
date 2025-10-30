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
            transition={{ delay: index * 0.1 }}
            className={`${metric.bgColor} rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer border border-white/50`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center shadow-sm`}>
                {loading && (metric.id === 'moisture' || metric.id === 'temp') ? (
                  <Loader className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Icon className="w-6 h-6 text-white" />
                )}
              </div>
              {metric.trend && (
                <span className={`text-sm font-semibold ${metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                  {metric.trend}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</h3>
            <p className="text-sm text-gray-600">{metric.label}</p>
            {loading && (metric.id === 'moisture' || metric.id === 'temp') && (
              <p className="text-xs text-gray-400 mt-2">Fetching live data...</p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default FarmMetrics;
