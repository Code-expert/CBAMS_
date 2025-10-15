import api from '../utils/axiosConfig';

const taskService = {
  getTasks: async () => {
    const response = await api.get('/tasks');  // Changed from /api/tasks
    return response.data;
  },

  getTaskStats: async () => {
    const response = await api.get('/tasks/stats');  // Changed from /api/tasks/stats
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);  // Changed from /api/tasks
    return response.data;
  },

  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);  // Changed from /api/tasks/:id
    return response.data;
  },

  updateTaskStatus: async (taskId, status) => {
    const response = await api.put(`/tasks/${taskId}/status`, { status });  // Changed from /api/tasks/:id/status
    return response.data;
  },

  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);  // Changed from /api/tasks/:id
    return response.data;
  }
};

export default taskService;
