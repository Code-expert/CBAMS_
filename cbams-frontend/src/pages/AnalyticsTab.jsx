import React from 'react';
import { 
  BarChart3, 
  TrendingUp,
  DollarSign,
  Star,
  Target
} from 'lucide-react';
import { translations } from '../constants/languages';

const AnalyticsTab = ({ currentLanguage }) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('analytics')}</h2>
      
      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Crop Yield Trends</h3>
          <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">Interactive charts will be displayed here</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Resource Usage</h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Water & fertilizer usage analytics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: '₹4,50,000', change: '+15%', icon: DollarSign },
            { label: 'Cost Savings', value: '₹75,000', change: '+22%', icon: TrendingUp },
            { label: 'Crop Quality', value: '96%', change: '+8%', icon: Star },
            { label: 'Efficiency', value: '94%', change: '+12%', icon: Target }
          ].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-semibold text-green-600">{metric.change}</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;