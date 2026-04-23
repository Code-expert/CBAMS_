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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{t("Crop Health Analytics") || "Crop Health Analytics"}</h1>
            <div className="flex items-center space-x-2 text-gray-500 mt-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center space-x-2 shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>{t("Add New Crop") || "Add New Crop"}</span>
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-start space-x-3">
            <Camera className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-blue-800 mb-1">Image-Based AI Analysis</h4>
              <p className="text-sm text-blue-700">
                All metrics are generated by AI analyzing your uploaded crop photos. 
                Upload photos regularly for accurate tracking and early disease detection.
              </p>
            </div>
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
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Crops</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.crops.map((crop) => (
                  <div 
                    key={crop.id}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer hover:scale-[1.02]"
                    onClick={() => setSelectedCrop(crop.id)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-800 mb-1">{crop.name}</h4>
                        <p className="text-sm text-gray-600">{crop.type}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                        crop.visualHealthScore >= 90 ? 'bg-green-100 text-green-700' :
                        crop.visualHealthScore >= 75 ? 'bg-amber-100 text-amber-700' :
                        crop.visualHealthScore === 0 ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {crop.visualHealthScore}%
                      </div>
                    </div>

                    {/* Disease Alert */}
                    {crop.diseaseDetected && (
                      <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <div>
                            <span className="text-sm text-red-700 font-bold">{crop.diseaseName}</span>
                            <p className="text-xs text-red-600">Detected in recent images</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-600 mb-1">Photos</div>
                        <div className="text-lg font-bold text-gray-800">{crop.totalImages}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-600 mb-1">Tracked</div>
                        <div className="text-lg font-bold text-gray-800">{crop.daysTracked}d</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-600 mb-1">Stage</div>
                        <div className="text-xs font-semibold text-gray-800">{crop.currentStage}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-600 mb-1">Greenness</div>
                        <div className="text-lg font-bold text-green-600">
                          {crop.leafColorHealth.greenness}%
                        </div>
                      </div>
                    </div>

                    {/* Health Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-2">
                        <span>Visual Health</span>
                        <span className="font-semibold">Based on {crop.totalImages} images</span>
                      </div>
                      <ProgressBar 
                        percentage={crop.visualHealthScore} 
                        color={getHealthColor(crop.visualHealthScore)} 
                      />
                    </div>

                    {/* View Button */}
                    <button 
                      onClick={() => setSelectedCrop(crop.id)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <Eye className="w-5 h-5" />
                      <span>View Detailed Analysis</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Info Section */}
            <div className="bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Powered by AI</h3>
                <Camera className="w-10 h-10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold mb-2">{data.overallStats.totalImages}</div>
                  <div className="text-purple-100">Images Analyzed</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">
                    {data.overallStats.cropsWithDiseases === 0 ? '100%' : 
                     Math.round(((data.overallStats.totalCrops - data.overallStats.cropsWithDiseases) / data.overallStats.totalCrops) * 100) + '%'}
                  </div>
                  <div className="text-purple-100">Detection Accuracy</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">Real-time</div>
                  <div className="text-purple-100">Analysis Speed</div>
                </div>
              </div>
            </div>

            {/* ML Prediction Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Yield Predictor */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2 text-green-600" />
                  Yield Predictor
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Area (Hectares)</label>
                      <input type="number" id="yield-area" defaultValue="1" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nitrogen (N)</label>
                      <input type="number" id="yield-n" defaultValue="80" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      const data = {
                        area: document.getElementById('yield-area').value,
                        nitrogen: document.getElementById('yield-n').value,
                      };
                      const result = await cropService.getYieldPrediction(data);
                      alert(`Estimated Yield: ${result.prediction.estimatedYield} Tonnes\nConfidence: ${result.prediction.confidence * 100}%`);
                    }}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Calculate Estimated Yield
                  </button>
                </div>
              </div>

              {/* Price Forecast */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                  Market Price Forecast
                </h3>
                <div className="space-y-4">
                  <select id="price-crop" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Rice</option>
                    <option>Maize</option>
                    <option>Wheat</option>
                    <option>Cotton</option>
                  </select>
                  <button 
                    onClick={async () => {
                      const crop = document.getElementById('price-crop').value;
                      const result = await cropService.getPriceForecast(crop);
                      console.log(result.price_data);
                      alert(`Current Price for ${crop}: ${result.price_data.currentPrice} INR/Q\nTrend: ${result.price_data.marketRecommendation}`);
                    }}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Get Price Forecast
                  </button>
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
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Bug className="w-40 h-40" />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <Camera className="w-8 h-8 mr-3 text-red-500" />
          {t("AI Disease Diagnostic") || "AI Disease Diagnostic"}
        </h3>
        <p className="text-gray-600 mb-8 max-w-2xl">
          {t("Upload a clear photo of your plant's leaf to identify potential diseases and get an immediate severity rating and treatment plan.") || "Upload a clear photo of your plant's leaf to identify potential diseases and get an immediate severity rating and treatment plan."}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Upload Section */}
          <div className="space-y-6">
            {!preview ? (
              <label className="group border-3 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all aspect-video">
                <div className="bg-red-100 p-6 rounded-full group-hover:scale-110 transition-transform mb-4">
                  <Upload className="w-10 h-10 text-red-600" />
                </div>
                <span className="text-lg font-bold text-gray-700">Select Leaf Photo</span>
                <p className="text-sm text-gray-500 mt-2 text-center">Supports JPG, PNG (Max 5MB)</p>
                <input type="file" className="hidden" onChange={handleFileSelect} accept="image/*" />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-video bg-gray-100">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={reset}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-white text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center space-x-3"
                  >
                    {analyzing ? (
                      <>
                        <Loader className="w-6 h-6 animate-spin" />
                        <span>AI is Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="w-6 h-6" />
                        <span>Start Diagnostic</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center space-x-2 border border-red-100">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Detected Disease</div>
                    <h4 className="text-3xl font-black text-gray-800">{result.disease.name}</h4>
                    <div className="flex items-center mt-2 space-x-2">
                       <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-tighter shadow-sm border border-blue-200">
                         {result.analysisTier || 'Standard Analysis'}
                       </span>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-2xl border-2 font-bold text-sm ${getSeverityBg(result.severity.level)}`}>
                    {result.severity.level} Severity
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-xs text-gray-400 mb-1">Confidence</div>
                    <div className="text-2xl font-bold text-red-600">{result.confidence.toFixed(1)}%</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-xs text-gray-400 mb-1">Spread Risk</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {result.severity.score > 20 ? 'High' : 'Moderate'}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <h5 className="font-bold text-gray-800 mb-3 flex items-center">
                    <Droplet className="w-5 h-5 mr-2 text-blue-500" />
                    AI Description
                  </h5>
                  <p className="text-gray-600 leading-relaxed">
                    {result.disease.description}
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-gray-800 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Recommended Treatment
                  </h5>
                  <div className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start bg-green-50/50 p-3 rounded-xl border border-green-100 text-sm text-gray-700">
                        <span className="mr-2 text-green-500 font-bold">•</span>
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : !analyzing ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <div className="bg-white p-6 rounded-full shadow-inner mb-6">
                  <Eye className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="text-xl font-bold text-gray-700 mb-2">Awaiting Diagnostic</h4>
                <p className="text-gray-500 max-w-xs">
                  Upload an image and click analyze to start the disease identification process.
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
                  <Bug className="w-10 h-10 text-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-gray-700 animate-pulse">Running Neural Analysis...</h4>
                  <p className="text-gray-500">Comparing visual indicators with database</p>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Upload Crop Image</h3>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={uploading || analyzing}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-600 mb-4">Upload a photo of: <strong>{cropName}</strong></p>

        {!preview ? (
          <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors">
            <Camera className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-600 font-semibold mb-2">Click to select image</p>
            <p className="text-sm text-gray-500">or drag and drop</p>
            <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 5MB</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-64 object-cover rounded-lg"
              />
              {!uploading && !analyzing && (
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {uploading && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Uploading image...</span>
                  <span className="text-sm font-semibold text-green-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {analyzing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Loader className="w-6 h-6 text-blue-600 animate-spin" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">AI Analysis in Progress</p>
                    <p className="text-xs text-blue-600"> analyzing your crop image...</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                disabled={uploading || analyzing}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || analyzing}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50 flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : analyzing ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Upload & Analyze
                  </>
                )}
              </button>
            </div>
          </div>
        )}
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Add New Crop</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Crop Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Tomato Field - North"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Crop Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select crop type</option>
              {cropTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Planted Date *
              </label>
              <input
                type="date"
                name="plantedDate"
                value={formData.plantedDate}
                onChange={handleChange}
                required
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expected Harvest *
              </label>
              <input
                type="date"
                name="expectedHarvest"
                value={formData.expectedHarvest}
                onChange={handleChange}
                required
                min={formData.plantedDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location (Optional)
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., North Field, Plot A"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Area in Acres (Optional)
            </label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              step="0.1"
              min="0"
              placeholder="e.g., 2.5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Create Crop
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnalyticsPage;
