// services/geminiService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token') || localStorage.getItem('agri_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const geminiService = {
  async generateResponse(prompt, conversationHistory = [], currentLanguage = 'en') {
    try {
      console.log('🤖 Sending chat to backend...');
      const response = await api.post('/api/chatbot/chat', {
        message: prompt,
        history: conversationHistory.slice(-6).map(msg => ({
          type: msg.type,
          content: msg.content
        })),
        language: currentLanguage
      });
      
      console.log('✅ Chatbot Backend Success');
      return response.data.text;
    } catch (error) {
      console.error('❌ Chatbot Error:', error);
      throw error;
    }
  },

  async analyzeImage(imageBase64, prompt = "Analyze this crop image", currentLanguage = 'en') {
    try {
      console.log('📸 Sending image to backend for analysis...');
      
      const response = await api.post('/api/chatbot/chat', {
        message: prompt,
        image: imageBase64,
        language: currentLanguage
      });

      console.log('✅ Vision Backend Success');
      return response.data.text;
    } catch (error) {
       console.error('❌ Vision Error:', error);
       throw error;
    }
  }
};
