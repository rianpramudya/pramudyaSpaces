import test from 'node:test';
import assert from 'node:assert/strict';
import { answerPublicChat } from '../src/lib/portfolio-chat';
import { emptyProfile, type PublicContent } from '../src/lib/model';
const publicFacts: PublicContent = { profile: { ...emptyProfile, name: 'Rian', summary: 'Mengembangkan aplikasi web' }, records: [], documents: [] };
test('ID and EN chat read original public facts once and generate only one answer without a translation step', async () => {
  for (const language of ['id', 'en'] as const) {
    let reads = 0, calls = 0;
    const result = await answerPublicChat({ language, message: 'Skills?', history: [] }, {
      readPublicContent: async () => { reads++; return publicFacts; },
      generate: async (system, contents) => {
        calls++;
        assert.ok(system.includes(language === 'en' ? 'Answer in English' : 'Answer in Indonesian'));
        assert.ok(system.includes('Mengembangkan aplikasi web'));
        assert.ok(system.includes('Use ONLY the public facts'));
        assert.deepEqual(contents, [{ role: 'user', parts: [{ text: 'Skills?' }] }]);
        return 'Answer';
      },
    });
    assert.deepEqual(result, { answer: 'Answer' });
    assert.equal(reads, 1); assert.equal(calls, 1);
  }
});
test('failed and orphan history turns do not become invalid consecutive user/model-prefill turns', async () => {
  await answerPublicChat({ language: 'en', message: 'Current', history: [{ role: 'model', text: 'orphan' }, { role: 'user', text: 'First' }, { role: 'model', text: 'Completed' }, { role: 'user', text: 'Failed' }] }, {
    readPublicContent: async () => publicFacts,
    generate: async (_system, contents) => {
      assert.deepEqual(contents.map(turn => [turn.role, turn.parts[0].text]), [['user', 'First'], ['model', 'Completed'], ['user', 'Current']]);
      return 'Answer';
    },
  });
});
