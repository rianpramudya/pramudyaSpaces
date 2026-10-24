import 'server-only';
import { requestGemini, type AIContent } from './gemini-client';
import { requestGroq } from './groq-client';
export async function generateChatAI(system: string, contents: AIContent[]) {
  return requestGroq({
    key: process.env.GROQ_API_KEY || '',
    model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
    system, contents,
  });
}
export async function generateAI(system: string, contents: AIContent[], json = false) {
  return requestGemini({
    key: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    system, contents, json,
  });
}
