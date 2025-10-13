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
  ChevronRight,
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  Eye,
  Loader2,
  CheckCircle,
  Key
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

const ChatbotTab = ({ currentLanguage = 'en' }) => {
  const translations = {
    en: {
      title: 'AI Farm Assistant',
      subtitle: '24/7 Smart Farming Support',
      online: 'Online',
      placeholder: 'Type your question here...',
      quickQuestions: 'Quick Questions',
      aiFeatures: 'AI Features',
      chatStats: 'Chat Stats',
      uploadImage: 'Upload Image',
      takePhoto: 'Take Photo',
      dragDrop: 'Drag & drop images here or click to browse',
      analyzing: 'Analyzing image...',
      imageAnalysis: 'Image Analysis Complete',
      apiKeyPrompt: 'Please enter your Google AI API key:',
      apiKeyPlaceholder: 'Enter your API key...',
      saveKey: 'Save Key',
      apiKeyNote: 'Your API key is stored locally and never shared.',
      getApiKey: 'Get API Key',
      thinking: 'AI is thinking...'
    },
    hi: {
      title: 'कृषि सहायक',
      subtitle: '24/7 स्मार्ट कृषि सहायता',
      online: 'ऑनलाइन',
      placeholder: 'अपना सवाल यहाँ लिखें...',
      quickQuestions: 'त्वरित प्रश्न',
      aiFeatures: 'AI सुविधाएं',
      chatStats: 'चैट आंकड़े',
      uploadImage: 'तस्वीर अपलोड करें',
      takePhoto: 'फोटो लें',
      dragDrop: 'तस्वीरें यहाँ खींचें या ब्राउज़ करने के लिए क्लिक करें',
      analyzing: 'तस्वीर का विश्लेषण हो रहा है...',
      imageAnalysis: 'तस्वीर विश्लेषण पूरा',
      apiKeyPrompt: 'कृपया अपनी Google AI API key डालें:',
      apiKeyPlaceholder: 'API key यहाँ डालें...',
      saveKey: 'Key सेव करें',
      apiKeyNote: 'आपकी API key स्थानीय रूप से सुरक्षित है।',
      getApiKey: 'API Key प्राप्त करें',
      thinking: 'AI सोच रहा है...'
    },
    pa: {
      title: 'ਖੇਤੀ ਸਹਾਇਕ',
      subtitle: '24/7 ਸਮਾਰਟ ਖੇਤੀ ਸਹਾਇਤਾ',
      online: 'ਆਨਲਾਈਨ',
      placeholder: 'ਆਪਣਾ ਸਵਾਲ ਇੱਥੇ ਲਿਖੋ...',
      quickQuestions: 'ਤੁਰੰਤ ਸਵਾਲ',
      aiFeatures: 'AI ਸੁਵਿਧਾਵਾਂ',
      chatStats: 'ਚੈਟ ਅੰਕੜੇ',
      uploadImage: 'ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ',
      takePhoto: 'ਫੋਟੋ ਖਿੱਚੋ',
      dragDrop: 'ਫੋਟੋਆਂ ਇੱਥੇ ਖਿੱਚੋ ਜਾਂ ਬ੍ਰਾਊਜ਼ ਕਰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ',
      analyzing: 'ਫੋਟੋ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...',
      imageAnalysis: 'ਫੋਟੋ ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ',
      apiKeyPrompt: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ Google AI API key ਪਾਓ:',
      apiKeyPlaceholder: 'API key ਇੱਥੇ ਪਾਓ...',
      saveKey: 'Key ਸੇਵ ਕਰੋ',
      apiKeyNote: 'ਤੁਹਾਡੀ API key ਸੁਰੱਖਿਅਤ ਹੈ।',
      getApiKey: 'API Key ਲਓ',
      thinking: 'AI ਸੋਚ ਰਿਹਾ ਹੈ...'
    }
  };

  const t = (key) => translations[currentLanguage]?.[key] || translations.en[key];

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

  const getAISystemPrompt = () => {
    const basePrompt = `You are an expert Agricultural Assistant AI with deep knowledge of farming, agriculture, and rural practices in India. Your role is to provide helpful, accurate, and practical advice to farmers and agricultural enthusiasts.

Key responsibilities:
- Provide crop management advice
- Identify plant diseases and pests from images
- Suggest appropriate fertilizers and treatments
- Give weather-based farming recommendations  
- Provide market price insights and selling advice
- Recommend modern farming techniques and technology
- Support sustainable and organic farming practices
- Help with irrigation and water management
- Assist with soil health and testing

Guidelines:
- Always be supportive and encouraging to farmers
- Provide practical, actionable advice
- Consider local Indian farming conditions and practices
- Suggest cost-effective solutions
- Prioritize sustainable and eco-friendly methods
- Be sensitive to small-scale farmers' budget constraints
- Include both traditional wisdom and modern techniques
- Give specific measurements and timelines when possible

Language: Respond in ${currentLanguage === 'hi' ? 'Hindi' : currentLanguage === 'pa' ? 'Punjabi' : 'English'} language.
Tone: Friendly, knowledgeable, and supportive like a experienced local agricultural expert.`;

    return basePrompt;
  };

  const getBotResponse = async (message, hasImage = false, imageData = null) => {
    try {
      if (hasImage && imageData) {
        // Use Gemini Vision for image analysis
        const imageAnalysis = await geminiService.analyzeImage(
          imageData.url, 
          message || "Please analyze this crop image for diseases and provide treatment recommendations",
          currentLanguage
        );
        return imageAnalysis;
      } else {
        // Use Gemini Pro for text chat
        const conversationContext = messages.slice(-6); // Last 6 messages for context
        const response = await geminiService.generateResponse(message, conversationContext, currentLanguage);
        return response;
      }
    } catch (error) {
      console.error('AI Response Error:', error);
      
      // Fallback to static responses if AI fails
      return getFallbackResponse(message, currentLanguage);
    }
  };
  const getFallbackResponse = (message, language) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('मौसम') || lowerMessage.includes('ਮੌਸਮ')) {
      return language === 'hi' ? 'आज का मौसम: 28°C, धूप के साथ हल्के बादल। आर्द्रता 65%। कल बारिश की संभावना है।' :
             language === 'pa' ? 'ਅੱਜ ਦਾ ਮੌਸਮ: 28°C, ਧੁੱਪ ਨਾਲ ਹਲਕੇ ਬੱਦਲ। ਨਮੀ 65%। ਕੱਲ੍ਹ ਬਰਸਾਤ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।' :
             'Today\'s weather: 28°C, partly cloudy with sunshine. Humidity 65%. Rain expected tomorrow.';
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('wheat') || lowerMessage.includes('कीमत') || lowerMessage.includes('गेहूं') || lowerMessage.includes('ਰੇਟ') || lowerMessage.includes('ਕਣਕ')) {
      return language === 'hi' ? 'आज के बाजार भाव:\n• गेहूं: ₹2,100/क्विंटल (+2.5%)\n• चावल: ₹3,200/क्विंटल (-1.2%)\n• टमाटर: ₹25/किलो (+5.8%)' :
             language === 'pa' ? 'ਅੱਜ ਦੇ ਮਾਰਕੀਟ ਰੇਟ:\n• ਕਣਕ: ₹2,100/ਕੁਇੰਟਲ (+2.5%)\n• ਚੌਲ: ₹3,200/ਕੁਇੰਟਲ (-1.2%)\n• ਟਮਾਟਰ: ₹25/ਕਿਲੋ (+5.8%)' :
             'Today\'s market rates:\n• Wheat: ₹2,100/quintal (+2.5%)\n• Rice: ₹3,200/quintal (-1.2%)\n• Tomato: ₹25/kg (+5.8%)';
    }
    
    return language === 'hi' ? 
      'क्षमा करें, AI सेवा अस्थायी रूप से अनुपलब्ध है। कृपया बाद में प्रयास करें।' :
      language === 'pa' ? 
      'ਮਾਫ਼ ਕਰਨਾ, AI ਸੇਵਾ ਅਸਥਾਈ ਤੌਰ \'ਤੇ ਉਪਲਬਧ ਨਹੀਂ। ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਕੋਸ਼ਿਸ਼ ਕਰੋ।' :
      'Sorry, AI service is temporarily unavailable. Please try again later.';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (imageData = null) => {
    if (!inputMessage.trim() && !imageData) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage || (currentLanguage === 'hi' ? 'फसल की तस्वीर का विश्लेषण करें' : 
                               currentLanguage === 'pa' ? 'ਫਸਲ ਦੀ ਫੋਟੋ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ' : 
                               'Analyze crop image'),
      timestamp: new Date(),
      avatar: '👨‍🌾',
      image: imageData
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    if (imageData) {
      setAnalyzingImage(true);
    }

    try {
      // Get dynamic AI response using Gemini
      const response = await getBotResponse(currentInput, !!imageData, imageData);
      
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: response,
        timestamp: new Date(),
        avatar: '🤖',
        isAI: true // Flag to indicate AI-generated response
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Message handling error:', error);
      
      const errorResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: currentLanguage === 'hi' ? 
          'क्षमा करें, कुछ गलत हुआ है। कृपया दोबारा कोशिश करें।' :
          currentLanguage === 'pa' ? 
          'ਮਾਫ਼ ਕਰਨਾ, ਕੁਝ ਗਲਤ ਹੋਇਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।' :
          'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
        avatar: '🤖',
        isError: true
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
      setAnalyzingImage(false);
    }
  };


  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          file: file,
          url: e.target.result,
          name: file.name
        };
        setUploadedImages(prev => [...prev, imageData]);
        setShowUploadModal(false);
        handleSendMessage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

