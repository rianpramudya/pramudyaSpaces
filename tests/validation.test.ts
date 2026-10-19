import test from 'node:test';
import assert from 'node:assert/strict';
import { contactSchema, entrySchema, profileSchema, validateUpload } from '../src/lib/validation';
import { emptyProfile } from '../src/lib/model';
test('contact validates email and rejects oversize message',()=>{
 assert.equal(contactSchema.safeParse({name:'Rian',email:'bad',subject:'Hi',message:'Test message',website:''}).success,false);
 assert.equal(contactSchema.safeParse({name:'Rian',email:'a@test.com',subject:'Hi',message:'x'.repeat(5001),website:''}).success,false);
});
test('entry rejects unsafe link and unknown fields',()=>{
 assert.equal(entrySchema.safeParse({kind:'project',title:'Test',published:true,position:0,data:{url:'javascript:alert(1)'}}).success,false);
 const result=entrySchema.parse({kind:'project',title:'Test',published:true,position:0,data:{description:'Public',private_note:'secret'}});
 assert.equal('private_note' in result.data,false);
});
test('profile strips unsupported fields and validates social URLs',()=>{
 assert.equal(profileSchema.safeParse({...emptyProfile,socials:[{label:'Social',url:'javascript:alert(1)'}]}).success,false);
});
test('upload checks file signature, size and MIME',()=>{
 assert.throws(()=>validateUpload(Buffer.from('fake'),'image/png',100));
 assert.throws(()=>validateUpload(Buffer.from('%PDF-1.7'),'application/pdf',11*1024*1024));
 assert.equal(validateUpload(Buffer.from('%PDF-1.7'),'application/pdf',8),'pdf');
});

test('section copy accepts only bounded introductory text',async()=>{const {sectionDescriptionSchema}=await import('../src/lib/validation');assert.equal(sectionDescriptionSchema.safeParse({key:'projects_description',value:'Pengantar'}).success,true);assert.equal(sectionDescriptionSchema.safeParse({key:'name',value:'Changed'}).success,false);assert.equal(sectionDescriptionSchema.safeParse({key:'projects_description',value:'x'.repeat(2001)}).success,false);});
