import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

// We provide a fallback string to prevent the app from crashing on startup due to ESM import hoisting.
// If the key is truly missing, the actual API calls (generateQuestion etc.) will fail securely.
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export default openai;
