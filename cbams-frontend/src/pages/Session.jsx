import React from 'react';
import { Calendar, Clock, Star, MessageCircle, Video, Phone, MessageSquare, Users, TrendingUp } from 'lucide-react';


const ExpertCard = ({ expert, price, rating, reviews, experience, specializations, languages, nextAvailable, isOnline = false }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-xl font-medium">{expert.split(' ').map(n => n[0]).join('')}</span>
          </div>
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{expert}</h3>
            {isOnline && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                Online
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4 mb-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-gray-900">{rating}</span>
              <span className="text-sm text-gray-500">({reviews} reviews)</span>
            </div>
            <span className="text-sm text-gray-500">{experience}</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3">
            Agricultural scientist specializing in sustainable farming practices and crop disease management.
          </p>
          
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-gray-700">Specializations:</span>
              <div className="flex flex-wrap gap-1">
                {specializations.map((spec, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{languages.join(', ')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Next available: {nextAvailable}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-right ml-4">
        <div className="mb-4">
          <span className="text-2xl font-bold text-gray-900">₹{price}</span>
          <span className="text-sm text-gray-500 block">per session</span>
        </div>
        
        <div className="space-y-2">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Book Session</span>
          </button>
          <button className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>Quick Chat</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const UpcomingSessionCard = ({ expert, topic, time, date, status, onJoin }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-medium text-gray-900">{expert}</h4>
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
        status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
      }`}>
        {status}
      </span>
    </div>
    <p className="text-sm text-gray-600 mb-2">{topic}</p>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Calendar className="w-4 h-4" />
        <span>{date}</span>
        <Clock className="w-4 h-4" />
        <span>{time}</span>
      </div>
      <button 
        onClick={onJoin}
        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1"
      >
        <Video className="w-4 h-4" />
        <span>Join Call</span>
      </button>
    </div>
  </div>
);

const SessionTypeCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-green-200 hover:bg-green-50 transition-all cursor-pointer">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-green-600" />
      </div>
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

const ExpertConsultationPage = () => {
  const experts = [
    {
      name: "Dr. Rajesh Kumar",
      price: "299",
      rating: "4.8",
      reviews: "156 reviews",
      experience: "15+ years",
      specializations: ["Crop Diseases", "Soil Management", "Pest Control"],
      languages: ["English", "Hindi"],
      nextAvailable: "Today 2:00 PM",
      isOnline: true
    },
    {
      name: "Priya Sharma",
      price: "249",
      rating: "4.7",
      reviews: "203 reviews",
      experience: "12+ years",
      specializations: ["Organic Farming", "Crop Rotation", "Water Management"],
      languages: ["English", "Hindi"],
      nextAvailable: "Tomorrow 10:00 AM",
      isOnline: false
    },
    {
      name: "Dr. Amit Patel",
      price: "399",
      rating: "4.9",
      reviews: "89 reviews",
      experience: "20+ years",
      specializations: ["Vegetable Farming", "Greenhouse Management", "Modern Techniques"],
      languages: ["English", "Hindi", "Gujarati"],
      nextAvailable: "Today 4:30 PM",
      isOnline: true
    }
  ];

  const upcomingSessions = [
    {
      expert: "Dr. Rajesh Kumar",
      topic: "Tomato Disease Control",
      date: "Today",
      time: "3:00 PM",
      status: "confirmed"
    },
    {
      expert: "Priya Sharma",
      topic: "Organic Fertilizer Planning",
      date: "Tomorrow",
      time: "10:00 AM",
      status: "pending"
    }
  ];

  const sessionTypes = [
    {
      icon: Video,
      title: "Video Call",
      description: "Face-to-face consultation"
    },
    {
      icon: Phone,
      title: "Voice Call",
      description: "Audio-only consultation"
    },
    {
      icon: MessageSquare,
      title: "Chat Support",
      description: "Text-based guidance"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
     
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Expert Consultation</h1>
            <p className="text-gray-600">Connect with agricultural experts for personalized advice</p>
          </div>

          <div className="flex gap-8">
            {/* Left Column - Expert List */}
            <div className="flex-1">
              {/* Filters */}
              <div className="flex space-x-4 mb-6">
                <select className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                  <option>All Languages</option>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Gujarati</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                  <option>All Specializations</option>
                  <option>Crop Diseases</option>
                  <option>Organic Farming</option>
                  <option>Soil Management</option>
                  <option>Pest Control</option>
                </select>
              </div>

              {/* Expert Cards */}
              {experts.map((expert, index) => (
                <ExpertCard
                  key={index}
                  expert={expert.name}
                  price={expert.price}
                  rating={expert.rating}
                  reviews={expert.reviews}
                  experience={expert.experience}
                  specializations={expert.specializations}
                  languages={expert.languages}
                  nextAvailable={expert.nextAvailable}
                  isOnline={expert.isOnline}
                />
              ))}
            </div>

            {/* Right Sidebar */}
            <div className="w-80 space-y-6">
              {/* Upcoming Sessions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-600" />
                  Upcoming Sessions
                </h3>
                <div className="space-y-3">
                  {upcomingSessions.map((session, index) => (
                    <UpcomingSessionCard
                      key={index}
                      expert={session.expert}
                      topic={session.topic}
                      date={session.date}
                      time={session.time}
                      status={session.status}
                      onJoin={() => console.log('Join session with', session.expert)}
                    />
                  ))}
                </div>
              </div>

              {/* Session Types */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Session Types</h3>
                <div className="space-y-3">
                  {sessionTypes.map((type, index) => (
                    <SessionTypeCard
                      key={index}
                      icon={type.icon}
                      title={type.title}
                      description={type.description}
                    />
                  ))}
                </div>
              </div>

              {/* Platform Stats */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Platform Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Experts</span>
                    <span className="font-semibold text-gray-900">150+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Successful Sessions</span>
                    <span className="font-semibold text-gray-900">12,000+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="font-semibold text-gray-900 flex items-center">
                      4.8 <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 ml-1" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-semibold text-gray-900">&lt; 2 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertConsultationPage;