import React from 'react';
import { 
  Calendar,
  Clock,
  CheckCircle,
  Droplets,
  Target,
  Sprout,
  Cloud
} from 'lucide-react';
import { translations } from '../constants/languages';

const TasksTab = ({ currentLanguage }) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];

  const allTasks = [
    { 
      id: 1,
      title: 'Water tomato plants', 
      time: '8:00 AM', 
      priority: 'High',
      status: 'pending',
      icon: Droplets,
      description: 'Check drip irrigation system and water levels'
    },
    { 
      id: 2,
      title: 'Check pest traps', 
      time: '10:30 AM', 
      priority: 'Medium',
      status: 'completed',
      icon: Target,
      description: 'Inspect and replace pest monitoring traps'
    },
    { 
      id: 3,
      title: 'Fertilizer application', 
      time: '2:00 PM', 
      priority: 'High',
      status: 'pending',
      icon: Sprout,
      description: 'Apply organic fertilizer to wheat field section A'
    },
    { 
      id: 4,
      title: 'Weather monitoring', 
      time: '6:00 PM', 
      priority: 'Low',
      status: 'pending',
      icon: Cloud,
      description: 'Review weather forecast for next 3 days'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">{t('tasks')}</h2>
        <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {t('addNewTask')}
        </button>
      </div>

      {/* Task Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: t('pendingTasks'), count: 8, color: 'from-yellow-400 to-orange-500', tasks: allTasks.filter(t => t.status === 'pending') },
          { title: t('inProgress'), count: 3, color: 'from-blue-400 to-cyan-500', tasks: [] },
          { title: t('completed'), count: 12, color: 'from-green-400 to-emerald-500', tasks: allTasks.filter(t => t.status === 'completed') }
        ].map((category, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">{category.title}</h3>
              <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                {category.count}
              </div>
            </div>
            <div className="space-y-3">
              {category.tasks.map((task, taskIndex) => {
                const Icon = task.icon;
                return (
                  <div key={taskIndex} className="p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors cursor-pointer">
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
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Task List */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{t('allTasks')}</h3>
        <div className="space-y-4">
          {allTasks.map((task) => {
            const Icon = task.icon;
            return (
              <div key={task.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-green-200 hover:shadow-md transition-all cursor-pointer">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  task.status === 'completed' ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-gray-800">{task.title}</h4>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      task.priority === 'High' ? 'bg-red-100 text-red-600' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
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
                    {task.status === 'completed' && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                </div>
                <button className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                  {task.status === 'completed' ? 'View' : 'Start'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TasksTab;