import test from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';
import { HttpError, publicFailure } from '../src/lib/http-error';

test('unexpected failures never expose internal messages, stacks or authorization-like text', () => {
  for (const error of [new Error('database password=DO_NOT_EXPOSE'), new Error('Akses hanya INTERNAL DETAIL'), 'DO_NOT_EXPOSE', { message: 'DO_NOT_EXPOSE' }]) {
    const result = publicFailure(error);
    assert.equal(result.status, 503);
    assert.equal(JSON.stringify(result).includes('DO_NOT_EXPOSE'), false);
    assert.equal(JSON.stringify(result).includes('INTERNAL'), false);
    assert.deepEqual(Object.keys(result).sort(), ['error', 'status']);
  }
});

test('explicit public HTTP errors and validation failures retain actionable statuses', () => {
  assert.deepEqual(publicFailure(new HttpError(403, 'Akses hanya untuk pemilik.')), { status: 403, error: 'Akses hanya untuk pemilik.' });
  assert.equal(publicFailure(new HttpError(429, 'Batas penggunaan tercapai.')).status, 429);
  const validation = z.string().min(2, 'Nama terlalu pendek.').safeParse('');
  assert.equal(validation.success, false);
  if (!validation.success) assert.deepEqual(publicFailure(validation.error), { status: 400, error: 'Nama terlalu pendek.' });
});

test('invalid upload validation remains a safe actionable 400 after error sanitization', async () => {
  const { validateUpload } = await import('../src/lib/validation');
  for (const validate of [
    () => validateUpload(Buffer.from('fake'), 'image/png', 100),
    () => validateUpload(Buffer.from('%PDF-1.7'), 'application/pdf', 11 * 1024 * 1024),
  ]) {
    let rejected = false;
    try { validate(); } catch (error) {
      rejected = true;
      const result = publicFailure(error);
      assert.equal(result.status, 400);
      assert.ok(result.error.includes('MB') || result.error.includes('Berkas'));
    }
    assert.equal(rejected, true);
  }
});
