import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  Clock,
  CheckCircle,
  Droplets,
  Target,
  Sprout,
  Cloud,
  Plus,
  X,
  Edit2,
  Trash2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { translations } from '../constants/languages';
import taskService from '../services/taskService';

const TasksTab = ({ currentLanguage = 'en' }) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    dueDate: '',
    priority: 'MEDIUM',
    icon: 'Sprout'
  });

  const iconMap = {
    'Droplets': Droplets,
    'Target': Target,
    'Sprout': Sprout,
    'Cloud': Cloud,
    'Calendar': Calendar
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await taskService.getTaskStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskService.createTask(formData);
      setShowAddModal(false);
      resetForm();
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task');
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await taskService.updateTask(currentTask.id, formData);
      setShowEditModal(false);
      setCurrentTask(null);
      resetForm();
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.deleteTask(taskId);
      fetchTasks();
      fetchStats();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    }
  };

  const openEditModal = (task) => {
    setCurrentTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      time: task.time,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      priority: task.priority,
      icon: task.icon
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      time: '',
      dueDate: '',
      priority: 'MEDIUM',
      icon: 'Sprout'
    });
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">{t('tasks')}</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t('addNewTask')}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Task Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: t('pendingTasks'), count: stats.pending, color: 'from-yellow-400 to-orange-500', tasks: getTasksByStatus('PENDING'), status: 'PENDING' },
          { title: t('inProgress'), count: stats.inProgress, color: 'from-blue-400 to-cyan-500', tasks: getTasksByStatus('IN_PROGRESS'), status: 'IN_PROGRESS' },
          { title: t('completed'), count: stats.completed, color: 'from-green-400 to-emerald-500', tasks: getTasksByStatus('COMPLETED'), status: 'COMPLETED' }
        ].map((category, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">{category.title}</h3>
              <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                {category.count}
              </div>
            </div>
            <div className="space-y-3">
              {category.tasks.slice(0, 3).map((task) => {
                const Icon = iconMap[task.icon] || Sprout;
                return (
                  <div 
                    key={task.id} 
                    className="p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors cursor-pointer"
                    onClick={() => openEditModal(task)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{task.title}</div>
                        <div className="text-sm text-gray-600">{task.time}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {category.tasks.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Task List */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{t('allTasks')}</h3>
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No tasks found. Create your first task!</p>
          ) : (
            tasks.map((task) => {
              const Icon = iconMap[task.icon] || Sprout;
              return (
                <div key={task.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-green-200 hover:shadow-md transition-all">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    task.status === 'COMPLETED' ? 'bg-green-500' : 
                    task.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">{task.title}</h4>
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        task.priority === 'HIGH' ? 'bg-red-100 text-red-600' :
                        task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{task.time}</span>
                      </div>
                      {task.status === 'COMPLETED' && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status !== 'COMPLETED' && (
                      <button 
                        onClick={() => handleStatusChange(task.id, 
                          task.status === 'PENDING' ? 'IN_PROGRESS' : 'COMPLETED'
                        )}
                        className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        {task.status === 'PENDING' ? 'Start' : 'Complete'}
                      </button>
                    )}
                    <button 
                      onClick={() => openEditModal(task)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add/Edit Task Modal */}
      {(showAddModal || showEditModal) && (
        <TaskModal
          title={showAddModal ? "Add New Task" : "Edit Task"}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={showAddModal ? handleCreateTask : handleUpdateTask}
          onClose={() => {
            showAddModal ? setShowAddModal(false) : setShowEditModal(false);
            setCurrentTask(null);
            resetForm();
          }}
          iconMap={iconMap}
        />
      )}
    </div>
  );
};

// Task Modal Component
const TaskModal = ({ title, formData, onInputChange, onSubmit, onClose, iconMap }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter task description"
            />
          </div>

          {/* Time & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={onInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={onInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {Object.keys(iconMap).map((iconName) => {
                const Icon = iconMap[iconName];
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => onInputChange({ target: { name: 'icon', value: iconName } })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.icon === iconName
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-gray-700" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              {title === 'Add New Task' ? 'Create Task' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TasksTab;
