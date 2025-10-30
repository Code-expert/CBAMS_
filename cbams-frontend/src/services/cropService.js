import api from '../utils/axiosConfig.js';

export const cropService = {
  getCropsAnalytics: async () => {
    const response = await api.get('/api/crops/analytics'); 
    return response.data;
  },

  getCropDetails: async (cropId) => {
    const response = await api.get(`/api/crops/${cropId}`);
    return response.data;
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
  }
};
