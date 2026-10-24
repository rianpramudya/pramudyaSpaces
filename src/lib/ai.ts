import 'server-only';
import { requestGemini, type AIContent } from './gemini-client';
export async function generateAI(system: string, contents: AIContent[], json = false) {
  return requestGemini({
    key: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    system, contents, json,
  });
}
