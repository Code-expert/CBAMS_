import api from '../utils/axiosConfig.js';

// Mock data generator for when the backend is disconnected
const getMockAnalytics = () => ({
  crops: [
    {
      id: "mock-1",
      name: "Wheat (Demo)",
      type: "Grain",
      visualHealthScore: 92,
      totalImages: 5,
      daysTracked: 45,
      currentStage: "Flowering",
      plantedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      diseaseDetected: false,
      leafColorHealth: { greenness: 88, yellowingLevel: 8, browningLevel: 4 }
    },
    {
      id: "mock-2",
      name: "Rice (Demo)",
      type: "Grain",
      visualHealthScore: 78,
      totalImages: 3,
      daysTracked: 30,
      currentStage: "Vegetative",
      plantedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      diseaseDetected: true,
      diseaseName: "Leaf Blast",
      leafColorHealth: { greenness: 65, yellowingLevel: 25, browningLevel: 10 }
    }
  ],
  overallStats: {
    totalCrops: 2,
    totalImages: 8,
    imagesThisWeek: 4,
    avgVisualHealth: 85,
    cropsWithDiseases: 1
  }
});

const getMockTasks = () => ([
  {
    id: "task-1",
    title: "Check Irrigation (Demo)",
    description: "Ensure the water pump is working for the north field.",
    category: "Irrigation",
    dueDate: new Date().toISOString(),
    priority: "High",
    status: "PENDING"
  },
  {
    id: "task-2",
    title: "Apply Fertilizer (Demo)",
    description: "Use urea for the rice field.",
    category: "Fertilizing",
    dueDate: new Date().toISOString(),
    priority: "Medium",
    status: "COMPLETED"
  }
]);

export const cropService = {
  getCropsAnalytics: async () => {
    try {
      const response = await api.get('/api/crops/analytics'); 
      return response.data;
    } catch (err) {
      console.warn('⚠️ Backend unreachable, using mock analytics data');
      return getMockAnalytics();
    }
  },

  getCropDetails: async (cropId) => {
    try {
      const response = await api.get(`/api/crops/${cropId}`);
      return response.data;
    } catch (err) {
      return getMockAnalytics().crops.find(c => c.id === cropId) || getMockAnalytics().crops[0];
    }
  },

  createCrop: async (cropData) => {
    const response = await api.post('/api/crops', cropData);
    return response.data;
  },

  uploadCropImage: async (cropId, imageFile, onUploadProgress) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post(`/api/crops/${cropId}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
    return response.data;
  },

  getAnalysisStatus: async (imageId) => {
    const response = await api.get(`/api/crops/image/${imageId}/status`);
    return response.data;
  },
  
  deleteCrop: async (cropId) => {
    const response = await api.delete(`/api/crops/${cropId}`);
    return response.data;
  },

  getYieldPrediction: async (data) => {
    const response = await api.post('/api/ml/yield', data);
    return response.data;
  },

  getPriceForecast: async (crop) => {
    const response = await api.get(`/api/ml/price`, { params: { crop } });
    return response.data;
  },

  detectDisease: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post('/api/ml/detect-disease', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getTasks: async () => {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (err) {
      console.warn('⚠️ Backend unreachable, using mock task data');
      return getMockTasks();
    }
  }
};
