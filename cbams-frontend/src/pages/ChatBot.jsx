import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
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
  MessageSquare,
  ChevronRight,
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  Eye,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { translations as globalTranslations } from '../constants/languages';

const ChatbotTab = ({ currentLanguage = 'en' }) => {
  const markdownStyles = `
    .markdown-content h1, .markdown-content h2, .markdown-content h3 { font-weight: bold; margin-top: 0.8rem; margin-bottom: 0.4rem; color: #1f2937; }
    .markdown-content h1 { font-size: 1.1rem; }
    .markdown-content h2 { font-size: 1rem; }
    .markdown-content h3 { font-size: 0.95rem; }
    .markdown-content p { margin-bottom: 0.5rem; line-height: 1.5; }
    .markdown-content ul, .markdown-content ol { margin-left: 1.25rem; margin-bottom: 0.5rem; list-style-type: disc; }
    .markdown-content li { margin-bottom: 0.2rem; }
    .markdown-content strong { font-weight: 700; color: #111827; }
    .markdown-content hr { margin: 0.8rem 0; border: 0; border-top: 1px solid #e5e7eb; }
  `;

  const t = (key) => globalTranslations[currentLanguage]?.[key] || globalTranslations.en[key];

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: currentLanguage === 'hi' ? 
        'नमस्ते! मैं AI द्वारा संचालित आपका स्मार्ट कृषि सहायक हूं। मैं फसल की देखभाल, मौसम की जानकारी, बाजार की कीमतों और खेती की आधुनिक तकनीकों के बारे में आपकी मदद कर सकता हूं। आप मुझे फसल की तस्वीरें भी भेज सकते हैं विस्तृत AI विश्लेषण के लिए।' :
        currentLanguage === 'pa' ? 
        'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ AI ਦੁਆਰਾ ਸੰਚਾਲਿਤ ਤੁਹਾਡਾ ਸਮਾਰਟ ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਫਸਲਾਂ ਦੀ ਦੇਖਭਾਲ, ਮੌਸਮ ਦੀ ਜਾਣਕਾਰੀ, ਮਾਰਕੀਟ ਰੇਟਾਂ ਅਤੇ ਖੇਤੀ ਦੀਆਂ ਆਧੁਨਿਕ ਤਕਨੀਕਾਂ ਬਾਰੇ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਮੈਨੂੰ ਫਸਲ ਦੀਆਂ ਫੋਟੋਆਂ ਵੀ ਭੇਜ ਸਕਦੇ ਹੋ ਵਿਸਤ੍ਰਿਤ AI ਜਾਂਚ ਲਈ।' :
        'Hello! I\'m your Smart Agricultural Assistant powered by AI. I can help you with crop management, weather insights, market prices, and modern farming techniques. You can also send me crop images for detailed AI analysis and personalized recommendations.',
      timestamp: new Date(),
      avatar: '🤖'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const messagesEndRef = useRef(null);





  const handleImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = {
        url: e.target.result,
        name: file.name
      };
      handleSendMessage(imageData);
      setShowUploadModal(false);
    };
    reader.readAsDataURL(file);
  };

  const quickQuestions = [
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
  ];

  const getBotResponse = async (message, hasImage = false, imageData = null) => {
    try {
      if (hasImage && imageData) {
        return await geminiService.analyzeImage(imageData.url, message, currentLanguage);
      } else {
        const conversationContext = messages.slice(-6);
        return await geminiService.generateResponse(message, conversationContext, currentLanguage);
      }
    } catch (error) {
      console.error('AI Error:', error);
      return getFallbackResponse(message, currentLanguage);
    }
  };

  const getFallbackResponse = (message, language) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('weather') || lowerMessage.includes('मौसम') || lowerMessage.includes('ਮੌਸਮ')) {
      return language === 'hi' ? 'आज का मौसम: 28°C, धूप के साथ हल्के बादल।' : 'Today\'s weather: 28°C, sunny with light clouds.';
    }
    return language === 'hi' ? 'क्षमा करें, AI सेवा लोड नहीं हो सकी।' : 'Sorry, AI service could not be loaded.';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (imageData = null) => {
    if (!inputMessage.trim() && !imageData) return;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: inputMessage || 'Analyze this image',
      timestamp: new Date(),
      avatar: '👨‍🌾',
      image: imageData
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);
    if (imageData) setAnalyzingImage(true);

    try {
      const response = await getBotResponse(currentInput, !!imageData, imageData);
      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date(),
        avatar: '🤖',
        isAI: true
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Error: Could not get AI response.',
        timestamp: new Date(),
        avatar: '🤖',
        isError: true
      }]);
    } finally {
      setIsTyping(false);
      setAnalyzingImage(false);
    }
  };

  const handleQuickQuestion = (question) => setInputMessage(question);
  const formatTimestamp = (ts) => ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col font-sans">
      <style>{markdownStyles}</style>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">{t('title')}</h2>
            <p className="text-gray-500 text-sm">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-gray-700">Live AI Assistant</span>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} gap-4`}
              >
                {message.type === 'bot' && (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                    message.isError ? 'bg-red-500' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  }`}>
                    <span className="text-lg">{message.avatar}</span>
                  </div>
                )}
                <div className={`max-w-[80%] px-5 py-4 rounded-2xl shadow-sm ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-tr-none' 
                    : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100'
                }`}>
                  {message.image && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
                      <img src={message.image.url} alt="Crop" className="w-full max-h-60 object-cover" />
                    </div>
                  )}
                  <div className="text-sm leading-relaxed font-medium markdown-content">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  <div className="flex items-center justify-between mt-3 opacity-60 text-[10px]">
                    <span>{formatTimestamp(message.timestamp)}</span>
                    {message.isAI && <span className="flex items-center gap-1 font-bold uppercase tracking-widest"><Bot className="w-3 h-3" /> AI Engine</span>}
                  </div>
                </div>
                {message.type === 'user' && (
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 border border-green-200">
                    <span className="text-lg">{message.avatar}</span>
                  </div>
                )}
              </motion.div>
            ))}
            {(isTyping || analyzingImage) && (
              <div className="flex justify-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                  <Bot className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div className="bg-gray-50 px-6 py-4 rounded-2xl rounded-tl-none border border-gray-100 flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="text-sm font-medium text-gray-600">{analyzingImage ? t('analyzing') : t('thinking')}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowUploadModal(true)}
                className="p-4 bg-white hover:bg-blue-50 text-blue-600 rounded-2xl transition-all shadow-sm border border-gray-200"
              >
                <Camera className="w-6 h-6" />
              </button>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t('placeholder')}
                className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none shadow-sm font-medium"
              />
              <button 
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className="p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto pr-2">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-50">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" /> {t('quickQuestions')}
            </h3>
            <div className="space-y-2">
              {quickQuestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(item.question)}
                  className="w-full p-4 text-left hover:bg-green-50 rounded-xl border border-gray-100 hover:border-green-200 transition-all group flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-green-100 group-hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors">
                    <item.icon className="w-4 h-4 text-green-600 group-hover:text-white" />
                  </div>
                  <span className="text-xs font-bold text-gray-700">{item.question}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-8 h-8" />
              <h3 className="font-bold">AI Power Tools</h3>
            </div>
            <p className="text-xs text-blue-100 mb-4 leading-relaxed">Unlock the full potential of smart farming with our Gemini-powered vision and analysis engine.</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/10 p-3 rounded-xl text-center">
                <div className="text-lg font-bold">98%</div>
                <div className="text-[8px] uppercase tracking-tighter opacity-70 text-nowrap">Accuracy</div>
              </div>
              <div className="bg-white/10 p-3 rounded-xl text-center">
                <div className="text-lg font-bold">3s</div>
                <div className="text-[8px] uppercase tracking-tighter opacity-70 text-nowrap">Response</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3"><Camera className="text-blue-600" /> {t('uploadImage')}</h3>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
            </div>
            <div 
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer mb-6"
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])} />
              <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">{t('dragDrop')}</p>
            </div>
            <button onClick={() => cameraInputRef.current.click()} className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-green-700 transition-all shadow-lg">
              <Camera /> {t('takePhoto')}
              <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])} />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ChatbotTab;