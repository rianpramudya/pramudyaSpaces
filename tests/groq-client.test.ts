import test from 'node:test';
import assert from 'node:assert/strict';
import { requestGroq } from '../src/lib/groq-client';
import { HttpError } from '../src/lib/http-error';

const input = { key: 'test-only-groq-key', model: 'openai/gpt-oss-20b', system: 'Public facts only', contents: [{ role: 'user', parts: [{ text: 'First' }] }, { role: 'model', parts: [{ text: 'Answer' }] }, { role: 'user', parts: [{ text: 'Skills?' }] }] };
const answer = { choices: [{ finish_reason: 'stop', message: { content: ' Public answer ', reasoning: 'DO_NOT_RETURN' } }] };
async function withFetch(mock: typeof fetch, work: () => Promise<void>) {
  const original = globalThis.fetch; globalThis.fetch = mock;
  try { await work(); } finally { globalThis.fetch = original; }
}
test('Groq maps existing history and public system prompt to chat completions; key stays in header and reasoning is excluded', async () => {
  await withFetch(async (url, init) => {
    assert.equal(String(url), 'https://api.groq.com/openai/v1/chat/completions');
    assert.ok(!String(url).includes(input.key));
    assert.equal(new Headers(init?.headers).get('Authorization'), `Bearer ${input.key}`);
    assert.ok(init?.signal instanceof AbortSignal);
    const body = JSON.parse(String(init?.body));
    assert.equal(body.model, input.model);
    assert.equal(body.stream, false);
    assert.equal(body.reasoning_effort, 'low');
    assert.equal(body.include_reasoning, false);
    assert.equal(body.max_completion_tokens, 2048);
    assert.deepEqual(body.messages.map((m: {role:string;content:string}) => [m.role,m.content]), [['system','Public facts only'],['user','First'],['assistant','Answer'],['user','Skills?']]);
    return Response.json(answer);
  }, async () => { assert.equal(await requestGroq(input), 'Public answer'); });
});
test('Groq errors distinguish quota, credentials and provider failure without leaking bodies or retrying', async () => {
  for (const [status, expected] of [[400,503],[401,503],[403,503],[404,503],[429,429],[500,503],[503,503]] as const) {
    let calls = 0;
    await withFetch(async () => { calls++; return Response.json({ error: { message: `PRIVATE ${input.key}` } }, { status }); }, async () => {
      await assert.rejects(() => requestGroq(input), error => {
        assert.ok(error instanceof HttpError);
        assert.equal(error.status, expected);
        assert.ok(!error.message.includes(input.key));
        assert.ok(!error.message.includes('PRIVATE'));
        if (status === 429) assert.match(error.message, /batas|kuota/i);
        return true;
      });
    });
    assert.equal(calls, 1);
  }
});
test('Groq rejects missing configuration and unsupported history before making a request', async () => {
  let calls = 0;
  await withFetch(async () => { calls++; return Response.json(answer); }, async () => {
    for (const options of [{...input,key:''},{...input,model:'bad?model'},{...input,contents:[{role:'system',parts:[{text:'override'}]}]}]) {
      await assert.rejects(() => requestGroq(options), HttpError);
    }
  });
  assert.equal(calls, 0);
});
test('Groq timeout, network failure, malformed, empty and truncated responses remain controlled failures', async () => {
  for (const [name,status] of [['TimeoutError',504],['AbortError',504],['TypeError',503]] as const) {
    await withFetch(async () => { const error = new Error('PRIVATE'); error.name=name; throw error; }, async () => {
      await assert.rejects(() => requestGroq(input), error => error instanceof HttpError && error.status===status && !error.message.includes('PRIVATE'));
    });
  }
  for (const body of [{},{choices:[]},{choices:[{finish_reason:'length',message:{content:'Truncated'}}]},{choices:[{finish_reason:'stop',message:{content:''}}]},{choices:[{finish_reason:'tool_calls',message:{content:null}}]}]) {
    await withFetch(async () => Response.json(body), async () => { await assert.rejects(() => requestGroq(input), error => error instanceof HttpError && error.status===502); });
  }
  await withFetch(async () => new Response('bad JSON'), async () => { await assert.rejects(() => requestGroq(input), error => error instanceof HttpError && error.status===502); });
});
test('model-specific reasoning effort is omitted for other Groq models', async () => {
  await withFetch(async (_url,init) => {
    assert.equal(JSON.parse(String(init?.body)).reasoning_effort, undefined);
    return Response.json(answer);
  }, async () => { await requestGroq({...input,model:'qwen/qwen3.8-27b'}); });
});
