import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function publicFailure(error: unknown): { status: number; error: string } {
  if (error instanceof ZodError) return { status: 400, error: error.issues[0]?.message || 'Data tidak valid.' };
  if (error instanceof HttpError) return { status: error.status, error: error.message };
  return { status: 503, error: 'Permintaan gagal. Silakan coba lagi.' };
}
