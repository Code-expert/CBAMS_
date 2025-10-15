import api from '../utils/axiosConfig';

const sessionService = {
  // Get all experts (Change from /api/admin/expert to /admin/expert)
  getExperts: async () => {
    const response = await api.get('/admin/expert');
    return response.data;
  },

  // Book a session (Farmer only)
  bookSession: async (sessionData) => {
    const response = await api.post('/session', sessionData);
    return response.data;
  },

  // Get farmer's sessions
  getFarmerSessions: async () => {
    const response = await api.get('/session/farmer');
    return response.data;
  },

  // Get expert's sessions
  getExpertSessions: async () => {
    const response = await api.get('/session/expert');
    return response.data;
  },

  // Confirm session (Expert only)
  confirmSession: async (sessionId) => {
    const response = await api.put(`/session/${sessionId}/confirm`);
    return response.data;
  },

  // Cancel/Update session status
  updateSessionStatus: async (sessionId, status) => {
    const response = await api.put(`/session/${sessionId}/status`, { status });
    return response.data;
  }
};

export default sessionService;
