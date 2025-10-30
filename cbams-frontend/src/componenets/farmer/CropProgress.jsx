import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Activity } from 'lucide-react';
import axios from '../../utils/axiosConfig';

const CropProgress = ({ farmId }) => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, [farmId]);

  const fetchProgress = async () => {
    try {
      const response = await axios.get(`/ml/crop-progress/${farmId}`);
      setProgress(response.data.progress);
      setStats({
        totalSubmissions: response.data.totalSubmissions,
        improvementScore: response.data.improvementScore,
        currentHealth: response.data.currentHealth
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading progress...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <Activity className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-3xl font-bold text-green-700">{stats?.currentHealth}%</p>
          <p className="text-sm text-gray-600">Current Health</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-3xl font-bold text-blue-700">{stats?.improvementScore}%</p>
          <p className="text-sm text-gray-600">Improvement</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <Calendar className="w-8 h-8 text-purple-600 mb-2" />
          <p className="text-3xl font-bold text-purple-700">{stats?.totalSubmissions}</p>
          <p className="text-sm text-gray-600">Total Uploads</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-6">Growth Timeline</h3>
        <div className="space-y-4">
          {progress.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">Day {item.day}</p>
                <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Health Score</span>
                  <span className="text-lg font-bold text-green-600">{item.healthScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${item.healthScore}%` }}
                  />
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                item.status === 'Excellent' ? 'bg-green-100 text-green-700' :
                item.status === 'Good' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CropProgress;
