import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bell,
  AlertTriangle,
  CheckCircle,
  Phone,
  CloudRain
} from 'lucide-react';
import { translations } from '../../constants/languages';

const RecentActivity = ({ currentLanguage }) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];
  
  const recentActivity = [
    { time: '2 hours ago', activity: 'Soil moisture sensor alert received', type: 'alert', icon: AlertTriangle },
    { time: '4 hours ago', activity: 'Weekly crop health report generated', type: 'success', icon: CheckCircle },
    { time: '6 hours ago', activity: 'Expert consultation scheduled', type: 'info', icon: Phone },
    { time: '1 day ago', activity: 'Fertilizer delivery completed', type: 'success', icon: CheckCircle },
    { time: '2 days ago', activity: 'Weather alert: Rain expected', type: 'warning', icon: CloudRain }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-green-100"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Bell className="w-6 h-6 text-green-600" />
        {t('recentActivity')}
      </h3>
      <div className="space-y-3">
        {recentActivity.slice(0, 4).map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                activity.type === 'success' ? 'bg-green-100' :
                activity.type === 'warning' ? 'bg-yellow-100' :
                activity.type === 'alert' ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                <Icon className={`w-4 h-4 ${
                  activity.type === 'success' ? 'text-green-600' :
                  activity.type === 'warning' ? 'text-yellow-600' :
                  activity.type === 'alert' ? 'text-red-600' : 'text-blue-600'
                }`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{activity.activity}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RecentActivity;