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
        element: <VideoCall/>,
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      // Add more protected routes here
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
            <div>Schedules Page</div> {/* Replace with your Schedules component */}
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
            <div>Admin Panel</div> {/* Replace with your Admin component */}
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