return (
  <div className="h-[calc(100vh-120px)] flex flex-col">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
          <Bot className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{t('title')}</h2>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-green-700">{t('online')}</span>
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
                  {currentLanguage === 'hi' ? 'AI-संचालित कृषि असिस्टेंट' : 
                   currentLanguage === 'pa' ? 'AI-ਸੰਚਾਲਿਤ ਖੇਤੀ ਅਸਿਸਟੈਂਟ' : 
                   'AI-powered Agriculture Assistant'}
                </h4>
                <p className="text-xs text-green-600">
                  {currentLanguage === 'hi' ? 'AI-संचालित कृषि सलाहकार' : 
                   currentLanguage === 'pa' ? 'AI-ਸੰਚਾਲਿਤ ਖੇਤੀ ਸਲਾਹਕਾਰ' : 
                   'AI-powered farming advisor'}
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
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isError ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-cyan-600'
                  }`}>
                    <span className="text-sm">{message.avatar}</span>
                  </div>
                )}
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                    : message.isError 
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {message.image && (
                    <div className="mb-3">
                      <img 
                        src={message.image.url} 
                        alt="Uploaded crop" 
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <p className="text-xs mt-1 opacity-75">{message.image.name}</p>
                    </div>
                  )}
                      <p className="text-sm whitespace-pre-line leading-relaxed">
                        {message.content} </p>                  
                    <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${
                      message.type === 'user' ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {formatTimestamp(message.timestamp)}
                    </span>
                    {message.isAI && (
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <Bot className="w-3 h-3" />
                        <span>AI</span>
                      </div>
                    )}
                  </div>
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">{message.avatar}</span>
                  </div>
                )}
              </motion.div>
            ))}
            
            {(isTyping || analyzingImage) && (
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
                    {analyzingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                        <span className="text-sm text-gray-600">{t('analyzing')}</span>
                      </>
                    ) : (
                      <>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-gray-600">{t('thinking')}</span>
                      </>
                    )}
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
                placeholder={t('placeholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowUploadModal(true)}
                className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                title={t('uploadImage')}
              >
                <Camera className="w-5 h-5" />
              </button>
              <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <MessageSquare className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Quick Questions, AI Features, Chat Stats */}
      <div className="space-y-6">
        {/* Quick Questions */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            {t('quickQuestions')}
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
            {t('aiFeatures')}
          </h3>
          <div className="space-y-3">
            {[
              {
                icon: '📷',
                title: currentLanguage === 'hi' ? 'इमेज विश्लेषण' : currentLanguage === 'pa' ? 'ਫੋਟੋ ਜਾਂਚ' : 'Image Analysis',
                desc: currentLanguage === 'hi' ? 'AI से फसल जांच' : currentLanguage === 'pa' ? 'AI ਨਾਲ ਫਸਲ ਜਾਂਚ' : 'AI crop inspection'
              },
              {
                icon: '🌡️',
                title: currentLanguage === 'hi' ? 'मौसम सलाहकार' : currentLanguage === 'pa' ? 'ਮੌਸਮ ਸਲਾਹਕਾਰ' : 'Weather Advisory',
                desc: currentLanguage === 'hi' ? 'स्मार्ट भविष्यवाणी' : currentLanguage === 'pa' ? 'ਸਮਾਰਟ ਪੂਰਵ-ਅਨੁਮਾਨ' : 'Smart predictions'
              },
              {
                icon: '📊',
                title: currentLanguage === 'hi' ? 'बाजार गाइड' : currentLanguage === 'pa' ? 'ਮਾਰਕੀਟ ਗਾਈਡ' : 'Market Guide',
                desc: currentLanguage === 'hi' ? 'कीमत रुझान' : currentLanguage === 'pa' ? 'ਰੇਟ ਰੁਝਾਨ' : 'Price trends'
              },
              {
                icon: '🌱',
                title: currentLanguage === 'hi' ? 'फसल डॉक्टर' : currentLanguage === 'pa' ? 'ਫਸਲ ਡਾਕਟਰ' : 'Crop Doctor',
                desc: currentLanguage === 'hi' ? 'रोग निदान' : currentLanguage === 'pa' ? 'ਬਿਮਾਰੀ ਪਛਾਣ' : 'Disease diagnosis'
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
            {t('chatStats')}
          </h3>
          <div className="space-y-3">
            {[
              {
                label: currentLanguage === 'hi' ? 'आज के प्रश्न' : currentLanguage === 'pa' ? 'ਅੱਜ ਦੇ ਸਵਾਲ' : 'Questions Today',
                value: messages.length - 1,
                color: 'text-green-600'
              },
              {
                label: currentLanguage === 'hi' ? 'AI सक्रिय' : currentLanguage === 'pa' ? 'AI ਸਰਗਰਮ' : 'AI Active',
                value: '✓',
                color: 'text-green-600'
              },
              {
                label: currentLanguage === 'hi' ? 'औसत समय' : currentLanguage === 'pa' ? 'ਔਸਤ ਸਮਾਂ' : 'Avg Response',
                value: '15s',
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

    {/* Image Upload Modal - Keep this as is */}
    {showUploadModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Camera className="w-6 h-6 text-blue-600" />
              {t('uploadImage')}
            </h3>
            <button
              onClick={() => setShowUploadModal(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Drag and Drop Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-1">
                    {t('dragDrop')}
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <ImageIcon className="w-5 h-5" />
                {currentLanguage === 'hi' ? 'गैलरी से चुनें' : currentLanguage === 'pa' ? 'ਗੈਲਰੀ ਤੋਂ ਚੁਣੋ' : 'From Gallery'}
              </button>
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Camera className="w-5 h-5" />
                {t('takePhoto')}
              </button>
            </div>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Recently uploaded images preview */}
            {uploadedImages.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  {currentLanguage === 'hi' ? 'हाल की तस्वीरें' : currentLanguage === 'pa' ? 'ਹਾਲ ਦੀਆਂ ਫੋਟੋਆਂ' : 'Recent Images'}
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {uploadedImages.slice(-3).map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-16 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center">
                        <button
                          onClick={() => removeImage(index)}
                          className="opacity-0 group-hover:opacity-100 p-1 bg-red-500 text-white rounded-full transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    )}
  </div>
)};
export default ChatbotTab;