import api from '../utils/axiosConfig';

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await api.get('/profile/me');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/profile/update', userData);
    return response.data;
  }
};

export default authService;
