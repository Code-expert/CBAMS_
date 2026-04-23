import React from 'react';
import Sidebar from '../Layouts/Sidebar';
import FarmMetrics from './FarmMetrics';
import QuickActions from './QuickActions';
import FarmStatistics from './FarmStatistics';
import TasksPanel from './TasksPanel';
import WeatherForecast from './WeatherForecast';
import RecentActivity from './RecentActivity';
import CropRecommendation from './CropRecommendation';

import { useOutletContext } from 'react-router-dom';

const OverviewTab = ({ currentLanguage: propLanguage }) => {
  const context = useOutletContext() || {};
  const currentLanguage = propLanguage || context.currentLanguage || 'en';
  const [selectedTask, setSelectedTask] = React.useState(null);
  return (
    <div className="space-y-6">
      <FarmMetrics currentLanguage={currentLanguage} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActions currentLanguage={currentLanguage} />
        <FarmStatistics currentLanguage={currentLanguage} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TasksPanel 
          currentLanguage={currentLanguage} 
          selectedTask={selectedTask} 
          setSelectedTask={setSelectedTask} 
        />
        <div className="space-y-6">
          <WeatherForecast currentLanguage={currentLanguage} />
          <CropRecommendation currentLanguage={currentLanguage} />
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;


