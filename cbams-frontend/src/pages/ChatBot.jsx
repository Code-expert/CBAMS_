import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot,
  Cloud,
  DollarSign,
  AlertTriangle,
  Droplets,
  Sprout,
  TrendingUp,
  Target,
  BarChart3,
  Phone,
  Settings,
  Search,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { translations } from '../constants/languages';

const ChatbotTab = ({ currentLanguage }) => {
  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: currentLanguage === 'hi' ? 'नमस्ते! मैं आपका कृषि सहायक हूं। मैं फसल, मौसम, बाजार की कीमतों और खेती की तकनीकों के बारे में आपकी मदद कर सकता हूं।' :
               currentLanguage === 'pa' ? 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਫਸਲਾਂ, ਮੌਸਮ, ਮਾਰਕੀਟ ਰੇਟਾਂ ਅਤੇ ਖੇਤੀ ਦੀਆਂ ਤਕਨੀਕਾਂ ਬਾਰੇ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।' :
               'Hello! I\'m your Agricultural Assistant. I can help you with crops, weather, market prices, and farming techniques.',
      timestamp: new Date(),
      avatar: '🤖'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickQuestions] = useState([
    { 
      question: currentLanguage === 'hi' ? 'आज का मौसम कैसा है?' : 
                currentLanguage === 'pa' ? 'ਅੱਜ ਮੌਸਮ ਕਿਹੋ ਜਿਹਾ ਹੈ?' : 
                'What\'s the weather today?',
      icon: Cloud 
    },
    { 
      question: currentLanguage === 'hi' ? 'गेहूं की कीमत क्या है?' : 
                currentLanguage === 'pa' ? 'ਕਣਕ ਦੀ ਰੇਟ ਕੀ ਹੈ?' : 
                'What\'s the wheat price?',
      icon: DollarSign 
    },
    { 
      question: currentLanguage === 'hi' ? 'फसल की बीमारी की पहचान करें' : 
                currentLanguage === 'pa' ? 'ਫਸਲ ਦੀ ਬਿਮਾਰੀ ਪਛਾਣੋ' : 
                'Identify crop disease',
      icon: AlertTriangle 
    },
    { 
      question: currentLanguage === 'hi' ? 'सिंचाई की सलाह दें' : 
                currentLanguage === 'pa' ? 'ਸਿੰਚਾਈ ਦੀ ਸਲਾਹ ਦਿਓ' : 
                'Irrigation advice',
      icon: Droplets 
    },
    { 
      question: currentLanguage === 'hi' ? 'खाद की जानकारी' : 
                currentLanguage === 'pa' ? 'ਖਾਦ ਦੀ ਜਾਣਕਾਰੀ' : 
                'Fertilizer information',
      icon: Sprout 
    },
    { 
      question: currentLanguage === 'hi' ? 'बाजार में कब बेचें?' : 
                currentLanguage === 'pa' ? 'ਮਾਰਕੀਟ ਵਿੱਚ ਕਦੋਂ ਵੇਚਣਾ ਹੈ?' : 
                'When to sell in market?',
      icon: TrendingUp 
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Weather responses
    if (lowerMessage.includes('weather') || lowerMessage.includes('मौसम') || lowerMessage.includes('ਮੌਸਮ')) {
      return currentLanguage === 'hi' ? 'आज का मौसम: 28°C, धूप के साथ हल्के बादल। आर्द्रता 65%। कल बारिश की संभावना है।' :
             currentLanguage === 'pa' ? 'ਅੱਜ ਦਾ ਮੌਸਮ: 28°C, ਧੁੱਪ ਨਾਲ ਹਲਕੇ ਬੱਦਲ। ਨਮੀ 65%। ਕੱਲ੍ਹ ਬਰਸਾਤ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।' :
             'Today\'s weather: 28°C, partly cloudy with sunshine. Humidity 65%. Rain expected tomorrow.';
    }
    
    // Price responses
    if (lowerMessage.includes('price') || lowerMessage.includes('wheat') || lowerMessage.includes('कीमत') || lowerMessage.includes('गेहूं') || lowerMessage.includes('ਰੇਟ') || lowerMessage.includes('ਕਣਕ')) {
      return currentLanguage === 'hi' ? 'आज के बाजार भाव:\n• गेहूं: ₹2,100/क्विंटल (+2.5%)\n• चावल: ₹3,200/क्विंटल (-1.2%)\n• टमाटर: ₹25/किलो (+5.8%)' :
             currentLanguage === 'pa' ? 'ਅੱਜ ਦੇ ਮਾਰਕੀਟ ਰੇਟ:\n• ਕਣਕ: ₹2,100/ਕੁਇੰਟਲ (+2.5%)\n• ਚੌਲ: ₹3,200/ਕੁਇੰਟਲ (-1.2%)\n• ਟਮਾਟਰ: ₹25/ਕਿਲੋ (+5.8%)' :
             'Today\'s market rates:\n• Wheat: ₹2,100/quintal (+2.5%)\n• Rice: ₹3,200/quintal (-1.2%)\n• Tomato: ₹25/kg (+5.8%)';
    }
    
    // Disease responses
    if (lowerMessage.includes('disease') || lowerMessage.includes('बीमारी') || lowerMessage.includes('ਬਿਮਾਰੀ')) {
      return currentLanguage === 'hi' ? 'कृपया अपनी फसल की तस्वीर अपलोड करें। मैं AI का उपयोग करके बीमारी की पहचान कर सकता हूं और उपचार सुझा सकता हूं।' :
             currentLanguage === 'pa' ? 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਫਸਲ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ। ਮੈਂ AI ਵਰਤ ਕੇ ਬਿਮਾਰੀ ਪਛਾਣ ਸਕਦਾ ਹਾਂ ਅਤੇ ਇਲਾਜ ਸੁਝਾ ਸਕਦਾ ਹਾਂ।' :
             'Please upload a photo of your crop. I can use AI to identify diseases and suggest treatments.';
    }
    
    // Irrigation responses
    if (lowerMessage.includes('irrigation') || lowerMessage.includes('water') || lowerMessage.includes('सिंचाई') || lowerMessage.includes('पानी') || lowerMessage.includes('ਸਿੰਚਾਈ') || lowerMessage.includes('ਪਾਣੀ')) {
      return currentLanguage === 'hi' ? 'आपकी मिट्टी की नमी 68% है। सुबह 6-8 बजे या शाम 4-6 बजे सिंचाई करें। ड्रिप सिस्टम से 40% पानी बचा सकते हैं।' :
             currentLanguage === 'pa' ? 'ਤੁਹਾਡੀ ਮਿੱਟੀ ਦੀ ਨਮੀ 68% ਹੈ। ਸਵੇਰੇ 6-8 ਵਜੇ ਜਾਂ ਸ਼ਾਮ 4-6 ਵਜੇ ਸਿੰਚਾਈ ਕਰੋ। ਡ੍ਰਿਪ ਸਿਸਟਮ ਨਾਲ 40% ਪਾਣੀ ਬਚਾ ਸਕਦੇ ਹੋ।' :
             'Your soil moisture is 68%. Irrigate between 6-8 AM or 4-6 PM. Drip irrigation can save 40% water.';
    }
    
    // Fertilizer responses
    if (lowerMessage.includes('fertilizer') || lowerMessage.includes('खाद') || lowerMessage.includes('ਖਾਦ')) {
      return currentLanguage === 'hi' ? 'आपकी मिट्टी में नाइट्रोजन कम है। यूरिया 50 किलो/एकड़ या जैविक खाद का प्रयोग करें। मिट्टी टेस्ट रिपोर्ट के लिए संपर्क करें।' :
             currentLanguage === 'pa' ? 'ਤੁਹਾਡੀ ਮਿੱਟੀ ਵਿੱਚ ਨਾਈਟ੍ਰੋਜਨ ਘੱਟ ਹੈ। ਯੂਰੀਆ 50 ਕਿਲੋ/ਏਕੜ ਜਾਂ ਜੈਵਿਕ ਖਾਦ ਵਰਤੋ। ਮਿੱਟੀ ਟੈਸਟ ਰਿਪੋਰਟ ਲਈ ਸੰਪਰਕ ਕਰੋ।' :
             'Your soil is low in nitrogen. Use urea 50kg/acre or organic fertilizer. Contact us for soil test report.';
    }
    
    // Market timing responses
    if (lowerMessage.includes('sell') || lowerMessage.includes('market') || lowerMessage.includes('बेच') || lowerMessage.includes('बाजार') || lowerMessage.includes('ਵੇਚ') || lowerMessage.includes('ਮਾਰਕੀਟ')) {
      return currentLanguage === 'hi' ? 'गेहूं की कीमत बढ़ रही है (+2.5%)। अगले 2 सप्ताह में और बढ़ने की संभावना। रबी सीजन के अंत में बेचना फायदेमंद होगा।' :
             currentLanguage === 'pa' ? 'ਕਣਕ ਦੀ ਰੇਟ ਵਧ ਰਹੀ ਹੈ (+2.5%)। ਅਗਲੇ 2 ਹਫਤਿਆਂ ਵਿੱਚ ਹੋਰ ਵਧਣ ਦੀ ਸੰਭਾਵਨਾ। ਰਬੀ ਸੀਜ਼ਨ ਦੇ ਅੰਤ ਵਿੱਚ ਵੇਚਣਾ ਫਾਇਦੇਮੰਦ ਹੋਵੇਗਾ।' :
             'Wheat prices are rising (+2.5%). Expected to increase further in next 2 weeks. Selling at end of Rabi season will be profitable.';
    }
    
    // Default response
    return currentLanguage === 'hi' ? 'मैं आपकी मदद करने के लिए यहाँ हूं। आप मुझसे फसल, मौसम, बाजार की कीमतें, सिंचाई, और खेती की तकनीकों के बारे में पूछ सकते हैं।' :
           currentLanguage === 'pa' ? 'ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਲਈ ਇੱਥੇ ਹਾਂ। ਤੁਸੀਂ ਮੈਨੂੰ ਫਸਲਾਂ, ਮੌਸਮ, ਮਾਰਕੀਟ ਰੇਟਾਂ, ਸਿੰਚਾਈ, ਅਤੇ ਖੇਤੀ ਦੀਆਂ ਤਕਨੀਕਾਂ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।' :
           'I\'m here to help you. You can ask me about crops, weather, market prices, irrigation, and farming techniques.';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      avatar: '👨‍🌾'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: getBotResponse(inputMessage),
        timestamp: new Date(),
        avatar: '🤖'
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

 const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {currentLanguage === 'hi' ? 'कृषि सहायक' : 
               currentLanguage === 'pa' ? 'ਖੇਤੀ ਸਹਾਇਕ' : 
               'AI Farm Assistant'}
            </h2>
            <p className="text-gray-600">
              {currentLanguage === 'hi' ? '24/7 स्मार्ट कृषि सहायता' : 
               currentLanguage === 'pa' ? '24/7 ਸਮਾਰਟ ਖੇਤੀ ਸਹਾਇਤਾ' : 
               '24/7 Smart Farming Support'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700">
            {currentLanguage === 'hi' ? 'ऑनलाइन' : 
             currentLanguage === 'pa' ? 'ਆਨਲਾਈਨ' : 
             'Online'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Chat Area */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-lg border border-green-100 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">
                    {currentLanguage === 'hi' ? 'कृषि AI असिस्टेंट' : 
                     currentLanguage === 'pa' ? 'ਖੇਤੀ AI ਅਸਿਸਟੈਂਟ' : 
                     'AgriBot Assistant'}
                  </h4>
                  <p className="text-xs text-green-600">
                    {currentLanguage === 'hi' ? 'हमेशा आपकी मदद के लिए तैयार' : 
                     currentLanguage === 'pa' ? 'ਹਮੇਸ਼ਾ ਤੁਹਾਡੀ ਮਦਦ ਲਈ ਤਿਆਰ' : 
                     'Always ready to help you'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-green-600" />
                </button>
                <button className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-green-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-96">
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">{message.avatar}</span>
                    </div>
                  )}
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <span className={`text-xs mt-1 block ${
                      message.type === 'user' ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">{message.avatar}</span>
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start gap-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">🤖</span>
                  </div>
                  <div className="bg-gray-100 px-4 py-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {currentLanguage === 'hi' ? 'टाइप कर रहा है...' : 
                         currentLanguage === 'pa' ? 'ਲਿਖ ਰਿਹਾ ਹੈ...' : 
                         'Typing...'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={
                    currentLanguage === 'hi' ? 'अपना सवाल यहाँ लिखें...' : 
                    currentLanguage === 'pa' ? 'ਆਪਣਾ ਸਵਾਲ ਇੱਥੇ ਲਿਖੋ...' : 
                    'Type your question here...'
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                </button>
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Questions Sidebar */}
        <div className="space-y-6">
          {/* Quick Questions */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              {currentLanguage === 'hi' ? 'त्वरित प्रश्न' : 
               currentLanguage === 'pa' ? 'ਤੁਰੰਤ ਸਵਾਲ' : 
               'Quick Questions'}
            </h3>
            <div className="space-y-3">
              {quickQuestions.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickQuestion(item.question)}
                    className="w-full p-3 text-left bg-gradient-to-r from-gray-50 to-green-50 hover:from-green-50 hover:to-emerald-50 rounded-lg border border-gray-200 hover:border-green-300 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item.question}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* AI Features */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              {currentLanguage === 'hi' ? 'AI सुविधाएं' : 
               currentLanguage === 'pa' ? 'AI ਸੁਵਿਧਾਵਾਂ' : 
               'AI Features'}
            </h3>
            <div className="space-y-3">
              {[
                {
                  icon: '📷',
                  title: currentLanguage === 'hi' ? 'फोटो स्कैन' : currentLanguage === 'pa' ? 'ਫੋਟੋ ਸਕੈਨ' : 'Photo Scan',
                  desc: currentLanguage === 'hi' ? 'बीमारी पहचानें' : currentLanguage === 'pa' ? 'ਬਿਮਾਰੀ ਪਛਾਣੋ' : 'Identify diseases'
                },
                {
                  icon: '🌡️',
                  title: currentLanguage === 'hi' ? 'मौसम AI' : currentLanguage === 'pa' ? 'ਮੌਸਮ AI' : 'Weather AI',
                  desc: currentLanguage === 'hi' ? 'स्मार्ट भविष्यवाणी' : currentLanguage === 'pa' ? 'ਸਮਾਰਟ ਭਵਿੱਖਬਾਣੀ' : 'Smart predictions'
                },
                {
                  icon: '📊',
                  title: currentLanguage === 'hi' ? 'बाजार AI' : currentLanguage === 'pa' ? 'ਮਾਰਕੀਟ AI' : 'Market AI',
                  desc: currentLanguage === 'hi' ? 'कीमत अनुमान' : currentLanguage === 'pa' ? 'ਰੇਟ ਅਨੁਮਾਨ' : 'Price forecasting'
                },
                {
                  icon: '🌱',
                  title: currentLanguage === 'hi' ? 'फसल सलाहकार' : currentLanguage === 'pa' ? 'ਫਸਲ ਸਲਾਹਕਾਰ' : 'Crop Advisor',
                  desc: currentLanguage === 'hi' ? 'व्यक्तिगत सुझाव' : currentLanguage === 'pa' ? 'ਨਿੱਜੀ ਸੁਝਾਅ' : 'Personal advice'
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">{feature.title}</div>
                    <div className="text-xs text-gray-600">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Statistics */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              {currentLanguage === 'hi' ? 'चैट आंकड़े' : 
               currentLanguage === 'pa' ? 'ਚੈਟ ਅੰਕੜੇ' : 
               'Chat Stats'}
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: currentLanguage === 'hi' ? 'आज के प्रश्न' : currentLanguage === 'pa' ? 'ਅੱਜ ਦੇ ਸਵਾਲ' : 'Questions Today',
                  value: '24',
                  color: 'text-green-600'
                },
                {
                  label: currentLanguage === 'hi' ? 'हल किए गए' : currentLanguage === 'pa' ? 'ਹੱਲ ਕੀਤੇ' : 'Resolved',
                  value: '22',
                  color: 'text-blue-600'
                },
                {
                  label: currentLanguage === 'hi' ? 'औसत समय' : currentLanguage === 'pa' ? 'ਔਸਤ ਸਮਾਂ' : 'Avg Response',
                  value: '30s',
                  color: 'text-purple-600'
                }
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                  <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotTab;