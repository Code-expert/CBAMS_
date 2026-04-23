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
import { cropService } from '../../services/cropService';

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

      // Fetch tasks using service
      const response = await cropService.getTasks();
      
      // Filter for today's tasks
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Fix: cropService.getTasks() may return the array directly or an object with a data property
      const tasksData = Array.isArray(response) ? response : (response?.data || []);
      
      const todaysTasks = tasksData.filter(task => {
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
      className="glass-card rounded-3xl p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-emerald-100 rounded-xl">
            <Calendar className="w-6 h-6 text-emerald-600" />
          </div>
          {t('todaysTasks')}
        </h3>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-wider">
            {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
          </span>
          <button 
            onClick={fetchTodaysTasks}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-emerald-600"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {tasks.map((task, index) => {
          const Icon = getTaskIcon(task.category);
          const isCompleted = task.status === 'COMPLETED';
          
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 5 }}
              className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-50/50 border-emerald-100 opacity-75' 
                  : 'bg-white border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5'
              }`}
              onClick={() => setSelectedTask(task)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleComplete(task.id, task.status);
                }}
                className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 border border-slate-100 group-hover:border-emerald-100'
                }`}
              >
                {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
              </button>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-sm font-black tracking-tight ${
                    isCompleted ? 'text-emerald-900/40 line-through' : 'text-slate-800'
                  }`}>
                    {task.title}
                  </h4>
                  <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter rounded-lg ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatTime(task.dueDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    <span className="uppercase tracking-widest opacity-70">{task.category}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modern Progress Summary */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        {[
          { label: 'Done', val: tasks.filter(t => t.status === 'COMPLETED').length, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Wait', val: tasks.filter(t => t.status !== 'COMPLETED').length, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Goal', val: `${tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'COMPLETED').length / tasks.length) * 100) : 0}%`, color: 'text-blue-500', bg: 'bg-blue-50' }
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} rounded-2xl p-4 text-center border border-white/50 shadow-sm`}>
            <p className={`text-xl font-black ${stat.color}`}>{stat.val}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TasksPanel;
