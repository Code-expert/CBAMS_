import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock,
  CheckCircle,
  Droplets,
  Target,
  Sprout,
  Cloud
} from 'lucide-react';
import { translations } from '../../constants/languages';

const TasksPanel = ({ currentLanguage, selectedTask, setSelectedTask }) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];
  
  const todaysTasks = [
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-green-100"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-green-600" />
        {t('todaysTasks')}
      </h3>
      <div className="space-y-3">
        {todaysTasks.map((task) => {
          const Icon = task.icon;
          return (
            <div
              key={task.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                task.status === 'completed' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200 hover:border-green-200'
              }`}
              onClick={() => setSelectedTask(task)}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                task.status === 'completed' ? 'bg-green-500' : 'bg-gray-400'
              }`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-semibold ${task.status === 'completed' ? 'text-green-800' : 'text-gray-800'}`}>
                    {task.title}
                  </h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.priority === 'High' ? 'bg-red-100 text-red-600' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{task.time}</span>
                  {task.status === 'completed' && (
                    <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default TasksPanel;