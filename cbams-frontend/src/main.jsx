import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './Language/i18n.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import Home from './pages/Home.jsx'
import store from './redux/store.js'
import AuthPages from './pages/AuthPages.jsx'
import Dashboard from './pages/DashBoard'
import ProtectedRoute from "./componenets/common/ProtectedRoute" // Add this
import MarketplaceTab from './pages/MarketplaceTab.jsx'
import TasksTab from './pages/TasksTab.jsx'
import AnalyticsTab from './pages/AnalyticsTab.jsx'
import ExpertConsultationPage from './pages/Session.jsx'
import ExpertDashboard from './pages/ExpertDashboard.jsx'
import VideoCall from './pages/VideoCall.jsx'
import Settings from './pages/Setting.jsx'
import OverviewTab from './componenets/Dashboard/OverviewTab'
import FertilizerTab from './pages/FertilizerTab'
import ChatbotTab from './pages/ChatBot'
import WeatherForecast from './componenets/Dashboard/WeatherForecast'
import Community from './componenets/Dashboard/Community'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />, // Public route - no protection needed
      },
      {
        path: '/login',
        element: <AuthPages />, // Public route - no protection needed
      },
      {
        path: '/expert/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['EXPERT']}>
            <ExpertDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/video-call/:roomId',
        element: (
          <ProtectedRoute>
            <VideoCall />
          </ProtectedRoute>
        ),
      },

      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <OverviewTab /> },
          { path: 'analytics', element: <AnalyticsTab /> },
          { path: 'tasks', element: <TasksTab /> },
          { path: 'marketplace', element: <MarketplaceTab /> },
          { path: 'chatbot', element: <ChatbotTab /> },
          { path: 'session', element: <ExpertConsultationPage /> },
          { 
            path: 'weather', 
            element: (
              <div className="space-y-6">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Weather Dashboard</h2>
                <WeatherForecast />
              </div>
            ) 
          },
          { 
            path: 'community', 
            element: (
              <div className="space-y-6">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Community Hub</h2>
                <Community />
              </div>
            ) 
          },
          { 
            path: 'settings', 
            element: (
              <div className="space-y-6">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Settings</h2>
                <Settings />
              </div>
            ) 
          },
        ]
      },
      // Keep root-level redirects if needed or remove duplicates
      {
        path: '/marketplace',
        element: (
          <ProtectedRoute>
            <MarketplaceTab />
          </ProtectedRoute>
        ),
      },
      {
        path: '/tasks',
        element: (
          <ProtectedRoute>
            <TasksTab />
          </ProtectedRoute>
        ),
      },
      {
        path: '/schedules',
        element: (
          <ProtectedRoute>
            <TasksTab />
          </ProtectedRoute>
        ),
      },
      {
        path: '/analytics',
        element: (
          <ProtectedRoute>
            <AnalyticsTab />
          </ProtectedRoute>
        ),
      },
      {
        path: '/consultations',
        element: (
          <ProtectedRoute>
            <ExpertConsultationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      // Role-based protected routes
      {
        path: '/admin',
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <Dashboard />
          </ProtectedRoute>
        ),
      },

    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={appRouter} />
    </Provider>
  </StrictMode>,
)
