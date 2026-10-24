import { api,readJson,rateLimit } from '@/lib/http';
import { chatSchema } from '@/lib/validation';
import { getPublicContent } from '@/lib/repository';
import { generateChatAI } from '@/lib/ai';
import { answerPublicChat } from '@/lib/portfolio-chat';
// Leave time for rate limiting, CMS reads and a controlled provider timeout response.
export const maxDuration = 90;
export async function POST(request:Request){return api(request,async()=>{
 const input=chatSchema.parse(await readJson(request));
 await rateLimit(request,'chat-session',20,86400,input.session);await rateLimit(request,'chat-visitor',40,86400);await rateLimit(request,'chat-global',100,86400,'site');
 return answerPublicChat(input,{readPublicContent:getPublicContent,generate:generateChatAI});
});}
