import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Star, 
  MessageCircle, 
  Video, 
  Phone, 
  MessageSquare, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Mail
} from 'lucide-react';
import { useSelector } from 'react-redux';
import sessionService from '../services/sessionService';

const ExpertCard = ({ expert, onBook, onChat }) => (
  <div className="bg-white rounded-xl border-2 border-gray-100 p-6 mb-6 hover:border-green-200 hover:shadow-lg transition-all">
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-4 flex-1">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {expert.name?.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{expert.name}</h3>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
              Available Now
            </span>
          </div>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900">4.9</span>
              <span className="text-sm text-gray-600">(127+ reviews)</span>
            </div>
            <span className="text-sm text-gray-600 font-medium">15+ years exp</span>
          </div>
          
          <p className="text-gray-700 text-sm mb-4 leading-relaxed">
            Expert agricultural scientist specializing in sustainable farming practices, crop disease management, and modern irrigation techniques for Indian farmers.
          </p>
          
          <div className="space-y-3">
            <div>
              <span className="text-sm font-semibold text-gray-800 block mb-2">Specializations:</span>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium border border-blue-200">
                  Crop Diseases
                </span>
                <span className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs rounded-lg font-medium border border-purple-200">
                  Soil Management
                </span>
                <span className="px-3 py-1.5 bg-green-50 text-green-700 text-xs rounded-lg font-medium border border-green-200">
                  Pest Control
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-gray-700">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="truncate">{expert.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <MessageCircle className="w-4 h-4 text-gray-500" />
                <span>Hindi, English</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-right ml-6 flex-shrink-0">
        <div className="mb-6">
          <span className="text-3xl font-black text-gray-900">₹299</span>
          <span className="text-sm text-gray-600 block mt-1">per session</span>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={() => onBook(expert)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Book Session</span>
          </button>
          <button 
            onClick={() => onChat(expert)}
            className="w-full border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 text-gray-800 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Quick Chat</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const UpcomingSessionCard = ({ session, onJoin, onCancel }) => {
  const getStatusBadge = (status) => {
    const config = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
      CONFIRMED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Confirmed' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
      COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Completed' }
    };
    const statusConfig = config[status] || config.PENDING;
    return (
      <span className={`px-3 py-1 text-xs rounded-full font-bold ${statusConfig.bg} ${statusConfig.text}`}>
        {statusConfig.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-100 p-5 mb-4 hover:border-green-200 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-gray-900 text-lg">Dr. {session.expert?.name || session.farmer?.name}</h4>
        {getStatusBadge(session.status)}
      </div>
      <p className="text-sm text-gray-600 mb-4 font-medium">Agricultural Consultation</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-700">
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
            <Calendar className="w-4 h-4 text-green-600" />
            <span className="font-semibold">{new Date(session.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-semibold">{new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        {session.status === 'CONFIRMED' && session.videoRoomId && (
          <button 
            onClick={() => onJoin(session)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
          >
            <Video className="w-4 h-4" />
            <span>Join Call</span>
          </button>
        )}
        {session.status === 'PENDING' && onCancel && (
          <button 
            onClick={() => onCancel(session.id)}
            className="bg-red-50 border-2 border-red-200 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

const SessionTypeCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-xl border-2 border-gray-100 p-4 hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer group">
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center transition-colors">
        <Icon className="w-6 h-6 text-green-600" />
      </div>
      <div>
        <h4 className="font-bold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

const ExpertConsultationPage = () => {
  const { user } = useSelector((state) => state.auth);
  const isFarmer = user?.role === 'FARMER';
  const isExpert = user?.role === 'EXPERT';

  const [experts, setExperts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [bookingData, setBookingData] = useState({
    expertId: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const expertsResponse = await sessionService.getExperts();
      const expertsData = Array.isArray(expertsResponse) 
        ? expertsResponse 
        : (expertsResponse?.experts || []);
      setExperts(expertsData);
      
      const sessionsResponse = await sessionService.getFarmerSessions();
      const sessionsData = Array.isArray(sessionsResponse) 
        ? sessionsResponse 
        : (sessionsResponse?.sessions || []);
      setSessions(sessionsData);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
      setExperts([]);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = (expert) => {
    setSelectedExpert(expert);
    setBookingData({ ...bookingData, expertId: expert.id });
    setShowBookModal(true);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    try {
      const dateTime = new Date(`${bookingData.date}T${bookingData.time}`);
      await sessionService.bookSession({
        expertId: bookingData.expertId,
        date: dateTime.toISOString()
      });
      setShowBookModal(false);
      setBookingData({ expertId: '', date: '', time: '' });
      fetchData();
      alert('Session booked successfully!');
    } catch (err) {
      console.error('Error booking session:', err);
      alert('Failed to book session');
    }
  };

  const handleCancelSession = async (sessionId) => {
    if (!window.confirm('Cancel this session?')) return;
    try {
      await sessionService.updateSessionStatus(sessionId, 'CANCELLED');
      fetchData();
    } catch (err) {
      console.error('Error cancelling session:', err);
    }
  };

  const handleConfirmSession = async (sessionId) => {
    try {
      await sessionService.confirmSession(sessionId);
      fetchData();
    } catch (err) {
      console.error('Error confirming session:', err);
    }
  };

  const sessionTypes = [
    { icon: Video, title: "Video Call", description: "Face-to-face consultation" },
    { icon: Phone, title: "Voice Call", description: "Audio-only consultation" },
    { icon: MessageSquare, title: "Chat Support", description: "Text-based guidance" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Loading consultations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-3">Expert Consultation</h1>
          <p className="text-lg text-gray-600">Connect with agricultural experts for personalized advice</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="flex gap-8">
          {/* Left Column - Expert List */}
          <div className="flex-1">
            {/* Filters */}
            <div className="flex space-x-4 mb-6">
              <select className="px-5 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <option>All Languages</option>
                <option>English</option>
                <option>Hindi</option>
                <option>Gujarati</option>
              </select>
              <select className="px-5 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <option>All Specializations</option>
                <option>Crop Diseases</option>
                <option>Organic Farming</option>
                <option>Soil Management</option>
              </select>
            </div>

            {/* Expert Cards */}
            {experts.length > 0 ? (
              experts.map((expert) => (
                <ExpertCard
                  key={expert.id}
                  expert={expert}
                  onBook={handleBookSession}
                  onChat={(exp) => console.log('Chat with', exp.name)}
                />
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-gray-100">
                <p className="text-gray-500 text-lg">No experts available</p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-96 space-y-6">
            {/* Upcoming Sessions */}
            {isFarmer && (
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
                <h3 className="font-black text-gray-900 mb-5 flex items-center text-xl">
                  <Calendar className="w-6 h-6 mr-3 text-green-600" />
                  Upcoming Sessions
                </h3>
                {sessions.length > 0 ? (
                  sessions.map((session) => (
                    <UpcomingSessionCard
                      key={session.id}
                      session={session}
                      onJoin={(s) => window.open(`/webrtc-test.html?room=${s.videoRoomId}`, '_blank')}
                      onCancel={handleCancelSession}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No upcoming sessions</p>
                )}
              </div>
            )}

            {/* Expert View - Requests */}
            {isExpert && (
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
                <h3 className="font-black text-gray-900 mb-5 flex items-center text-xl">
                  <Calendar className="w-6 h-6 mr-3 text-green-600" />
                  Consultation Requests
                </h3>
                {sessions.map((session) => (
                  <div key={session.id} className="bg-white rounded-xl border-2 border-gray-100 p-5 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900">{session.farmer?.name}</h4>
                      <span className={`px-3 py-1 text-xs rounded-full font-bold ${
                        session.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {session.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleConfirmSession(session.id)}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold"
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={() => handleCancelSession(session.id)}
                            className="flex-1 bg-red-50 border-2 border-red-200 text-red-600 py-2 rounded-lg font-bold"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {session.status === 'CONFIRMED' && session.videoRoomId && (
                        <button 
                          onClick={() => window.open(`/webrtc-test.html?room=${session.videoRoomId}`, '_blank')}
                          className="w-full bg-green-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2"
                        >
                          <Video className="w-4 h-4" />
                          Start Call
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Session Types */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
              <h3 className="font-black text-gray-900 mb-5 text-xl">Session Types</h3>
              <div className="space-y-3">
                {sessionTypes.map((type, index) => (
                  <SessionTypeCard key={index} {...type} />
                ))}
              </div>
            </div>

            {/* Platform Stats */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
              <h3 className="font-black mb-5 flex items-center text-xl">
                <TrendingUp className="w-6 h-6 mr-3" />
                Platform Stats
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Active Experts', value: '150+' },
                  { label: 'Successful Sessions', value: '12,000+' },
                  { label: 'Average Rating', value: '4.8 ⭐' },
                  { label: 'Response Time', value: '< 2 min' }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <span className="font-medium">{stat.label}</span>
                    <span className="font-black text-lg">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-3xl font-black text-gray-900 mb-2">Book Consultation</h3>
            <p className="text-gray-600 mb-6">with {selectedExpert?.name}</p>
            <form onSubmit={handleSubmitBooking} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Time *</label>
                <input
                  type="time"
                  required
                  value={bookingData.time}
                  onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBookModal(false);
                    setSelectedExpert(null);
                    setBookingData({ expertId: '', date: '', time: '' });
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg font-bold"
                >
                  Book Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertConsultationPage;
