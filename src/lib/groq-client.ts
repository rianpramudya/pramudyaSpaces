import { z } from 'zod';
import { HttpError } from './http-error';
import type { AIContent } from './gemini-client';

const outputSchema = z.object({ choices: z.array(z.object({
  finish_reason: z.string(),
  message: z.object({ content: z.string().nullable() }),
})) });

/** Credentials are supplied by the server-only ai.ts module. Never expose provider bodies. */
export async function requestGroq({ key, model, system, contents }: {
  key: string; model: string; system: string; contents: AIContent[];
}): Promise<string> {
  if (!key) throw new HttpError(503, 'Chatbot belum dikonfigurasi. Pemilik perlu mengisi GROQ_API_KEY pada server.');
  if (!/^[a-zA-Z0-9._-]+(?:\/[a-zA-Z0-9._-]+)?$/.test(model) || model.length > 128) throw new HttpError(503, 'Konfigurasi model Groq tidak valid.');
  if (contents.some(turn => turn.role !== 'user' && turn.role !== 'model')) throw new HttpError(400, 'Riwayat percakapan tidak valid.');
  const startedAt = Date.now();
  let phase = 'response-headers';
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          ...contents.map(turn => ({ role: turn.role === 'model' ? 'assistant' : 'user', content: turn.parts.map(part => part.text).join('\n') })),
        ],
        max_completion_tokens: 2048,
        stream: false,
        include_reasoning: false,
        ...(/^openai\/gpt-oss-(20b|120b)$/.test(model) ? { reasoning_effort: 'low' } : {}),
      }),
      signal: AbortSignal.timeout(60000),
      cache: 'no-store',
    });
    phase = 'response-body';
    if (!response.ok) {
      console.warn('Groq request rejected', { model, status: response.status, elapsedMs: Date.now() - startedAt });
      await response.body?.cancel();
      if (response.status === 429) throw new HttpError(429, 'Batas penggunaan atau kuota Groq tercapai. Silakan coba lagi nanti.');
      if (response.status === 401 || response.status === 403) throw new HttpError(503, 'Akses Groq ditolak. Pemilik perlu memeriksa API key dan izin model.');
      if (response.status === 400 || response.status === 404) throw new HttpError(503, 'Konfigurasi permintaan atau model Groq perlu diperiksa oleh pemilik.');
      throw new HttpError(503, 'Layanan Groq sedang tidak tersedia. Silakan coba lagi nanti.');
    }
    const parsed = outputSchema.safeParse(await response.json());
    if (!parsed.success) throw new HttpError(502, 'Format jawaban Groq tidak valid. Silakan coba lagi.');
    const candidate = parsed.data.choices[0];
    if (candidate?.finish_reason === 'length') throw new HttpError(502, 'Jawaban Groq terpotong. Coba pertanyaan yang lebih singkat.');
    const answer = candidate?.message.content?.trim();
    if (candidate?.finish_reason !== 'stop' || !answer) throw new HttpError(502, 'Groq tidak mengembalikan jawaban lengkap. Silakan coba lagi.');
    return answer;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    if (error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name)) {
      console.warn('Groq request timed out', { model, phase, elapsedMs: Date.now() - startedAt });
      throw new HttpError(504, 'Groq terlalu lama merespons. Silakan coba lagi atau gunakan form kontak.');
    }
    if (error instanceof SyntaxError) throw new HttpError(502, 'Format jawaban Groq tidak valid. Silakan coba lagi.');
    console.warn('Groq connection failed', { model, phase, elapsedMs: Date.now() - startedAt });
    throw new HttpError(503, 'Koneksi ke Groq gagal. Silakan coba lagi nanti.');
  }
}
