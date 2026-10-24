import test from 'node:test';
import assert from 'node:assert/strict';
import { requestGemini } from '../src/lib/gemini-client';
import { HttpError } from '../src/lib/http-error';
const input = { key: 'test-only-key', model: 'gemini-3.8-flash', system: 'Public profile only', contents: [{ role: 'user', parts: [{ text: 'What skills?' }] }] };
const answer = { candidates: [{ finishReason: 'STOP', content: { parts: [{ thought: true, text: 'PRIVATE_THOUGHT' }, { text: 'Public answer' }] } }] };
async function withFetch(mock: typeof fetch, work: () => Promise<void>) {
  const original = globalThis.fetch; globalThis.fetch = mock;
  try { await work(); } finally { globalThis.fetch = original; }
}
test('Gemini 3 chat uses low thinking, sufficient output budget, no deprecated sampling and never returns thoughts', async () => {
  await withFetch(async (url, init) => {
    assert.equal(String(url), 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent');
    assert.ok(!String(url).includes(input.key));
    const body = JSON.parse(String(init?.body));
    assert.equal(body.generationConfig.temperature, undefined);
    assert.equal(body.generationConfig.thinkingConfig.thinkingLevel, 'LOW');
    assert.ok(body.generationConfig.maxOutputTokens >= 4096);
    assert.equal(body.generationConfig.responseMimeType, undefined);
    assert.equal(init?.headers && new Headers(init.headers).get('x-goog-api-key'), input.key);
    return Response.json(answer);
  }, async () => { assert.equal(await requestGemini(input), 'Public answer'); });
});
test('translation retains JSON mode and larger budget; legacy model is not sent unsupported thinkingLevel', async () => {
  await withFetch(async (_url, init) => {
    const config = JSON.parse(String(init?.body)).generationConfig;
    assert.equal(config.responseMimeType, 'application/json');
    assert.equal(config.maxOutputTokens, 16384);
    assert.equal(config.thinkingConfig, undefined);
    return Response.json(answer);
  }, async () => { await requestGemini({ ...input, model: 'gemini-2.5-flash', json: true }); });
});
test('quota, credentials, missing model and server failures produce distinct safe errors without retries', async () => {
  for (const [upstream, expected] of [[429,429],[400,503],[401,503],[402,503],[403,503],[404,503],[500,503],[503,503]] as const) {
    let calls = 0;
    await withFetch(async () => { calls++; return Response.json({ error: { message: 'SECRET_PROVIDER_DETAIL test-only-key' } }, { status: upstream }); }, async () => {
      await assert.rejects(() => requestGemini(input), error => {
        assert.ok(error instanceof HttpError); assert.equal(error.status, expected);
        assert.ok(!error.message.includes('SECRET_PROVIDER_DETAIL')); assert.ok(!error.message.includes(input.key));
        if (upstream === 429) assert.match(error.message, /Kuota Gemini/);
        if (upstream === 404) assert.match(error.message, /model/i);
        if (upstream === 403) assert.match(error.message, /akses|izin/i);
        return true;
      });
    });
    assert.equal(calls, 1);
  }
});
test('timeouts and transport failures are actionable; incomplete and malformed output never report success', async () => {
  for (const [name, status] of [['TimeoutError',504],['AbortError',504],['TypeError',503]] as const) {
    await withFetch(async () => { const error = new Error('secret-url'); error.name = name; throw error; }, async () => {
      await assert.rejects(() => requestGemini(input), error => error instanceof HttpError && error.status === status && !error.message.includes('secret-url'));
    });
  }
  for (const response of [{}, { candidates: [{ finishReason: 'MAX_TOKENS', content: { parts: [{ text: 'Truncated' }] } }] }, { candidates: [{ finishReason: 'SAFETY' }] }]) {
    await withFetch(async () => Response.json(response), async () => { await assert.rejects(() => requestGemini(input), HttpError); });
  }
});
test('missing key and invalid model fail before making a network request', async () => {
  await withFetch(async () => { throw new Error('Must not fetch'); }, async () => {
    for (const options of [{ ...input, key: '' }, { ...input, model: 'bad/model?key=secret' }]) await assert.rejects(() => requestGemini(options), HttpError);
  });
});
test('Google HTTP 400 invalid-key reason is distinguished from parameter errors without exposing its body', async () => {
  await withFetch(async () => Response.json({ error: { message: 'DO_NOT_EXPOSE', details: [{ reason: 'API_KEY_INVALID' }] } }, { status: 400 }), async () => {
    await assert.rejects(() => requestGemini(input), error => error instanceof HttpError && /key Gemini tidak valid/.test(error.message) && !error.message.includes('DO_NOT_EXPOSE'));
  });
});
test('invalid JSON is a bad gateway, while timing out during response decoding remains a timeout', async () => {
  await withFetch(async () => new Response('bad JSON'), async () => {
    await assert.rejects(() => requestGemini(input), error => error instanceof HttpError && error.status === 502);
  });
  await withFetch(async () => {
    const response = Response.json(answer);
    response.json = async () => { const error = new Error('private response details'); error.name = 'TimeoutError'; throw error; };
    return response;
  }, async () => { await assert.rejects(() => requestGemini(input), error => error instanceof HttpError && error.status === 504); });
});
