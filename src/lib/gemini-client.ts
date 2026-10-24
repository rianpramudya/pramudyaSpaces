import { z } from 'zod';
import { HttpError } from './http-error';
export type AIContent = { role: string; parts: { text: string }[] };
const outputSchema = z.object({
  candidates: z.array(z.object({
    finishReason: z.string().optional(),
    content: z.object({ parts: z.array(z.object({ text: z.string().optional(), thought: z.boolean().optional() })).optional() }).optional(),
  })).optional(),
});
const providerErrorSchema = z.object({ error: z.object({ details: z.array(z.object({ reason: z.string().optional() })).optional() }) });
const invalidKeyReasons = new Set(['API_KEY_INVALID', 'API_KEY_EXPIRED']);
const requestTimeoutMs = 60000;
function upstreamError(status: number, invalidKey = false): HttpError {
  if (invalidKey) return new HttpError(503, 'API key Gemini tidak valid atau kedaluwarsa. Pemilik perlu memeriksa konfigurasi AI.');
  if (status === 429) return new HttpError(429, 'Kuota Gemini untuk proyek atau model ini tercapai atau belum tersedia. Pemilik perlu memeriksa kuota di Google AI Studio.');
  if (status === 401) return new HttpError(503, 'API key Gemini tidak valid. Pemilik perlu memeriksa konfigurasi AI.');
  if (status === 403) return new HttpError(503, 'Akses Gemini ditolak. Pemilik perlu memeriksa izin API key dan akses model.');
  if (status === 402) return new HttpError(503, 'Layanan Gemini memerlukan pemeriksaan billing oleh pemilik.');
  if (status === 404) return new HttpError(503, 'Model Gemini yang dikonfigurasi tidak tersedia atau tidak dapat diakses.');
  if (status === 400) return new HttpError(503, 'Permintaan Gemini ditolak. Pemilik perlu memeriksa parameter dan konfigurasi model.');
  return new HttpError(503, 'Layanan Gemini sedang tidak tersedia. Coba lagi beberapa saat lagi.');
}

/** Environment-free transport for deterministic tests; credentials are supplied only by ai.ts on the server. */
export async function requestGemini({ key, model, system, contents, json = false }: {
  key: string; model: string; system: string; contents: AIContent[]; json?: boolean;
}): Promise<string> {
  if (!key) throw new HttpError(503, 'AI belum dikonfigurasi. Silakan gunakan form kontak.');
  if (!/^[a-zA-Z0-9._-]{1,128}$/.test(model)) throw new HttpError(503, 'Konfigurasi model AI tidak valid.');
  const startedAt = Date.now();
  let phase = 'response-headers';
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] }, contents,
        generationConfig: {
          maxOutputTokens: json ? 16384 : 4096,
          ...(/^gemini-3(?:[.-]|$)/.test(model) ? { thinkingConfig: { thinkingLevel: 'LOW' } } : {}),
          ...(json ? { responseMimeType: 'application/json' } : {}),
        },
      }),
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
    phase = 'response-body';
    if (!response.ok) {
      // Inspect only allowlisted reason codes; never log or return upstream bodies.
      const details = providerErrorSchema.safeParse(await response.json().catch(() => null));
      const invalidKey = details.success && Boolean(details.data.error.details?.some(detail => invalidKeyReasons.has(detail.reason || '')));
      console.warn('Gemini request rejected', { model, status: response.status, invalidKey });
      throw upstreamError(response.status, invalidKey);
    }
    const parsed = outputSchema.safeParse(await response.json());
    if (!parsed.success) throw new HttpError(502, 'Format jawaban Gemini tidak valid. Silakan coba lagi.');
    const candidate = parsed.data.candidates?.[0];
    if (candidate?.finishReason === 'MAX_TOKENS') throw new HttpError(502, 'Jawaban Gemini terpotong karena batas token. Coba pertanyaan yang lebih singkat.');
    if (candidate?.finishReason && candidate.finishReason !== 'STOP') throw new HttpError(502, 'Gemini tidak dapat menjawab pertanyaan ini. Coba pertanyaan lain tentang profil.');
    const result = candidate?.content?.parts?.filter(part => part.text && !part.thought).map(part => part.text).join('').trim();
    if (!result) throw new HttpError(502, 'Gemini tidak mengembalikan jawaban. Silakan coba lagi.');
    return result;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    if (error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name)) {
      console.warn('Gemini request timed out', { model, phase, elapsedMs: Date.now() - startedAt, timeoutMs: requestTimeoutMs });
      throw new HttpError(504, 'Gemini terlalu lama merespons. Silakan coba lagi atau gunakan form kontak.');
    }
    if (error instanceof SyntaxError) throw new HttpError(502, 'Format jawaban Gemini tidak valid. Silakan coba lagi.');
    console.warn('Gemini connection failed', { model });
    throw new HttpError(503, 'Koneksi ke Gemini gagal. Silakan coba lagi beberapa saat lagi.');
  }
}
