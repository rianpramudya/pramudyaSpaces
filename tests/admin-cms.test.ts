import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { EntryEditor } from '../src/components/admin/entry-editor';
import { ProfileEditor } from '../src/components/admin/profile-editor';
import { MediaField } from '../src/components/admin/fields';
import { AdminDashboard } from '../src/components/admin/dashboard';
import { DocumentsPanel } from '../src/components/admin/documents';
import { emptyProfile,kinds } from '../src/lib/model';
import { entrySchema } from '../src/lib/validation';
const handlers={onSaved:async()=>{},notify:()=>{},onClose:()=>{}};
test('new experience asks for one job title and omits redundant role input',()=>{
 const html=renderToStaticMarkup(React.createElement(EntryEditor,{kind:'experience',...handlers}));
 assert.ok(html.includes('Jabatan / Posisi'));assert.ok(!html.includes('Keterangan jabatan tambahan'));assert.ok(!html.includes('Peran / Jabatan'));
});
test('editing ongoing experience preserves legacy details and disables end date',()=>{
 const html=renderToStaticMarkup(React.createElement(EntryEditor,{kind:'experience',entry:{id:'a',kind:'experience',title:'Engineer',position:0,published:false,data:{role:'Team lead',current:true,end:'2025'}},...handlers}));
 assert.ok(html.includes('Team lead'));assert.match(html,/<input(?=[^>]*value="2025")(?=[^>]*disabled="")[^>]*>/);
});
test('projects offer existing skills and media fields reuse stored assets',()=>{
 const html=renderToStaticMarkup(React.createElement(EntryEditor,{kind:'project',skills:['React','React','Next.js'],...handlers}));
 assert.equal((html.match(/>React<\/button>/g)||[]).length,1);assert.ok(html.includes('Next.js'));assert.ok(html.includes('Pilih media tersimpan'));
 const media=renderToStaticMarkup(React.createElement(MediaField,{paths:[],onChange:()=>{}}));assert.ok(media.includes('Pilih media tersimpan'));
});
test('profile only edits its own identity and contact copy, not other section forms',()=>{
 const html=renderToStaticMarkup(React.createElement(ProfileEditor,{initial:emptyProfile,...handlers}));
 assert.ok(!html.includes('Teks bagian website'));assert.ok(!html.includes('Proyek — Judul'));assert.ok(html.includes('Pengantar bagian kontak (opsional)'));
});
test('saving removes duplicate technology names and redundant experience role without losing distinct data',()=>{
 const base={kind:'experience',title:'Engineer',published:false,position:0,data:{role:'Engineer',organization:'Company',technologies:['React','React','']}};
 const entry=entrySchema.parse(base);assert.equal(entry.data.role,undefined);assert.equal(entry.data.organization,'Company');assert.deepEqual(entry.data.technologies,['React']);
 const distinct=entrySchema.parse({...base,data:{role:'Team lead'}});assert.equal(distinct.data.role,'Team lead');
});

test('every CMS collection provides selection and both bulk visibility actions',()=>{
 for(const kind of kinds){const html=renderToStaticMarkup(React.createElement(AdminDashboard,{tab:kind,accountEmail:'owner@example.com',initial:{profile:emptyProfile,documents:[],connected:true,records:[{id:'a',kind,title:'Item',position:0,published:false,data:{}}]}}));assert.ok(html.includes('Pilih semua item yang ditampilkan'));assert.ok(html.includes('Pilih Item'));assert.ok(html.includes('Terbitkan pilihan'));assert.ok(html.includes('Jadikan draft'));}
});
test('documents provide the same explicit publication selection',()=>{
 const html=renderToStaticMarkup(React.createElement(DocumentsPanel,{profile:emptyProfile,documents:[{id:'a',title:'CV',format:'ats',path:'uploads/cv.pdf',published:false,created_at:'2026-10-11'}],onSaved:async()=>{},notify:()=>{}}));assert.ok(html.includes('Pilih CV'));assert.ok(html.includes('Pilih semua item yang ditampilkan'));assert.ok(html.includes('Terbitkan pilihan'));assert.ok(html.includes('Jadikan draft'));
});

test('section introductions are managed in their own CMS collection',()=>{
 for(const tab of ['project','experience','service','skill','certificate']){const html=renderToStaticMarkup(React.createElement(AdminDashboard,{tab,accountEmail:'owner@example.com',initial:{profile:emptyProfile,documents:[],connected:true,records:[]}}));assert.ok(html.includes('Pengantar bagian di halaman tamu'));assert.ok(html.includes('Pengantar singkat'));}
});
