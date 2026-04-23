import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/chat', async (req, res) => {
  try {
    const { message, image, history, language } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let content = message;

    const systemInstructions = `You are the "CBAMS Senior Agricultural Expert". 
    Your goal is to provide DIRECT, AUTHORITATIVE, and HIGH-CONFIDENCE advice to farmers.
    - Style: No generic intros like "It depends on..." or "Choosing depends on...". Start immediately with the expert recommendation.
    - Tone: Professional, decisive, and actionable. 
    - Format: Use **Bold** for key crops/metrics and structured bullet points.
    - Structure: 1. **Immediate Recommendation**, 2. **Technical Reasoning**, 3. **Actionable Next Steps**.
    - Language: Respond strictly in the language requested (${language || 'en'}).
    - Data: Use the provided context to be as specific as possible to the user's region.`;

    // If image is present (base64)
    if (image) {
      const imageParts = [{
        inlineData: {
          data: image.split(',')[1] || image,
          mimeType: "image/jpeg"
        }
      }];

      const prompt = `${systemInstructions}\n\nTask: Analyze this crop image professionally. 
      Identify ANY diseases, pests, or nutrient deficiencies visible.
      For any issues detected, you MUST include:
      1. **Issue Name**: (e.g. Early Blight)
      2. **Technical Reason**: (Why it happened, e.g., high humidity)
      3. **Immediate Treatment**: (Direct steps to take)
      4. **Recommended Fertilizers/Chemicals**: (Specific brands or compositions)
      
      User question: ${message}`;
      const result = await model.generateContent([prompt, ...imageParts]);
      return res.json({ text: result.response.text() });
    }

    // Format history for the prompt
    let historyContext = "";
    if (Array.isArray(history)) {
      historyContext = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.parts?.[0]?.text || h.text}`).join('\n');
    }

    // Default text chat
    const context = `${systemInstructions}\n\nRecent History:\n${historyContext}\n\nUser Question: ${message}`;

    console.log(`🤖 Chat Prompt Language: ${language || 'en'}`);
    const result = await model.generateContent(context);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("Empty response from AI");

    res.json({ text });
  } catch (error) {
    console.error('❌ Chatbot Error:', error);
    res.status(500).json({
      error: "AI service failed. Please check backend logs or try again later.",
      details: error.message
    });
  }
});

export default router;
