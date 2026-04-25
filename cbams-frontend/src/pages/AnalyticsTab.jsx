import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Camera,
  Eye,
  Leaf,
  Activity,
  Bug,
  Droplet,
  Calendar,
  Loader,
  Plus,
  Upload,
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { cropService } from '../services/cropService';
import { useTranslation } from 'react-i18next';

const AnalyticsPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedCropDetails, setSelectedCropDetails] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  useEffect(() => {
    if (selectedCrop) {
      fetchCropDetails(selectedCrop);
    }
  }, [selectedCrop]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const analyticsData = await cropService.getCropsAnalytics();
      setData(analyticsData);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCropDetails = async (cropId) => {
    try {
      const details = await cropService.getCropDetails(cropId);
      setSelectedCropDetails(details);
    } catch (err) {
      console.error('Error fetching crop details:', err);
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    if (selectedCrop) {
      fetchCropDetails(selectedCrop);
    }
    fetchAnalyticsData();
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchAnalyticsData();
  };

  const colorClasses = {
    emerald: 'from-emerald-500 to-green-500',
    blue: 'from-blue-500 to-cyan-500',
    amber: 'from-amber-500 to-orange-500',
    violet: 'from-violet-500 to-purple-500',
    green: 'from-green-500 to-emerald-500',
    red: 'from-red-500 to-rose-500'
  };

  const ProgressBar = ({ percentage, color = 'green' }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className={`h-2.5 rounded-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-300`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      ></div>
    </div>
  );

  const getHealthColor = (score) => {
    if (score >= 90) return 'emerald';
    if (score >= 75) return 'amber';
    return 'red';
  };

  const pollForAnalysis = async (imageId, maxAttempts = 15) => {
  console.log('🔄 Starting to poll for analysis completion...');
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const status = await cropService.getAnalysisStatus(imageId);
      console.log(`Poll attempt ${i + 1}:`, status.status);
      
      if (status.status === 'COMPLETED') {
        console.log('✅ Analysis completed!');
        return true;
      }
      
      if (status.status === 'FAILED') {
        console.log('❌ Analysis failed');
        return false;
      }
      
      // Wait 2 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error('Error polling status:', error);
    }
  }
  
  console.log('⏱️ Polling timeout - analysis may still be in progress');
  return false; // Timeout
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">{t("Loading analytics...") || "Loading analytics..."}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Analytics</h3>
            <p className="text-red-700 mb-6">{error}</p>
            <button 
              onClick={fetchAnalyticsData}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold flex items-center mx-auto space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Crop Detail View
  if (selectedCrop && selectedCropDetails) {
    const crop = selectedCropDetails;
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  setSelectedCrop(null);
                  setSelectedCropDetails(null);
                }}
                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors font-medium shadow-sm"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{crop.name}</h1>
                <p className="text-gray-600">{crop.type} • Planted {new Date(crop.plantedDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`px-5 py-2 rounded-full font-bold text-lg shadow-md ${
                crop.visualHealthScore >= 90 ? 'bg-green-100 text-green-700' :
                crop.visualHealthScore >= 75 ? 'bg-amber-100 text-amber-700' :
                crop.visualHealthScore === 0 ? 'bg-gray-100 text-gray-700' :
                'bg-red-100 text-red-700'
              }`}>
                Health: {crop.visualHealthScore}%
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center space-x-2 shadow-md"
              >
                <Camera className="w-5 h-5" />
                <span>Upload Photo</span>
              </button>
            </div>
          </div>

          {/* Disease Alert Banner */}
          {crop.diseaseDetected && (
            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg shadow-md">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-7 h-7 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-red-800 text-lg mb-1">⚠️ Disease Detected: {crop.diseaseName}</h4>
                  <p className="text-red-700"> AI detected disease symptoms. Confidence: {crop.diseaseConfidence}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <Camera className="w-6 h-6 text-blue-600 mb-3" />
              <div className="text-3xl font-bold text-gray-800 mb-1">{crop.totalImages}</div>
              <div className="text-sm text-gray-600">Photos Uploaded</div>
              {crop.lastImageDate && (
                <div className="text-xs text-gray-500 mt-1">
                  Last: {new Date(crop.lastImageDate).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <Activity className="w-6 h-6 text-emerald-600 mb-3" />
              <div className="text-2xl font-bold text-gray-800 mb-1">{crop.currentStage}</div>
              <div className="text-sm text-gray-600">Growth Stage</div>
              <div className="text-xs text-gray-500 mt-1">{crop.daysTracked} days tracked</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <Bug className="w-6 h-6 text-orange-600 mb-3" />
              <div className="text-xl font-bold text-gray-800 mb-1">
                {crop.diseaseDetected ? 'Detected' : 'None'}
              </div>
              <div className="text-sm text-gray-600">Disease Status</div>
              <div className="text-xs text-gray-500 mt-1">Risk: {crop.geminiInsights.diseaseRisk}</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <Leaf className="w-6 h-6 text-green-600 mb-3" />
              <div className="text-xl font-bold text-gray-800 mb-1">
                {crop.leafColorHealth.greenness}%
              </div>
              <div className="text-sm text-gray-600">Leaf Greenness</div>
              <div className="text-xs text-gray-500 mt-1">From color analysis</div>
            </div>
          </div>

          {/* Leaf Color Analysis */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
              <Droplet className="w-6 h-6 mr-2 text-green-600" />
              Leaf Color Analysis
            </h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-700">Healthy Green Color</span>
                  <span className="text-green-600 font-bold">{crop.leafColorHealth.greenness}%</span>
                </div>
                <ProgressBar percentage={crop.leafColorHealth.greenness} color="green" />
                <p className="text-xs text-gray-500 mt-1">Indicates photosynthetic capacity</p>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-700">Yellowing (Chlorosis)</span>
                  <span className="text-amber-600 font-bold">{crop.leafColorHealth.yellowingLevel}%</span>
                </div>
                <ProgressBar percentage={crop.leafColorHealth.yellowingLevel} color="amber" />
                <p className="text-xs text-gray-500 mt-1">May indicate stress or nutrient issues</p>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-700">Browning/Necrosis</span>
                  <span className="text-red-600 font-bold">{crop.leafColorHealth.browningLevel}%</span>
                </div>
                <ProgressBar percentage={crop.leafColorHealth.browningLevel} color="red" />
                <p className="text-xs text-gray-500 mt-1">Dead or dying tissue detected</p>
              </div>
            </div>
          </div>

          {/* Growth Timeline */}
          {crop.growthTimeline && crop.growthTimeline.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                Visual Health Progress Timeline
              </h3>
              <div className="space-y-4">
                {crop.growthTimeline.slice(-10).reverse().map((entry, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4 py-2 hover:border-blue-400 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-gray-800">{entry.week}</span>
                        <span className="text-sm text-gray-500 ml-3">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        entry.visualHealth >= 90 ? 'bg-green-100 text-green-700' :
                        entry.visualHealth >= 75 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {entry.visualHealth}%
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-2">
                      <div>
                        <span className="text-gray-600">Condition: </span>
                        <span className="font-semibold">{entry.leafCondition}</span>
                      </div>
                      {entry.heightEstimate && (
                        <div>
                          <span className="text-gray-600">Growth: </span>
                          <span className="font-semibold">{entry.heightEstimate}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">Disease: </span>
                        <span className={`font-semibold ${entry.diseaseStatus === 'None' ? 'text-green-600' : 'text-red-600'}`}>
                          {entry.diseaseStatus}
                        </span>
                      </div>
                    </div>
                    <ProgressBar percentage={entry.visualHealth} color={getHealthColor(entry.visualHealth)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/*  AI Visual Observations */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-blue-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-2 text-purple-600" />
               AI Visual Observations
            </h3>
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-600 mb-2">Overall Assessment</div>
              <div className="text-lg font-bold text-gray-800">
                {crop.geminiInsights.overallAssessment}
              </div>
            </div>
            {crop.geminiInsights.visualObservations && crop.geminiInsights.visualObservations.length > 0 && (
              <ul className="space-y-2">
                {crop.geminiInsights.visualObservations.map((observation, index) => (
                  <li key={index} className="flex items-start space-x-3 bg-white p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{observation}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* AI Recommendations */}
          {crop.geminiInsights.recommendations && crop.geminiInsights.recommendations.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <AlertCircle className="w-6 h-6 mr-2 text-green-600" />
                AI Recommendations
              </h3>
              <ul className="space-y-3">
                {crop.geminiInsights.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-3 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 font-medium">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <UploadImageModal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            cropId={selectedCrop}
            cropName={crop.name}
            onSuccess={handleUploadSuccess}
          />
        )}
      </div>
    );
  }

  // Overview Dashboard
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t("Crop Analytics") || "Crop Analytics"}</h1>
            <p className="text-gray-500 mt-2 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-green-600" />
              Insightful data for your agricultural productivity
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">{new Date().toLocaleDateString()}</span>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold flex items-center space-x-2 transition-all shadow-lg shadow-green-200"
            >
              <Plus className="w-5 h-5" />
              <span>{t("Add New Crop") || "Add New Crop"}</span>
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-white border border-blue-100 p-6 rounded-2xl shadow-sm flex items-start space-x-4">
          <div className="bg-blue-50 p-3 rounded-xl">
            <Camera className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1 text-lg">AI-Powered Insights</h4>
            <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
              Our advanced machine learning models analyze your crop photos in real-time to provide health scores, 
              detect diseases early, and offer actionable recommendations for better yield.
            </p>
          </div>
        </div>

        {data && data.crops.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-lg">
            <Leaf className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{t("No Crops Yet") || "No Crops Yet"}</h3>
            <p className="text-gray-600 mb-6">{t("Start by adding your first crop to track its health and progress with AI-powered analysis.") || "Start by adding your first crop to track its health and progress with AI-powered analysis."}</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Crop</span>
            </button>
          </div>
        ) : (
          <>
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <Leaf className="w-8 h-8 text-emerald-600 mb-4" />
                <div className="text-3xl font-bold text-gray-800 mb-1">{data.overallStats.totalCrops}</div>
                <div className="text-sm text-gray-600">Active Crops</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <Camera className="w-8 h-8 text-blue-600 mb-4" />
                <div className="text-3xl font-bold text-gray-800 mb-1">{data.overallStats.totalImages}</div>
                <div className="text-sm text-gray-600">Images Analyzed</div>
                <div className="text-xs text-gray-500 mt-1">{data.overallStats.imagesThisWeek} this week</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <Activity className="w-8 h-8 text-violet-600 mb-4" />
                <div className="text-3xl font-bold text-gray-800 mb-1">{data.overallStats.avgVisualHealth}%</div>
                <div className="text-sm text-gray-600">Avg Visual Health</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                {data.overallStats.cropsWithDiseases > 0 ? 
                  <AlertTriangle className="w-8 h-8 text-red-600 mb-4" /> :
                  <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                }
                <div className="text-3xl font-bold text-gray-800 mb-1">{data.overallStats.cropsWithDiseases}</div>
                <div className="text-sm text-gray-600">Diseases Detected</div>
              </div>
            </div>

            {/* Crop Cards */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Your Cultivations</h3>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {data.crops.length} Total
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {data.crops.map((crop) => (
                  <div 
                    key={crop.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-green-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedCrop(crop.id)}
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors mb-1">{crop.name}</h4>
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{crop.type}</span>
                        </div>
                        <div className={`flex flex-col items-end`}>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            crop.visualHealthScore >= 90 ? 'bg-green-50 text-green-700' :
                            crop.visualHealthScore >= 75 ? 'bg-amber-50 text-amber-700' :
                            crop.visualHealthScore === 0 ? 'bg-gray-50 text-gray-500' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {crop.visualHealthScore}% Health
                          </span>
                        </div>
                      </div>

                      {/* Disease Alert */}
                      {crop.diseaseDetected && (
                        <div className="mb-6 bg-red-50/50 border border-red-100 p-4 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="bg-red-100 p-2 rounded-lg">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                              <span className="text-sm text-red-900 font-bold block">{crop.diseaseName}</span>
                              <p className="text-xs text-red-600/80 mt-0.5 font-medium italic">Immediate attention required</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50/50 rounded-xl p-4 transition-colors group-hover:bg-green-50/30">
                          <div className="text-xs font-medium text-gray-400 mb-1 flex items-center">
                            <Camera className="w-3 h-3 mr-1" /> Photos
                          </div>
                          <div className="text-lg font-bold text-gray-900">{crop.totalImages}</div>
                        </div>
                        <div className="bg-gray-50/50 rounded-xl p-4 transition-colors group-hover:bg-green-50/30">
                          <div className="text-xs font-medium text-gray-400 mb-1 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" /> Age
                          </div>
                          <div className="text-lg font-bold text-gray-900">{crop.daysTracked}d</div>
                        </div>
                      </div>

                      {/* Health Bar */}
                      <div className="mb-8">
                        <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                          <span>Health Status</span>
                          <span className="text-gray-400">{crop.currentStage}</span>
                        </div>
                        <ProgressBar 
                          percentage={crop.visualHealthScore} 
                          color={getHealthColor(crop.visualHealthScore)} 
                        />
                      </div>

                      {/* View Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCrop(crop.id);
                        }}
                        className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-green-600 transition-all flex items-center justify-center space-x-2 group-hover:shadow-lg group-hover:shadow-green-100"
                      >
                        <Eye className="w-5 h-5" />
                        <span>Analysis Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Info Section */}
            <div className="relative overflow-hidden bg-gray-900 rounded-[2rem] p-10 text-white shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -ml-32 -mb-32"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full border border-green-500/20">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold uppercase tracking-widest">Real-time Intelligence</span>
                  </div>
                  <h3 className="text-4xl font-extrabold leading-tight">Advanced Crop Monitoring powered by Gemini AI</h3>
                  <p className="text-gray-400 text-lg max-w-xl font-medium">
                    Our platform utilizes state-of-the-art multimodal AI to provide you with insights that were previously only possible through expert manual inspection.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
                  <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                    <div className="text-5xl font-black mb-3 text-green-400 leading-none">{data.overallStats.totalImages}</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Images Processed</div>
                  </div>
                  <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                    <div className="text-5xl font-black mb-3 text-blue-400 leading-none">
                      {data.overallStats.cropsWithDiseases === 0 ? '100' : 
                       Math.round(((data.overallStats.totalCrops - data.overallStats.cropsWithDiseases) / data.overallStats.totalCrops) * 100)}%
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Accuracy Rate</div>
                  </div>
                </div>
              </div>
            </div>



            {/*  Disease Diagnostic Tool */}
            <div className="mt-8">
               <QuickDiseaseDiagnostic />
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateCropModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

// Quick Disease Diagnostic Component
const QuickDiseaseDiagnostic = () => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    try {
      setAnalyzing(true);
      setError(null);
      const data = await cropService.detectDisease(selectedFile);
      setResult(data.detection);
    } catch (err) {
      console.error('Error analyzing disease:', err);
      setError('Diagnostic failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const getSeverityBg = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'severe': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-10 shadow-2xl border border-gray-100 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <Bug className="w-56 h-56" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-red-50 p-4 rounded-2xl">
            <Camera className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {t("Instant Disease Diagnostic") || "Instant Disease Diagnostic"}
            </h3>
            <p className="text-gray-500 font-medium mt-1">Professional leaf analysis powered by Deep Learning</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Upload Section */}
          <div className="space-y-8">
            {!preview ? (
              <label className="group border-3 border-dashed border-gray-200 rounded-[2.5rem] p-16 flex flex-col items-center justify-center cursor-pointer hover:border-red-400 hover:bg-red-50/30 transition-all duration-500 aspect-[4/3] bg-gray-50/50">
                <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 group-hover:scale-110 group-hover:shadow-red-200/50 transition-all duration-500 mb-6 border border-gray-100">
                  <Upload className="w-12 h-12 text-red-500" />
                </div>
                <span className="text-xl font-bold text-gray-900">Drop leaf photo here</span>
                <p className="text-sm font-medium text-gray-400 mt-3 text-center px-4">Supports high-resolution JPG & PNG files</p>
                <input type="file" className="hidden" onChange={handleFileSelect} accept="image/*" />
              </label>
            ) : (
              <div className="space-y-6">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white aspect-[4/3] bg-gray-100 group/img">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={reset}
                      className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl hover:bg-white text-red-600 font-bold flex items-center space-x-2 transition-all transform translate-y-4 group-hover/img:translate-y-0"
                    >
                      <X className="w-6 h-6" />
                      <span>Remove & Replace</span>
                    </button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="flex-1 bg-gray-900 text-white py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-red-600 hover:shadow-red-200 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-4"
                  >
                    {analyzing ? (
                      <>
                        <Loader className="w-6 h-6 animate-spin text-red-400" />
                        <span className="tracking-tight uppercase">AI Engine Processing...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="w-6 h-6 text-red-400" />
                        <span className="tracking-tight uppercase">Execute Diagnostic</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 p-5 rounded-2xl flex items-center space-x-3 border border-red-100">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <span className="font-bold">{error}</span>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            {result ? (
              <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-200 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 shadow-inner">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Diagnosis Report</div>
                    <h4 className="text-3xl font-black text-gray-900">{result.disease?.name || result.diseaseName}</h4>
                    <div className="flex items-center gap-2 pt-2">
                       <span className="px-3 py-1 bg-white text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm border border-blue-50">
                         {result.analysisTier || 'Standard Tier'}
                       </span>
                    </div>
                  </div>
                  <div className={`px-5 py-2.5 rounded-2xl border-2 font-black text-xs uppercase tracking-tighter ${getSeverityBg(result.severity?.level || result.severityLevel)}`}>
                    {(result.severity?.level || result.severityLevel)} Risk
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group/stat hover:border-red-100 transition-colors">
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2 group-hover/stat:text-red-400 transition-colors">Confidence Index</div>
                    <div className="text-3xl font-black text-gray-900">{(result.confidence || 0).toFixed(1)}%</div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group/stat hover:border-orange-100 transition-colors">
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2 group-hover/stat:text-orange-400 transition-colors">Spread Velocity</div>
                    <div className="text-3xl font-black text-gray-900">
                      {(result.severity?.score || 0) > 20 ? 'High' : 'Normal'}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                    <Droplet className="w-4 h-4 mr-2 text-blue-500" />
                    Pathological Analysis
                  </h5>
                  <p className="text-gray-600 font-medium leading-relaxed text-sm">
                    {result.disease?.description || result.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Remediation Protocol
                  </h5>
                  <div className="space-y-3">
                    {(result.recommendations || result.treatment?.steps || []).map((rec, i) => (
                      <div key={i} className="flex items-start bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-sm font-medium text-gray-700 group/item hover:border-green-200 transition-colors">
                        <div className="w-5 h-5 bg-green-50 rounded-lg flex items-center justify-center text-green-600 font-bold text-[10px] mr-3 group-hover/item:bg-green-600 group-hover/item:text-white transition-colors">
                          {i + 1}
                        </div>
                        <span className="flex-1">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : !analyzing ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-16 bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-200 group/empty">
                <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/30 mb-8 group-hover/empty:scale-110 transition-transform duration-500">
                  <Eye className="w-12 h-12 text-gray-300" />
                </div>
                <h4 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">System Ready</h4>
                <p className="text-gray-400 font-medium max-w-[240px] leading-relaxed">
                  Please upload a high-resolution leaf photo to initiate the AI diagnostic sequence.
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-16 space-y-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-inner">
                <div className="relative">
                  <div className="w-32 h-32 border-4 border-gray-50 border-t-red-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="w-10 h-10 text-red-600 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-2xl font-black text-gray-900 tracking-tight">Processing Neural Link...</h4>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Cross-referencing biological signatures</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// Upload Image Modal Component
const UploadImageModal = ({ isOpen, onClose, cropId, cropName, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const pollForAnalysis = async (imageId, maxAttempts = 15) => {
    console.log('🔄 Starting to poll for analysis completion...');
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const status = await cropService.getAnalysisStatus(imageId);
        console.log(`Poll attempt ${i + 1}:`, status.status);
        
        if (status.status === 'COMPLETED') {
          console.log('✅ Analysis completed!');
          return true;
        }
        
        if (status.status === 'FAILED') {
          console.log('❌ Analysis failed');
          return false;
        }
        
        // Wait 2 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error('Error polling status:', error);
      }
    }
    
    console.log('⏱️ Polling timeout');
    return false;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setError(null);

      console.log('📤 Uploading image...');
      const result = await cropService.uploadCropImage(
        cropId,
        selectedFile,
        (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      );

      console.log('✅ Upload response:', result);

      // Start analyzing state
      setUploading(false);
      setAnalyzing(true);

      // Poll for analysis completion
      const completed = await pollForAnalysis(result.image.id);

      // Refresh data regardless of completion
      console.log('🔄 Refreshing crop data...');
      await onSuccess();
      
      handleClose();

    } catch (err) {
      console.error('❌ Upload error:', err);
      setError(err.response?.data?.message || 'Upload failed');
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadProgress(0);
    setAnalyzing(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-xl w-full p-10 shadow-2xl border border-white/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-100/30 blur-3xl rounded-full -mr-16 -mt-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">Upload Evidence</h3>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Crop: {cropName}</p>
            </div>
            <button 
              onClick={handleClose} 
              className="bg-gray-50 p-3 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
              disabled={uploading || analyzing}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {!preview ? (
            <label className="border-3 border-dashed border-gray-100 rounded-[2rem] p-12 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-500 group">
              <div className="bg-green-50 p-6 rounded-3xl group-hover:scale-110 transition-transform mb-6">
                <Camera className="w-12 h-12 text-green-600" />
              </div>
              <p className="text-xl font-bold text-gray-900 mb-2">Select High-Res Photo</p>
              <p className="text-sm font-medium text-gray-400">Up to 5MB (PNG, JPG, HEIC)</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-8">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white group/preview">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-72 object-cover"
                />
                {!uploading && !analyzing && (
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                    }}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl text-red-600 shadow-xl hover:bg-white transition-all opacity-0 group-hover/preview:opacity-100 transform translate-y-2 group-hover/preview:translate-y-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {uploading && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">Transmitting Data</span>
                    <span className="text-sm font-black text-green-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-green-600 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {analyzing && (
                <div className="bg-gray-900 text-white rounded-2xl p-6 flex items-center space-x-6 shadow-xl">
                  <div className="w-12 h-12 border-4 border-white/10 border-t-green-400 rounded-full animate-spin"></div>
                  <div className="flex-1">
                    <p className="text-sm font-black uppercase tracking-widest text-green-400 mb-1">AI Logic Active</p>
                    <p className="text-xs font-medium text-gray-400 leading-relaxed">Deciphering visual health markers and disease signatures...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-700 p-5 rounded-2xl font-bold text-sm border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleClose}
                  disabled={uploading || analyzing}
                  className="flex-1 px-6 py-4 bg-gray-50 text-gray-900 rounded-2xl hover:bg-gray-100 font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || analyzing}
                  className="flex-1 px-6 py-4 bg-gray-900 text-white rounded-2xl hover:bg-green-600 font-black text-sm uppercase tracking-widest transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center space-x-3"
                >
                  {uploading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Uploading</span>
                    </>
                  ) : analyzing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin text-green-400" />
                      <span>Analyzing</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Sync Data</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Create Crop Modal Component
const CreateCropModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    plantedDate: '',
    expectedHarvest: '',
    location: '',
    area: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cropTypes = [
    'Tomato', 'Rice', 'Wheat', 'Corn', 'Potato', 'Cotton',
    'Sugarcane', 'Soybean', 'Onion', 'Cabbage', 'Carrot', 'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      await cropService.createCrop(formData);
      
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create crop');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-2xl w-full p-10 shadow-2xl border border-white/20 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 right-0 w-48 h-48 bg-green-100/30 blur-3xl rounded-full -mr-24 -mt-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">New Cultivation</h3>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Register your field assets</p>
            </div>
            <button 
              onClick={onClose} 
              className="bg-gray-50 p-3 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Crop Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Tomato Field A"
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-bold text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Plant Variety</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-bold text-gray-900 appearance-none"
                >
                  <option value="">Select variety</option>
                  {cropTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Planting Date</label>
                <input
                  type="date"
                  name="plantedDate"
                  value={formData.plantedDate}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-bold text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Expected Harvest</label>
                <input
                  type="date"
                  name="expectedHarvest"
                  value={formData.expectedHarvest}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-bold text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Geographic Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. North Plot, Row 4"
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-bold text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cultivation Area (Acres)</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="e.g. 2.5"
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none font-bold text-gray-900"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-5 rounded-2xl font-bold text-sm border border-red-100">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-8 py-4 bg-gray-50 text-gray-900 rounded-2xl hover:bg-gray-100 font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-8 py-4 bg-gray-900 text-white rounded-2xl hover:bg-green-600 font-black text-sm uppercase tracking-widest transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Initialize Asset</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
