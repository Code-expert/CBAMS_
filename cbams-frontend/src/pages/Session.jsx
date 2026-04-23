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
  BadgeCheck,
  Zap,
  Share2,
  Copy,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import sessionService from '../services/sessionService';

// Expert Card Component
const ExpertCard = ({ expert, onBook, onChat }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-green-100 overflow-hidden mb-6 group"
  >
    {/* Header Section with Elegant Gradient */}
    <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
      
      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        {/* Avatar with Glow Effect */}
        <div className="relative">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-green-700 text-4xl font-black shadow-2xl border-4 border-white/30 transform group-hover:rotate-6 transition-transform duration-500">
            {expert.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-4 border-white rounded-full shadow-lg" />
        </div>

        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <h3 className="text-2xl font-black text-white tracking-tight">{expert.name}</h3>
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-green-300" />
              <span className="text-xs font-bold text-green-50 bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">Verified Expert</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-green-50/80">
            <div className="flex items-center gap-1.5 bg-black/10 px-3 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-white font-bold">{expert.profile?.rating || '4.9'}</span>
              <span className="text-xs">({expert.reviewCount || '120+'} reviews)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/10 px-3 py-1 rounded-lg">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold">{expert.profile?.experience || '12'}+ Years Exp</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Body Section */}
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
            "{expert.profile?.bio || 'Agricultural scientist specializing in sustainable soil health, crop rotation strategies, and organic pest control methods for regional climates.'}"
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <Mail className="w-4 h-4 text-green-600" />
              <span className="truncate">{expert.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span>Hindi, English, regional dialects</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-1.5 h-4 bg-green-500 rounded-full" />
              Core Specializations
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {(expert.profile?.specializations || ['Crop Science', 'Soil Nutrition', 'Pest Control']).map((spec, i) => (
                <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Consultation Fee</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-gray-900">₹299</span>
                <span className="text-gray-400 text-sm font-medium">/session</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onBook(expert)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-green-200 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                Book Session
              </button>
              <button
                onClick={() => onChat(expert)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-xl transition-all"
              >
                <MessageCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Upcoming Session Card Component
const UpcomingSessionCard = ({ session, onJoin }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Use the 6-digit room code directly from videoRoomId
  const sessionCode = session.videoRoomId || String(session.id).padStart(6, '0');

  const handleShare = () => {
    const shareText = `CBAMS Consultation Code: ${sessionCode}\nFarmer: ${session.farmer?.name}\nExpert: ${session.expert?.name}\nJoin Link: ${window.location.origin}/video-call/${sessionCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'CBAMS Consultation Code',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(sessionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl border-2 border-gray-100 p-6 mb-4 hover:border-green-200 transition-all shadow-sm hover:shadow-lg group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
            {session.expert?.name?.charAt(0) || 'E'}
          </div>
          <div>
            <h4 className="font-extrabold text-gray-900 leading-tight">{session.expert?.name || 'Dr. Expert'}</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Agricultural Expert</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
          session.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' : 
          session.status === 'COMPLETED' ? 'bg-blue-100 text-blue-600' :
          'bg-amber-100 text-amber-600'
        }`}>
          {session.status}
        </span>
      </div>

      {/* Interactive Code Area */}
      {session.status !== 'COMPLETED' && (
        <div className="mb-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-dashed border-gray-300 relative overflow-hidden">
          <div className="text-center relative z-10">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Room Access Code</p>
            <div className="text-4xl font-black text-gray-900 tracking-[0.25em] font-mono select-all">
              {sessionCode}
            </div>
            <div className="flex justify-center gap-2 mt-3">
              <button
                onClick={handleShare}
                className="px-3 py-1.5 bg-white text-gray-600 rounded-lg text-[10px] font-bold border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-1.5"
              >
                <MessageCircle className="w-3 h-3 text-green-500" />
                {copied ? 'COPIED!' : 'SHARE'}
              </button>
              {session.status === 'CONFIRMED' && (
                <button
                  onClick={() => navigate(`/video-call/${sessionCode}`)}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-[10px] font-bold shadow-md hover:bg-green-700 transition-all flex items-center gap-1.5"
                >
                  <Video className="w-3 h-3" />
                  JOIN NOW
                </button>
              )}
            </div>
          </div>
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <BadgeCheck className="w-12 h-12 text-green-600" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <Calendar className="w-4 h-4 text-green-500" />
          <span className="font-bold text-gray-700">
            {new Date(session.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          <Clock className="w-4 h-4 text-emerald-500" />
          <span className="font-bold text-gray-700">
            {new Date(session.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </motion.div>
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
  const [manualSessionCode, setManualSessionCode] = useState('');
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [sessionTab, setSessionTab] = useState('upcoming'); // 'upcoming' or 'history'
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
          : sessionsResponse || [];
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
      alert('Session requested! Please share the room code with the expert once confirmed.');
    } catch (err) {
      console.error('Error booking session:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to book session. Please try again.';
      setError(errorMsg);
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
    } catch (err) {
      console.error('Error confirming session:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center mb-20">
          <Loader2 className="w-16 h-16 animate-spin text-green-600 mx-auto mb-6" />
          <p className="text-gray-500 text-lg font-bold tracking-tight">Accessing Expert Network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-1 bg-green-500 rounded-full" />
              <p className="text-green-600 font-black text-xs uppercase tracking-[0.2em]">Live Guidance</p>
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">Expert Consultation</h1>
            <p className="text-gray-500 font-medium text-lg leading-relaxed">
              Connect directly with verified agricultural scientists and industry experts to resolve your farming challenges in real-time.
            </p>
          </div>
          
          {/* Quick Stats Overlay */}
          <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center px-4">
              <p className="text-2xl font-black text-gray-900">150+</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Experts</p>
            </div>
            <div className="w-px h-full bg-gray-100" />
            <div className="text-center px-4">
              <p className="text-2xl font-black text-green-600">4.9</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Avg. Rating</p>
            </div>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm"
          >
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold">System Notification</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <button onClick={fetchData} className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-xl font-bold text-xs transition-all">RETRY</button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column - Expert Discovery */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Available Specialists</h2>
              <div className="flex gap-4">
                <select className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer hover:border-green-300 transition-all">
                  <option>All Specializations</option>
                  <option>Soil Scientist</option>
                  <option>Entomologist</option>
                  <option>Pathologist</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
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
                <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
                  <Bot className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold">No specialists found for the current filter.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Active & Operations */}
          <div className="lg:col-span-4 space-y-8">
            {/* Quick Access Area */}
            <div className="bg-white rounded-3xl p-8 border-2 border-green-500/10 shadow-xl shadow-green-900/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg">Instant Join</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Connect with Code</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      maxLength="6"
                      placeholder="ENTER 6-DIGIT CODE"
                      value={manualSessionCode}
                      onChange={(e) => setManualSessionCode(e.target.value.toUpperCase())}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 font-mono text-2xl font-black text-center tracking-[0.2em] focus:ring-4 focus:ring-green-500/10 focus:border-green-500 focus:bg-white outline-none transition-all placeholder:text-gray-200 placeholder:tracking-normal placeholder:text-sm"
                    />
                  </div>
                  <button
                    onClick={handleJoinWithCode}
                    disabled={manualSessionCode.length !== 6}
                    className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-200 text-white rounded-2xl py-4 font-black tracking-widest text-xs transition-all shadow-xl shadow-gray-200 hover:-translate-y-1"
                  >
                    ENTER CONSULTATION ROOM
                  </button>
                </div>
              </div>
            </div>

            {/* Session Management */}
            {(isFarmer || isExpert) && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <h3 className="font-black text-gray-900 text-xl tracking-tight">
                      {isFarmer ? 'Your Schedule' : 'Management'}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {sessionTab === 'upcoming' ? 'Active Appointments' : 'Past Consultations'}
                    </p>
                  </div>
                  
                  {/* Tab Switcher */}
                  <div className="flex p-1 bg-gray-100 rounded-xl">
                    <button
                      onClick={() => setSessionTab('upcoming')}
                      className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                        sessionTab === 'upcoming' 
                        ? 'bg-white text-green-600 shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      UPCOMING
                    </button>
                    <button
                      onClick={() => setSessionTab('history')}
                      className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                        sessionTab === 'history' 
                        ? 'bg-white text-green-600 shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      HISTORY
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {sessions.filter(s => 
                    sessionTab === 'upcoming' 
                    ? (s.status === 'PENDING' || s.status === 'CONFIRMED')
                    : (s.status === 'COMPLETED' || s.status === 'CANCELLED')
                  ).length > 0 ? (
                    sessions
                      .filter(s => 
                        sessionTab === 'upcoming' 
                        ? (s.status === 'PENDING' || s.status === 'CONFIRMED')
                        : (s.status === 'COMPLETED' || s.status === 'CANCELLED')
                      )
                      .map((session) => (
                        isExpert ? (
                          <motion.div 
                            key={session.id} 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-blue-200 transition-all"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                  {session.farmer?.name?.charAt(0)}
                                </div>
                                <h4 className="font-extrabold text-sm text-gray-900">{session.farmer?.name}</h4>
                              </div>
                              <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                session.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' : 
                                session.status === 'COMPLETED' ? 'bg-blue-100 text-blue-600' : 
                                'bg-amber-100 text-amber-600'
                              }`}>
                                {session.status}
                              </div>
                            </div>

                            {session.status !== 'COMPLETED' && (
                              <div className="mb-4 bg-white rounded-xl p-3 text-center border border-gray-100">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Room Code</p>
                                <p className="text-xl font-black text-gray-900 font-mono tracking-widest">
                                  {session.videoRoomId || '------'}
                                </p>
                              </div>
                            )}

                            <div className="flex gap-2">
                              {session.status === 'PENDING' && (
                                <button
                                  onClick={() => handleConfirmSession(session.id)}
                                  className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-black text-xs hover:bg-green-700 transition-all shadow-md"
                                >
                                  CONFIRM
                                </button>
                              )}
                              {session.status === 'CONFIRMED' && (
                                <button
                                  onClick={() => navigate(`/video-call/${session.videoRoomId}`)}
                                  className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2"
                                >
                                  <Video className="w-3.5 h-3.5" />
                                  START CALL
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ) : (
                          <UpcomingSessionCard
                            key={session.id}
                            session={session}
                            onJoin={(s) => navigate(`/video-call/${s.videoRoomId}`)}
                          />
                        )
                      ))
                  ) : (
                    <div className="text-center py-10 opacity-40">
                      <Calendar className="w-10 h-10 mx-auto mb-3" />
                      <p className="text-xs font-bold uppercase tracking-widest">
                        {sessionTab === 'upcoming' ? 'No Active Sessions' : 'No Past Consultations'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal - Sophisticated Layer */}
      <AnimatePresence>
        {showBookModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-600" />
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">Reserve Time</h3>
                  <p className="text-gray-500 font-medium">Consultation with {selectedExpert?.name}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-green-600 fill-green-600" />
                </div>
              </div>

              <form onSubmit={handleSubmitBooking} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Selected Date</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      className="w-full bg-gray-50 border-2 border-gray-100 px-5 py-4 rounded-2xl font-bold focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Meeting Time</label>
                    <input
                      type="time"
                      required
                      value={bookingData.time}
                      onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                      className="w-full bg-gray-50 border-2 border-gray-100 px-5 py-4 rounded-2xl font-bold focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Topic / Concern</label>
                  <textarea
                    value={bookingData.description}
                    onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-gray-100 px-5 py-4 rounded-2xl font-bold focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all resize-none"
                    rows="4"
                    placeholder="Briefly describe what you'd like to discuss (e.g., 'Tomato leaf yellowing issues')"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookModal(false);
                      setSelectedExpert(null);
                      setBookingData({ expertId: '', date: '', time: '', mode: 'VIDEO', description: '' });
                    }}
                    className="w-full bg-white border-2 border-gray-200 text-gray-500 px-6 py-4 rounded-2xl font-black tracking-widest text-[10px] hover:bg-gray-50 transition-all"
                  >
                    DISCARD
                  </button>
                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white px-6 py-4 rounded-2xl font-black tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-gray-200"
                  >
                    CONFIRM & BOOK
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpertConsultationPage;
