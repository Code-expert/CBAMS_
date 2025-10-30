import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, MapPin, Loader, Award, TrendingUp } from 'lucide-react';
import axios from 'axios';

const CropRecommendation = ({ currentLanguage }) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    fetchLocationAndRecommendations();
  }, []);

  const fetchLocationAndRecommendations = async () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLocation({ lat, lon });
          
          try {
            const response = await axios.get(
              `/api/crop-recommendation/recommend?latitude=${lat}&longitude=${lon}`
            );
            setRecommendations(response.data.data.recommendations.slice(0, 3));
          } catch (error) {
            console.error('Error fetching recommendations:', error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Location error:', error);
          setLoading(false);
        }
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Leaf className="w-5 h-5 mr-2 text-green-600" />
            Crop Recommendations
          </h2>
        </div>
        <div className="flex items-center justify-center h-40">
          <Loader className="w-8 h-8 text-green-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Leaf className="w-5 h-5 mr-2 text-green-600" />
          Recommended Crops
        </h2>
        {location && (
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            Your Location
          </div>
        )}
      </div>

      <div className="space-y-3">
        {recommendations && recommendations.length > 0 ? (
          recommendations.map((crop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer border border-green-100"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">{crop.crop}</h3>
                  <p className="text-xs text-gray-600 mt-1">{crop.reason}</p>
                </div>
                <div className="bg-green-100 px-3 py-1 rounded-full flex items-center">
                  <Award className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm font-bold text-green-600">{crop.suitabilityScore}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-green-200">
                <div className="text-xs text-gray-600">
                  <span className="font-semibold">Yield:</span> {crop.expectedYield}
                </div>
                <div className={`text-xs font-semibold ${
                  crop.marketDemand === 'High' ? 'text-green-600' :
                  crop.marketDemand === 'Medium' ? 'text-amber-600' :
                  'text-gray-600'
                }`}>
                  {crop.marketDemand} Demand
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Leaf className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Enable location to see recommendations</p>
          </div>
        )}
      </div>

      {recommendations && recommendations.length > 0 && (
        <button 
          onClick={fetchLocationAndRecommendations}
          className="w-full mt-4 py-2 text-sm text-green-600 hover:text-green-700 font-semibold flex items-center justify-center space-x-2"
        >
          <TrendingUp className="w-4 h-4" />
          <span>View All Recommendations</span>
        </button>
      )}
    </div>
  );
};

export default CropRecommendation;
