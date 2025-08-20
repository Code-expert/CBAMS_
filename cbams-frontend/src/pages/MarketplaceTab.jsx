import React from 'react';
import { Sprout } from 'lucide-react';
import { translations } from '../constants/languages';

const MarketplaceTab = ({ currentLanguage }) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('marketplace')}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Prices */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-green-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Today's Market Prices</h3>
          <div className="space-y-4">
            {[
              { crop: 'Wheat', price: '₹2,100/quintal', change: '+2.5%', trend: 'up' },
              { crop: 'Rice', price: '₹3,200/quintal', change: '-1.2%', trend: 'down' },
              { crop: 'Tomato', price: '₹25/kg', change: '+5.8%', trend: 'up' },
              { crop: 'Onion', price: '₹18/kg', change: '+3.1%', trend: 'up' },
              { crop: 'Cotton', price: '₹5,800/quintal', change: '-0.5%', trend: 'down' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Sprout className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-800">{item.crop}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">{item.price}</div>
                  <div className={`text-sm ${item.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                    {item.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Sell */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Sell</h3>
          <div className="space-y-4">
            <button className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all">
              List Your Produce
            </button>
            <button className="w-full p-4 border-2 border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-all">
              Find Buyers
            </button>
            <button className="w-full p-4 border-2 border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-all">
              Price Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceTab;