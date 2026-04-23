import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';
config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log("AVAILABLE MODELS:");
    if (data.models) {
      data.models.forEach(m => console.log(`- ${m.name}`));
    } else {
      console.log(data);
    }
  } catch (err) {
    console.error(err);
  }
}
run();
