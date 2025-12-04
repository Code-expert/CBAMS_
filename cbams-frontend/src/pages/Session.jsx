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
  Loader2,
  AlertCircle,
  Mail,
  BadgeCheck
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import sessionService from '../services/sessionService';

// Expert Card Component
const ExpertCard = ({ expert, onBook, onChat }) => (
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden mb-6">
    {/* Header Section with Gradient */}
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-green-600 text-3xl font-bold shadow-lg">
            {expert.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="text-white">
            <h3 className="text-2xl font-bold">{expert.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <BadgeCheck className="w-4 h-4" />
              <span className="text-green-100 text-sm bg-white/20 px-2 py-0.5 rounded">Available Now</span>
            </div>
          </div>
        </div>
        {/* Rating */}
        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
          <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
          <span className="text-white font-bold">{expert.profile?.rating || '4.9'}</span>
          <span className="text-green-100 text-sm">({expert.reviewCount || '127+'} reviews)</span>
        </div>
      </div>
    </div>

    {/* Body Section */}
    <div className="p-6">
      {/* Description */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        {expert.profile?.bio || 'Expert agricultural scientist specializing in sustainable farming practices, crop disease management, and modern irrigation techniques for Indian farmers.'}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span>{expert.profile?.experience || '15'}+ years exp</span>
        </div>
      </div>

      {/* Specializations */}
      {expert.profile?.specializations && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Specializations:</p>
          <div className="flex flex-wrap gap-2">
            {expert.profile.specializations.map((spec, i) => (
              <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {spec}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact Info */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-5">
        {expert.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{expert.email}</span>
          </div>
        )}
        {expert.profile?.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>Hindi, English</span>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-3xl font-bold text-gray-900">₹299</span>
          <span className="text-gray-500 text-sm ml-2">per session</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onBook(expert)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3.5 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Book Session
        </button>
        <button
          onClick={() => onChat(expert)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Quick Chat
        </button>
      </div>
    </div>
  </div>
);

// Upcoming Session Card Component
const UpcomingSessionCard = ({ session, onJoin }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Get 6-digit session code
  const sessionCode = session.videoRoomId?.substring(0, 6) || String(session.id).padStart(6, '0').substring(0, 6);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Consultation Code',
        text: `Your consultation code is: ${sessionCode}`
      });
    } else {
      navigator.clipboard.writeText(sessionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-gray-900 text-lg">{session.expert?.name || 'Dr. Expert'}</h4>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${session.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
          {session.status === 'CONFIRMED' ? 'Confirmed' : 'Pending'}
        </span>
      </div>

      {/* Consultation Code - Large and Prominent */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
        <div className="text-center">
          <p className="text-xs text-gray-600 font-semibold mb-2">Consultation Code</p>
          <div className="text-5xl font-black text-blue-700 tracking-widest font-mono mb-2">
            {sessionCode}
          </div>
          <button
            onClick={handleShare}
            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <MessageCircle className="w-4 h-4" />
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Share this code with {session.expert?.name || 'the expert'}
        </p>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4">Agricultural Consultation</p>

      {/* Date, Time & Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
            <Calendar className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-gray-700">
              {new Date(session.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="font-semibold text-gray-700">
              {new Date(session.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {session.status === 'CONFIRMED' && (
          <button
            onClick={() => navigate(`/video-call/${session.videoRoomId}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            Join Call
          </button>
        )}
      </div>
    </div>
  );
};

// Main Component
const ExpertConsultationPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const isFarmer = user?.role === 'FARMER';
  const isExpert = user?.role === 'EXPERT';

  const [experts, setExperts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [manualSessionCode, setManualSessionCode] = useState('');
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [bookingData, setBookingData] = useState({
    expertId: '',
    date: '',
    time: '',
    mode: 'VIDEO',
    description: ''
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

      if (isFarmer) {
        const sessionsResponse = await sessionService.getFarmerSessions();
        const sessionsData = Array.isArray(sessionsResponse)
          ? sessionsResponse
          : (sessionsResponse?.sessions || []);
        setSessions(sessionsData);
      } else if (isExpert) {
        const sessionsResponse = await sessionService.getExpertSessions();
        const sessionsData = Array.isArray(sessionsResponse)
          ? sessionsResponse
          : (sessionsResponse?.sessions || []);
        setSessions(sessionsData);
      }

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
        date: dateTime.toISOString(),
        time: bookingData.time,
        mode: bookingData.mode,
        description: bookingData.description
      });
      setShowBookModal(false);
      setBookingData({ expertId: '', date: '', time: '', mode: 'VIDEO', description: '' });
      fetchData();
      alert('Session booked successfully! Check your consultation code.');
    } catch (err) {
      console.error('Error booking session:', err);
      alert('Failed to book session');
    }
  };

  const handleJoinWithCode = () => {
    if (manualSessionCode.length === 6) {
      navigate(`/video-call/${manualSessionCode}`);
    } else {
      alert('Please enter a valid 6-digit session code');
    }
  };

  const handleConfirmSession = async (sessionId) => {
    try {
      await sessionService.confirmSession(sessionId);
      fetchData();
      alert('Session confirmed!');
    } catch (err) {
      console.error('Error confirming session:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Loading consultations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Expert Consultation</h1>
          <p className="text-lg text-gray-600">Connect with agricultural experts for personalized advice</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="flex gap-8">
          {/* Left Column - Expert List */}
          <div className="flex-1">
            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <select className="px-5 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>All Languages</option>
                <option>English</option>
                <option>Hindi</option>
                <option>Gujarati</option>
              </select>
              <select className="px-5 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-green-500">
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
            {/* Manual Join Button */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-black text-xl mb-3 flex items-center">
                <Video className="w-6 h-6 mr-3" />
                Join with Code
              </h3>
              <p className="text-blue-100 text-sm mb-4">Have a session code? Enter it to join directly</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength="6"
                  placeholder="Enter 6-digit code"
                  value={manualSessionCode}
                  onChange={(e) => setManualSessionCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 font-mono text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  onClick={handleJoinWithCode}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all"
                >
                  Join
                </button>
              </div>
            </div>

            {/* Upcoming Sessions - Only show PENDING and CONFIRMED */}
            {(isFarmer || isExpert) && (
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm">
                <h3 className="font-black text-gray-900 mb-5 flex items-center text-xl">
                  <Calendar className="w-6 h-6 mr-3 text-green-600" />
                  {isFarmer ? 'Upcoming Sessions' : 'Session Requests'}
                </h3>
                {/* ✅ FILTER: Only show PENDING and CONFIRMED sessions */}
                {sessions.filter(s => s.status === 'PENDING' || s.status === 'CONFIRMED').length > 0 ? (
                  sessions
                    .filter(s => s.status === 'PENDING' || s.status === 'CONFIRMED')
                    .map((session) => (
                      isExpert ? (
                        <div key={session.id} className="bg-gray-50 rounded-xl p-4 mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-gray-900">{session.farmer?.name}</h4>
                            <span className={`px-3 py-1 text-xs rounded-full font-bold ${session.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                              }`}>
                              {session.status}
                            </span>
                          </div>

                          <div className="mb-3 p-3 bg-blue-50 rounded-lg text-center">
                            <p className="text-xs text-gray-600 font-semibold mb-1">Session Code</p>
                            <p className="text-2xl font-black text-blue-700 tracking-wider font-mono">
                              {session.videoRoomId?.substring(0, 6) || '000000'}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            {session.status === 'PENDING' && (
                              <button
                                onClick={() => handleConfirmSession(session.id)}
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold text-sm"
                              >
                                Confirm
                              </button>
                            )}
                            {session.status === 'CONFIRMED' && session.videoRoomId && (
                              <button
                                onClick={() => navigate(`/video-call/${session.videoRoomId}`)}
                                className="w-full bg-green-600 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
                              >
                                <Video className="w-4 h-4" />
                                Start Call
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <UpcomingSessionCard
                          key={session.id}
                          session={session}
                          onJoin={(s) => navigate(`/video-call/${s.videoRoomId}`)}
                        />
                      )
                    ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No upcoming sessions</p>
                )}
              </div>
            )}

            {/* Platform Stats */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
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
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Query (Optional)</label>
                <textarea
                  value={bookingData.description}
                  onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                  placeholder="Describe your agricultural concern..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBookModal(false);
                    setSelectedExpert(null);
                    setBookingData({ expertId: '', date: '', time: '', mode: 'VIDEO', description: '' });
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
