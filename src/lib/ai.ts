import 'server-only';
import { HttpError } from './http';
export async function generateAI(system:string,contents:{role:string;parts:{text:string}[]}[],json=false) {
 const key=process.env.GEMINI_API_KEY; if(!key)throw new HttpError(503,'AI sementara tidak tersedia. Silakan gunakan form kontak.');
 const model=process.env.GEMINI_MODEL||'gemini-3.8-flash';
 if(!/^[a-zA-Z0-9._-]+$/.test(model))throw new HttpError(503,'Konfigurasi model AI tidak valid.');
 const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents,generationConfig:{temperature:0.1,maxOutputTokens:json?16384:1000,...(json?{responseMimeType:'application/json'}:{})}}),signal:AbortSignal.timeout(25000)});
 if(!response.ok)throw new HttpError(503,'Layanan AI tidak tersedia atau kuota tercapai. Silakan gunakan form kontak.');
 const data=await response.json();const result=data.candidates?.[0]?.content?.parts?.filter((p:{text?:string;thought?:boolean})=>p.text&&!p.thought).map((p:{text:string})=>p.text).join('');
 if(!result||data.candidates?.[0]?.finishReason==='MAX_TOKENS')throw new HttpError(503,'AI belum dapat menyelesaikan jawaban. Silakan gunakan form kontak.');
 return result as string;
}
