import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  TrendingUp,
  Users,
  DollarSign,
  Loader2,
  Copy
} from 'lucide-react';
import sessionService from '../services/sessionService';

const ExpertDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed

  useEffect(() => {
    // Redirect if not expert
    if (user?.role !== 'EXPERT') {
      navigate('/dashboard');
      return;
    }

    fetchSessions();
  }, [user, navigate]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionService.getExpertSessions();

      // Handle different response formats
      let sessionsData = [];

      if (Array.isArray(response)) {
        sessionsData = response;
      } else if (response && Array.isArray(response.sessions)) {
        sessionsData = response.sessions;
      } else if (response && Array.isArray(response.data)) {
        sessionsData = response.data;
      } else {
        console.warn('Unexpected response format:', response);
        sessionsData = [];
      }

      console.log('✅ Fetched sessions:', sessionsData);

      setSessions(sessionsData);

      // Calculate stats
      const newStats = {
        total: sessionsData.length,
        pending: sessionsData.filter(s => s.status === 'PENDING').length,
        confirmed: sessionsData.filter(s => s.status === 'CONFIRMED').length,
        completed: sessionsData.filter(s => s.status === 'COMPLETED').length
      };

      setStats(newStats);
    } catch (error) {
      console.error('❌ Error fetching sessions:', error);
      setSessions([]); // Always fallback to empty array
      setStats({ total: 0, pending: 0, confirmed: 0, completed: 0 });
    } finally {
      setLoading(false);
    }
  };


  const handleConfirm = async (sessionId) => {
    try {
      await sessionService.confirmSession(sessionId);
      fetchSessions();
      alert('Session confirmed successfully!');
    } catch (error) {
      console.error('Error confirming session:', error);
      alert('Failed to confirm session');
    }
  };

  const handleDecline = async (sessionId) => {
    if (!window.confirm('Are you sure you want to decline this session?')) return;

    try {
      await sessionService.updateSessionStatus(sessionId, 'CANCELLED');
      fetchSessions();
      alert('Session declined');
    } catch (error) {
      console.error('Error declining session:', error);
      alert('Failed to decline session');
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    if (filter === 'pending') return session.status === 'PENDING';
    if (filter === 'confirmed') return session.status === 'CONFIRMED';
    if (filter === 'completed') return session.status === 'COMPLETED';
    return true;
  });

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      CONFIRMED: 'bg-green-100 text-green-700 border-green-300',
      CANCELLED: 'bg-red-100 text-red-700 border-red-300',
      COMPLETED: 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[status] || colors.PENDING;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Loader2 className="w-12 h-12 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome, Dr. {user?.name}
          </h1>
          <p className="text-gray-600">Expert Consultation Dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Confirmed</p>
                <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-blue-600">{stats.completed}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl p-2 shadow-lg mb-6 flex gap-2">
          {['all', 'pending', 'confirmed', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${filter === tab
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-lg">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No {filter !== 'all' ? filter : ''} consultation requests</p>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {session.farmer?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{session.farmer?.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{session.farmer?.email}</span>
                        </div>
                        {session.farmer?.profile?.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{session.farmer.profile.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                </div>

                {/* ADD CONSULTATION CODE HERE */}
                <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Consultation Code</p>
                      <p className="text-2xl font-bold text-green-700 tracking-wider font-mono">
                        {session.id.substring(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(session.id.substring(0, 8).toUpperCase());
                        alert('Code copied to clipboard!');
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Verify this code matches the farmer's code
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{new Date(session.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{new Date(session.date).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {session.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleConfirm(session.id)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Accept Request
                      </button>
                      <button
                        onClick={() => handleDecline(session.id)}
                        className="flex-1 bg-red-100 text-red-600 py-3 rounded-lg hover:bg-red-200 transition-all flex items-center justify-center gap-2 font-medium"
                      >
                        <XCircle className="w-5 h-5" />
                        Decline
                      </button>
                    </>
                  )}

                  {session.status === 'CONFIRMED' && session.videoRoomId && (
                    <button
                      onClick={() => window.open(`/webrtc-test.html?room=${session.videoRoomId}`, '_blank')}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium"
                    >
                      <Video className="w-5 h-5" />
                      Start Video Call
                    </button>
                  )}

                  {session.status === 'COMPLETED' && (
                    <div className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg flex items-center justify-center gap-2 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      Session Completed
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboard;
