import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { entrySchema } from '../src/lib/validation';
import { emptyProfile } from '../src/lib/model';
import { projectPublicContent, translatePublicContent } from '../src/lib/content';
import { ProjectDetail } from '../src/components/projects/project-detail';

test('verified project evidence survives validated input, public projection, translation and case rendering', () => {
  const project = entrySchema.parse({
    id: '11111111-1111-4111-8111-111111111111', kind: 'project', title: 'Published case',
    position: 0, published: true,
    data: { result: 'Documented outcome', result_source: 'https://example.com/report', paper: 'https://example.com/paper' },
  });
  assert.ok(project.id);
  const source = projectPublicContent({ ...emptyProfile, published: true }, [
    { ...project, id: project.id, data: { ...project.data, private_note: 'PRIVATE NOTE' } },
    { ...project, id: '22222222-2222-4222-8222-222222222222', published: false, title: 'PRIVATE DRAFT' },
  ]);
  assert.equal(source.records.length, 1);
  assert.equal(source.records[0].data.result_source, project.data.result_source);
  assert.equal(source.records[0].data.paper, project.data.paper);
  assert.ok(!JSON.stringify(source).includes('PRIVATE'));
  const translated = translatePublicContent(source, { records: [{ id: project.id, data: { result: 'Translated outcome', result_source: 'https://example.com/replacement' } }] });
  assert.equal(translated.records[0].data.result_source, project.data.result_source);
  for (const [content, en] of [[source, false], [translated, true]] as const) {
    const html = renderToStaticMarkup(React.createElement(ProjectDetail, { project: content.records[0], en }));
    assert.ok(html.includes('href="https://example.com/report"'));
    assert.ok(html.includes('href="https://example.com/paper"'));
    assert.ok(!html.includes('TODO: isi hasil terverifikasi'));
  }
});
