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
  Loader2,
  Copy,
  Check
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
  const [filter, setFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
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

      let sessionsData = [];
      if (Array.isArray(response)) {
        sessionsData = response;
      } else if (response && Array.isArray(response.sessions)) {
        sessionsData = response.sessions;
      } else if (response && Array.isArray(response.data)) {
        sessionsData = response.data;
      }

      setSessions(sessionsData);

      const newStats = {
        total: sessionsData.length,
        pending: sessionsData.filter(s => s.status === 'PENDING').length,
        confirmed: sessionsData.filter(s => s.status === 'CONFIRMED').length,
        completed: sessionsData.filter(s => s.status === 'COMPLETED').length
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setSessions([]);
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

  const copyCode = (code, sessionId) => {
    navigator.clipboard.writeText(code);
    setCopiedId(sessionId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.status === filter.toUpperCase();
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
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Welcome, Dr. {user?.name}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Expert Consultation Dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Sessions</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Confirmed</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.completed}</p>
              </div>
              <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl p-2 shadow-lg mb-6 flex gap-2 overflow-x-auto">
          {['all', 'pending', 'confirmed', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 min-w-[80px] py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all text-sm sm:text-base whitespace-nowrap ${
                filter === tab
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
            <div className="bg-white rounded-xl p-8 sm:p-12 text-center shadow-lg">
              <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-base sm:text-lg">No {filter !== 'all' ? filter : ''} consultation requests</p>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
                      {session.farmer?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{session.farmer?.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{session.farmer?.email}</span>
                        </div>
                        {session.farmer?.profile?.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span>{session.farmer.profile.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border-2 ${getStatusColor(session.status)} whitespace-nowrap self-start sm:self-auto`}>
                    {session.status}
                  </span>
                </div>

                {/* ✅ UPDATED: Prominent Consultation Code */}
                <div className="mb-4 p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-300 shadow-md">
                  <div className="text-center mb-3">
                    <p className="text-xs sm:text-sm text-blue-700 font-bold mb-2 flex items-center justify-center gap-2">
                      <Video className="w-4 h-4" />
                      Session Code
                    </p>
                    <p className="text-4xl sm:text-5xl font-black text-blue-700 tracking-widest font-mono">
                      {session.videoRoomId || '000000'}
                    </p>
                  </div>
                  <button
                    onClick={() => copyCode(session.videoRoomId, session.id)}
                    className={`w-full sm:w-auto mx-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md ${
                      copiedId === session.id
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {copiedId === session.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Code
                      </>
                    )}
                  </button>
                  <p className="text-xs text-blue-600 mt-3 text-center">
                    Verify this code matches the farmer's code before starting
                  </p>
                </div>

                {/* Query Description */}
                {session.description && (
                  <div className="mb-4 p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-xs text-gray-600 font-semibold mb-1.5">Farmer's Query:</p>
                    <p className="text-sm text-gray-800 leading-relaxed">{session.description}</p>
                  </div>
                )}

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">{new Date(session.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">{new Date(session.date).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {session.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleConfirm(session.id)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Accept Request
                      </button>
                      <button
                        onClick={() => handleDecline(session.id)}
                        className="flex-1 bg-red-100 text-red-600 py-3 rounded-lg hover:bg-red-200 transition-all flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                      >
                        <XCircle className="w-5 h-5" />
                        Decline
                      </button>
                    </>
                  )}

                  {session.status === 'CONFIRMED' && session.videoRoomId && (
                    <button
                      onClick={() => navigate(`/video-call/${session.videoRoomId}`)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                    >
                      <Video className="w-5 h-5" />
                      Start Video Call
                    </button>
                  )}

                  {session.status === 'COMPLETED' && (
                    <div className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg flex items-center justify-center gap-2 font-medium text-sm sm:text-base">
                      <CheckCircle className="w-5 h-5" />
                      Session Completed
                    </div>
                  )}

                  {session.status === 'CANCELLED' && (
                    <div className="flex-1 bg-red-50 text-red-600 py-3 rounded-lg flex items-center justify-center gap-2 font-medium text-sm sm:text-base">
                      <XCircle className="w-5 h-5" />
                      Session Cancelled
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
