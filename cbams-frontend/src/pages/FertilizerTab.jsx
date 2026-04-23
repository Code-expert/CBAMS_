import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplet, 
  Sprout, 
  Thermometer, 
  CloudRain, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Info,
  ArrowRight,
  RefreshCcw,
  Zap,
  Bot
} from 'lucide-react';
import axios from '../utils/axiosConfig';

const FertilizerTab = ({ currentLanguage }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorous: '',
    potassium: '',
    temperature: '',
    humidity: '',
    moisture: '',
    cropType: 'maize'
  });

  const cropTypes = [
    'maize', 'wheat', 'rice', 'cotton', 'sugarcane', 'pulses', 'groundnuts', 'tobacco', 'barley', 'oilseeds'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Validate inputs
      const values = Object.values(formData).filter(v => v === '');
      if (values.length > 0) {
        throw new Error('Please fill all soil metrics and weather values.');
      }

      const response = await axios.post('/api/ml/recommend-fertilizer', {
        nitrogen: Number(formData.nitrogen),
        phosphorous: Number(formData.phosphorous),
        potassium: Number(formData.potassium),
        temperature: Number(formData.temperature),
        humidity: Number(formData.humidity),
        moisture: Number(formData.moisture),
        cropType: formData.cropType
      });

      setResult(response.data);
    } catch (err) {
      console.error('Fertilizer prediction error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to get recommendation');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nitrogen: '',
      phosphorous: '',
      potassium: '',
      temperature: '',
      humidity: '',
      moisture: '',
      cropType: 'maize'
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Zap className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.2em]">ML Precision Farming</span>
        </div>
        <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">Fertilizer Advisor</h1>
        <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-3xl">
          Enter your soil metrics and environmental conditions to get a high-precision fertilizer dosage plan powered by machine learning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Card */}
        <motion.div 
          layout
          className={`lg:col-span-${result ? '5' : '12'} bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 transition-all duration-500`}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Soil Nutrients Section */}
              <div className="md:col-span-3">
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-500" />
                  Soil Nutrients (mg/kg)
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Nitrogen (N)', name: 'nitrogen', color: 'emerald' },
                    { label: 'Phosphorous (P)', name: 'phosphorous', color: 'blue' },
                    { label: 'Potassium (K)', name: 'potassium', color: 'purple' }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1.5 px-1">{field.label}</label>
                      <input
                        type="number"
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full bg-gray-50 border-2 border-gray-100 px-4 py-3 rounded-xl font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Environmental Metrics */}
              <div className="md:col-span-3">
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-blue-500" />
                  Environmental Conditions
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1.5 px-1">Temp (°C)</label>
                    <div className="relative">
                      <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        type="number"
                        step="0.1"
                        name="temperature"
                        value={formData.temperature}
                        onChange={handleInputChange}
                        placeholder="25"
                        className="w-full bg-gray-50 border-2 border-gray-100 pl-9 pr-4 py-3 rounded-xl font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1.5 px-1">Humidity (%)</label>
                    <div className="relative">
                      <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        type="number"
                        name="humidity"
                        value={formData.humidity}
                        onChange={handleInputChange}
                        placeholder="60"
                        className="w-full bg-gray-50 border-2 border-gray-100 pl-9 pr-4 py-3 rounded-xl font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1.5 px-1">Moisture (%)</label>
                    <div className="relative">
                      <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        type="number"
                        name="moisture"
                        value={formData.moisture}
                        onChange={handleInputChange}
                        placeholder="45"
                        className="w-full bg-gray-50 border-2 border-gray-100 pl-9 pr-4 py-3 rounded-xl font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Crop Selection */}
              <div className="md:col-span-3">
                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-green-500" />
                  Target Crop
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {cropTypes.map((crop) => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, cropType: crop }))}
                      className={`py-3 px-2 rounded-xl text-xs font-black uppercase tracking-tighter transition-all border-2 ${
                        formData.cropType === crop 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' 
                        : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-200'
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              {result && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  <RefreshCcw className="w-4 h-4" />
                  RESET
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gray-900 text-white rounded-2xl py-4 font-black tracking-widest text-xs transition-all shadow-xl shadow-gray-200 hover:-translate-y-1 disabled:bg-gray-400 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    GENERATING ADVISORY...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    GET RECOMMENDATION
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}
        </motion.div>

        {/* Result Display */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Main Recommendation Card */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-white/10 px-4 py-2 rounded-full border border-white/20">Analysis Complete</span>
                  </div>

                  <p className="text-emerald-100/80 font-black text-xs uppercase tracking-widest mb-2">Recommended Fertilizer</p>
                  <h2 className="text-6xl font-black mb-10 tracking-tighter">{result.recommendation || result.fertilizer}</h2>
                  
                  <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/20">
                    <div>
                      <p className="text-[10px] text-emerald-100/60 font-black uppercase tracking-widest mb-1">Target Crop</p>
                      <p className="text-xl font-bold capitalize">{formData.cropType}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-100/60 font-black uppercase tracking-widest mb-1">Dosage Status</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <p className="text-xl font-bold">Standard</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advisory Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-xl">
                      <Info className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="font-black text-gray-900">Why this fertilizer?</h4>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">
                    Based on your soil's {formData.nitrogen} N units and {formData.moisture}% moisture, our ML model indicates that <strong>{result.recommendation || result.fertilizer}</strong> will optimize nutrient uptake for {formData.cropType}.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                  <h4 className="font-black text-gray-900 mb-4">Application Guide</h4>
                  <ul className="space-y-3">
                    {[
                      'Apply during early morning or evening',
                      'Ensure adequate soil moisture before use',
                      'Maintain 15cm distance from crop stems'
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs font-bold text-gray-600">
                        <ArrowRight className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!result && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 text-center"
        >
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bot className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-gray-400 font-bold max-w-md mx-auto">
            Ready to analyze your soil. Your data is processed securely through our precision ML protocols.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default FertilizerTab;
