import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock,
  CheckCircle,
  Droplets,
  Target,
  Sprout,
  Cloud,
  AlertCircle,
  Package,
  Briefcase,
  Truck,
  Leaf,
  Sun
} from 'lucide-react';
import { translations } from '../../constants/languages';
import axios from '../../utils/axiosConfig';

const TasksPanel = ({ currentLanguage, selectedTask, setSelectedTask }) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon mapping based on task category
  const getTaskIcon = (category) => {
    const iconMap = {
      'Irrigation': Droplets,
      'Planting': Sprout,
      'Fertilizing': Leaf,
      'Pest Control': Target,
      'Harvesting': Package,
      'Maintenance': Briefcase,
      'Transportation': Truck,
      'Weather': Cloud,
      'Other': Sun
    };
    return iconMap[category] || Sprout;
  };

  // Priority color mapping
  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'bg-red-100 text-red-600',
      'Medium': 'bg-yellow-100 text-yellow-600',
      'Low': 'bg-gray-100 text-gray-600'
    };
    return colors[priority] || colors['Low'];
  };

  // Fetch today's tasks
  useEffect(() => {
    fetchTodaysTasks();
  }, []);

  const fetchTodaysTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all tasks
      const response = await axios.get('/tasks');
      
      // Filter for today's tasks
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todaysTasks = response.data.filter(task => {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      });

      // Sort by time (if available in dueDate)
      const sortedTasks = todaysTasks.sort((a, b) => {
        return new Date(a.dueDate) - new Date(b.dueDate);
      });

      setTasks(sortedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Mark task as completed
  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
      
      await axios.put(`/tasks/${taskId}`, { status: newStatus });
      
      // Update local state
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  // Format time from ISO date
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-green-100"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-green-600" />
          {t('todaysTasks')}
        </h3>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-600"></div>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-green-100"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-green-600" />
          {t('todaysTasks')}
        </h3>
        <div className="flex flex-col items-center justify-center py-12 text-red-600">
          <AlertCircle className="w-12 h-12 mb-3" />
          <p className="font-medium">{error}</p>
          <button 
            onClick={fetchTodaysTasks}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-green-100"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-green-600" />
          {t('todaysTasks')}
        </h3>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Calendar className="w-16 h-16 mb-3 opacity-30" />
          <p className="font-medium text-lg">No tasks scheduled for today</p>
          <p className="text-sm mt-2">Create a task in the Tasks tab to get started!</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-green-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-green-600" />
          {t('todaysTasks')}
        </h3>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
          {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
        </span>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {tasks.map((task) => {
          const Icon = getTaskIcon(task.category);
          const isCompleted = task.status === 'COMPLETED';
          
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                isCompleted
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200 hover:border-green-200'
              }`}
              onClick={() => setSelectedTask(task)}
            >
              {/* Checkbox to mark complete */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleComplete(task.id, task.status);
                }}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  isCompleted ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <Icon className="w-5 h-5 text-white" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-semibold ${
                    isCompleted ? 'text-green-800 line-through' : 'text-gray-800'
                  }`}>
                    {task.title}
                  </h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(task.dueDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                      {task.category}
                    </span>
                  </div>

                  {isCompleted && (
                    <div className="ml-auto">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>

                {/* Description preview */}
                {task.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {task.description}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-4 border-t-2 border-gray-100 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-black text-green-600">
            {tasks.filter(t => t.status === 'COMPLETED').length}
          </p>
          <p className="text-xs text-gray-600">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-yellow-600">
            {tasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length}
          </p>
          <p className="text-xs text-gray-600">Pending</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-blue-600">
            {Math.round((tasks.filter(t => t.status === 'COMPLETED').length / tasks.length) * 100)}%
          </p>
          <p className="text-xs text-gray-600">Progress</p>
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={fetchTodaysTasks}
        className="w-full mt-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh Tasks
      </button>
    </motion.div>
  );
};

export default TasksPanel;
