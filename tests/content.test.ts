import test from 'node:test';
import assert from 'node:assert/strict';
import { projectPublicContent, translatePublicContent, sourceFingerprint, safeReturnPath } from '../src/lib/content';
import { emptyProfile } from '../src/lib/model';

test('public projection excludes drafts, private contacts and unlisted fields', () => {
 const profile = { ...emptyProfile, name: 'Rian', email: 'private@example.com', phone: '081', published: true, letter_body: 'private letter' };
 const records = [{ id: 'a', kind: 'project', title: 'Draft', published: false, position: 0, data: { secret: 'private' } }, { id: 'b', kind: 'project', title: 'Public', published: true, position: 1, data: { description: 'Visible', private_note: 'secret', media: ['photo.jpg'] } }];
 const result = projectPublicContent(profile, records);
 assert.equal(result.profile.email, ''); assert.equal(result.profile.phone, '');
 assert.equal(result.records.length, 1); assert.equal(result.records[0].title, 'Public');
 assert.equal(JSON.stringify(result).includes('private'), false);
});
test('unpublished profile has no content or contact leak', () => {
 const result = projectPublicContent({ ...emptyProfile, name: 'Hidden', email: 'hidden@test.com' }, []);
 assert.equal(result.profile.name, '');
});
test('translation cannot replace contacts, URLs, assets or publication flags', () => {
 const source = projectPublicContent({ ...emptyProfile, published: true, name: 'Rian', headline: 'Pengembang', show_email: true, email: 'a@test.com' }, []);
 const translated = translatePublicContent(source, { profile: { headline: 'Developer', email: 'evil@test.com', name: 'Changed', published: false } });
 assert.equal(translated.profile.headline, 'Developer'); assert.equal(translated.profile.name, 'Rian'); assert.equal(translated.profile.email, 'a@test.com');
});
test('fingerprint changes when source content changes', () => {
 assert.notEqual(sourceFingerprint({ title: 'A' }), sourceFingerprint({ title: 'B' }));
});
test('OAuth return path rejects external and protocol-relative URLs', () => {
 assert.equal(safeReturnPath('//evil.com'), '/'); assert.equal(safeReturnPath('https://evil.com'), '/'); assert.equal(safeReturnPath('/?guestbook=1'), '/?guestbook=1');
});
test('human-language entry titles are translated while technology names preserved',()=>{
 const source=projectPublicContent({...emptyProfile,published:true},[{id:'service',kind:'service',title:'Pengembangan aplikasi',published:true,position:0,data:{}},{id:'skill',kind:'skill',title:'Python',published:true,position:1,data:{category:'Backend'}}]);
 const translated=translatePublicContent(source,{records:[{id:'service',title:'Application development',data:{}},{id:'skill',title:'Python',data:{}}]});
 assert.equal(translated.records[0].title,'Application development');assert.equal(translated.records[1].title,'Python');
});
test('public editorial copy remains CMS-managed and translation-safe',()=>{
 const p={...emptyProfile,published:true,section_copy:{projects_title:'Karya saya',projects_description:'Deskripsi saya'}};
 const projected=projectPublicContent(p,[]);
 assert.equal(projected.profile.section_copy.projects_title,'Karya saya');
 const translated=translatePublicContent(projected,{profile:{section_copy:{projects_title:'My work'}}});
 assert.equal(translated.profile.section_copy.projects_title,'My work');
});
