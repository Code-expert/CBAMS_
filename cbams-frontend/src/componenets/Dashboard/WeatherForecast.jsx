import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Sun, 
  CloudRain
} from 'lucide-react';
import { translations } from '../../constants/languages';

const WeatherForecast = ({ currentLanguage }) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];
  
  const weatherData = [
    { day: 'Today', icon: Sun, temp: '28°C', humidity: '65%' },
    { day: 'Tomorrow', icon: CloudRain, temp: '25°C', humidity: '78%' },
    { day: 'Day 3', icon: Cloud, temp: '26°C', humidity: '70%' }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-green-100"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Cloud className="w-6 h-6 text-green-600" />
        {t('weatherForecast')}
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {weatherData.map((day, index) => {
          const Icon = day.icon;
          return (
            <div key={index} className="text-center p-3 rounded-lg bg-gradient-to-b from-blue-50 to-cyan-50 border border-blue-100">
              <div className="text-sm font-medium text-gray-600 mb-2">{day.day}</div>
              <Icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-lg font-bold text-gray-800">{day.temp}</div>
              <div className="text-xs text-gray-500">{day.humidity}</div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default WeatherForecast;