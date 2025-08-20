import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  Droplets, 
  Thermometer, 
  TrendingUp, 
  TestTube2,
  Phone,
  Calendar,
  ShoppingCart,
  BarChart3,
  Sun,
  CloudRain,
  Cloud,
  Play,
  Monitor,
  Smartphone,
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-react';

const DashboardShowcase = () => {
  const [activeView, setActiveView] = useState('desktop');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dashboardData = {
    metrics: [
      { 
        title: "Crop Health", 
        value: "92%", 
        change: "+5% from last week",
        icon: Leaf,
        color: "text-green-600",
        bgColor: "bg-green-50",
        trend: "up"
      },
      { 
        title: "Soil Moisture", 
        value: "68%", 
        change: "+2% from last week",
        icon: Droplets,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        trend: "up"
      },
      { 
        title: "Temperature", 
        value: "28°C", 
        change: "+3°C from last week",
        icon: Thermometer,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        trend: "up"
      },
      { 
        title: "Growth Rate", 
        value: "15%", 
        change: "+8% from last week",
        icon: TrendingUp,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        trend: "up"
      }
    ],
    
    quickActions: [
      { title: "Soil Analysis", subtitle: "Upload crop image", icon: TestTube2, color: "bg-green-500" },
      { title: "AI Assistant", subtitle: "Ask farming questions", icon: Leaf, color: "bg-yellow-500" },
      { title: "Schedule Task", subtitle: "Plan farm activities", icon: Calendar, color: "bg-amber-700" },
      { title: "Expert Call", subtitle: "Book consultation", icon: Phone, color: "bg-green-500" },
      { title: "Marketplace", subtitle: "Buy farm supplies", icon: ShoppingCart, color: "bg-gray-500" },
      { title: "Analytics", subtitle: "View farm data", icon: BarChart3, color: "bg-gray-500" }
    ],

    tasks: [
      { 
        task: "Water tomato field", 
        time: "06:00 AM", 
        field: "Field A", 
        priority: "high", 
        status: "pending",
        icon: Droplets
      },
      { 
        task: "Apply fertilizer to wheat", 
        time: "10:30 AM", 
        field: "Field B", 
        priority: "medium", 
        status: "completed",
        icon: TestTube2
      },
      { 
        task: "Check irrigation system", 
        time: "02:00 PM", 
        field: "Field C", 
        priority: "low", 
        status: "pending",
        icon: Droplets
      },
      { 
        task: "Harvest carrots", 
        time: "04:00 PM", 
        field: "Field D", 
        priority: "high", 
        status: "pending",
        icon: Leaf
      }
    ],

    weather: [
      { day: "Today", temp: "28°C", condition: "sunny", icon: Sun },
      { day: "Tomorrow", temp: "26°C", condition: "cloudy", icon: Cloud },
      { day: "Day After", temp: "24°C", condition: "rainy", icon: CloudRain }
    ],

    recentActivity: [
      { action: "Irrigation completed", location: "Field A", time: "2 hours ago", status: "success" },
      { action: "Soil analysis updated", location: "Field B", time: "4 hours ago", status: "info" },
      { action: "Weather alert received", description: "Rain expected", time: "6 hours ago", status: "warning" }
    ]
  };

  const DashboardMetrics = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {dashboardData.metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-shadow duration-300`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{metric.title}</span>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`w-4 h-4 ${metric.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{metric.change}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const QuickActions = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {dashboardData.quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl text-white text-left transition-all duration-300 hover:shadow-lg ${action.color}`}
            >
              <Icon className="w-6 h-6 mb-2" />
              <div className="text-sm font-semibold">{action.title}</div>
              <div className="text-xs opacity-90">{action.subtitle}</div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  const TasksList = () => (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
      </div>
      <div className="space-y-3">
        {dashboardData.tasks.map((task, index) => {
          const Icon = task.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                task.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${task.status === 'completed' ? 'bg-green-100' : 'bg-white'}`}>
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div>
                  <div className={`font-medium ${task.status === 'completed' ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                    {task.task}
                  </div>
                  <div className="text-sm text-gray-500">
                    {task.time} • {task.field}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {task.priority}
                </span>
                {task.status === 'pending' && (
                  <button className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors">
                    Start
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const WeatherWidget = () => (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Sun className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">Weather Forecast</h3>
      </div>
      
      <div className="space-y-3">
        {dashboardData.weather.map((weather, index) => {
          const Icon = weather.icon;
          return (
            <motion.div
              key={weather.day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg ${
                index === 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${
                  weather.condition === 'sunny' ? 'text-yellow-500' :
                  weather.condition === 'cloudy' ? 'text-gray-500' :
                  'text-blue-500'
                }`} />
                <span className="font-medium text-gray-900">{weather.day}</span>
              </div>
              <span className="font-bold text-gray-900">{weather.temp}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
        <div className="space-y-2">
          {dashboardData.recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 text-sm"
            >
              <div className={`w-2 h-2 rounded-full ${
                activity.status === 'success' ? 'bg-green-500' :
                activity.status === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`} />
              <div className="flex-1">
                <span className="text-gray-900">{activity.action}</span>
                {activity.location && <span className="text-gray-500"> • {activity.location}</span>}
                {activity.description && <span className="text-gray-500"> • {activity.description}</span>}
              </div>
              <span className="text-gray-400 text-xs">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full mb-6">
            <Monitor className="w-4 h-4" />
            <span className="text-sm font-semibold">Smart Dashboard</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your Farm at
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> Your Fingertips</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Experience our intuitive dashboard that puts all your farming data, tasks, and insights in one beautiful, easy-to-use interface.
          </p>

          {/* View Toggle */}
          <div className="flex items-center justify-center gap-2 p-1 bg-gray-100 rounded-xl w-fit mx-auto">
            <button
              onClick={() => setActiveView('desktop')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeView === 'desktop' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span className="font-medium">Desktop</span>
            </button>
            <button
              onClick={() => setActiveView('mobile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeView === 'mobile' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="font-medium">Mobile</span>
            </button>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative max-w-6xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {activeView === 'desktop' ? (
              <motion.div
                key="desktop"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 p-8 overflow-hidden"
              >
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Farm Dashboard</h3>
                    <p className="text-gray-600">Welcome back, Rajesh Kumar</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {currentTime.toLocaleDateString('en-IN', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-gray-600">Punjab, India</div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <DashboardMetrics />
                    <QuickActions />
                    <TasksList />
                  </div>
                  <div className="space-y-6">
                    <WeatherWidget />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="mobile"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="max-w-sm mx-auto"
              >
                <div className="bg-black rounded-[3rem] p-2 shadow-2xl">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden">
                    {/* Mobile Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold">Agri Assist</div>
                          <div className="text-sm opacity-90">Good morning, Rajesh</div>
                        </div>
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <Leaf className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Mobile Content */}
                    <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-3">
                        {dashboardData.metrics.slice(0, 4).map((metric, index) => {
                          const Icon = metric.icon;
                          return (
                            <div key={metric.title} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                              <div className="flex items-center justify-between mb-1">
                                <Icon className={`w-4 h-4 ${metric.color}`} />
                                <span className="text-xs text-gray-500">{metric.title}</span>
                              </div>
                              <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">Quick Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {dashboardData.quickActions.slice(0, 4).map((action, index) => {
                            const Icon = action.icon;
                            return (
                              <button key={action.title} className={`p-3 rounded-xl text-white text-left ${action.color}`}>
                                <Icon className="w-5 h-5 mb-1" />
                                <div className="text-xs font-medium">{action.title}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">Today's Tasks</h4>
                        {dashboardData.tasks.slice(0, 2).map((task, index) => (
                          <div key={index} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{task.task}</div>
                                <div className="text-xs text-gray-500">{task.time} • {task.field}</div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                task.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Features Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mt-16"
        >
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Analytics</h3>
            <p className="text-gray-600">Monitor all your farm metrics in real-time with beautiful, easy-to-understand visualizations.</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile Optimized</h3>
            <p className="text-gray-600">Access your dashboard anywhere, anytime with our fully responsive mobile-friendly interface.</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Scheduling</h3>
            <p className="text-gray-600">AI-powered task scheduling based on weather conditions, crop cycles, and farm priorities.</p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Ready to Experience Smart Farming?</h3>
          <p className="text-lg mb-6 opacity-90">Join thousands of farmers who are already using our platform to optimize their operations.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-600 font-semibold rounded-2xl hover:shadow-xl transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              <span>Watch Live Demo</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white hover:text-green-600 transition-all duration-300"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardShowcase;