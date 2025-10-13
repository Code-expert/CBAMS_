// services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;



const genAI = new GoogleGenerativeAI(API_KEY);

// Function to clean up markdown formatting
const cleanMarkdownText = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')           // Remove **bold** markers
    .replace(/\*(.*?)\*/g, '$1')               // Remove *italic* markers  
    .replace(/#{1,6}\s*/g, '')                 // Remove header markers (# ## ###)
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')       // Remove code markers
    .replace(/\\\*/g, '*')                     // Fix escaped asterisks
    .replace(/\n\*/g, '\n•')                   // Convert * bullets to •
    .replace(/^\*/gm, '•')                     // Convert line-starting * to •
    .replace(/\s+\*/g, ' •')                   // Convert mid-line * to •
    .trim();
};

export const geminiService = {
  async generateResponse(prompt, conversationHistory = [], currentLanguage = 'en') {
    try {
      console.log('🤖 Calling Gemini API for text generation...');
      
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const languageInstruction = currentLanguage === 'hi' ? 
        'कृपया हिंदी में उत्तर दें। सादे पाठ में जवाब दें, कोई मार्कडाउन फॉर्मेटिंग का उपयोग न करें।' : 
        currentLanguage === 'pa' ? 
        'ਕਿਰਪਾ ਕਰਕੇ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ। ਸਾਦੇ ਟੈਕਸਟ ਵਿੱਚ ਜਵਾਬ ਦਿਓ, ਕੋਈ ਮਾਰਕਡਾਊਨ ਫਾਰਮੈਟਿੰਗ ਦੀ ਵਰਤੋਂ ਨਾ ਕਰੋ।' : 
        'Please respond in English. Use plain text format, avoid markdown formatting.';

      const context = `You are an expert Agricultural Assistant AI with deep knowledge of farming, agriculture, and rural practices in India. Your role is to provide helpful, accurate, and practical advice to farmers and agricultural enthusiasts.

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
- Use clear, simple formatting without markdown symbols

${languageInstruction}

Previous conversation:
${conversationHistory.slice(-4).map(msg => `${msg.type}: ${msg.content}`).join('\n')}

Current question: ${prompt}`;

      const result = await model.generateContent(context);
      const response = await result.response;
      let text = response.text();

      // Clean up markdown formatting
      text = cleanMarkdownText(text);
      
      console.log('✅ Gemini API Success');
      return text;
    } catch (error) {
      console.error('❌ Gemini API Error:', error);
      throw error;
    }
  },

  async analyzeImage(imageBase64, prompt = "Analyze this crop image", currentLanguage = 'en') {
    try {
      console.log('📸 Calling Gemini Vision API...');
      
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const imageParts = [
        {
          inlineData: {
            data: imageBase64.split(',')[1],
            mimeType: "image/jpeg"
          }
        }
      ];

      const languageInstruction = currentLanguage === 'hi' ? 
        'कृपया हिंदी में विस्तृत विश्लेषण प्रदान करें। सादे पाठ में जवाब दें।' : 
        currentLanguage === 'pa' ? 
        'ਕਿਰਪਾ ਕਰਕੇ ਪੰਜਾਬੀ ਵਿੱਚ ਵਿਸਤਾਰ ਨਾਲ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ। ਸਾਦੇ ਟੈਕਸਟ ਵਿੱਚ ਜਵਾਬ ਦਿਓ।' : 
        'Please provide detailed analysis in English. Use plain text format without markdown.';

      const analysisPrompt = `You are an expert agricultural pathologist. Analyze this crop image and provide a comprehensive assessment:

1. Crop Identification: What crop is this?
2. Health Assessment: Overall plant health (Excellent/Good/Fair/Poor)
3. Disease/Pest Detection: Any visible issues with confidence percentage
4. Nutritional Status: Signs of deficiencies
5. Treatment Recommendations: Specific actions with quantities
6. Prevention: How to prevent similar issues

Important: Format your response in plain text without using asterisks (*), hashtags (#), or other markdown symbols. Use simple bullet points with dashes (-) or numbers for lists.

${languageInstruction}

User question: ${prompt}`;

      const result = await model.generateContent([analysisPrompt, ...imageParts]);
      const response = await result.response;
      let text = response.text();

      // Clean up markdown formatting
      text = cleanMarkdownText(text);
      
      console.log('✅ Gemini Vision API Success');
      return text;
    } catch (error) {
      console.error('❌ Gemini Vision API Error:', error);
      throw error;
    }
  }
};
