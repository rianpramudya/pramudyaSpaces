import test from 'node:test';
import assert from 'node:assert/strict';
import { answerPublicChat } from '../src/lib/portfolio-chat';
import { chatFacts } from '../src/lib/chat-context';
import { emptyProfile, type PublicContent } from '../src/lib/model';
const publicFacts: PublicContent = { profile: { ...emptyProfile, published:true, name: 'Rian', summary: 'Mengembangkan aplikasi web' }, records: [], documents: [] };
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
test('an exact owner-name question uses the published CMS name without calling AI, in ID and EN', async () => {
  for (const [language,message] of [['id','siapa nama lengkap pemilik portofolio ini?'],['en',"What is your full name?"]] as const) {
    const result=await answerPublicChat({language,message,history:[]},{
      readPublicContent:async()=>({...publicFacts,profile:{...publicFacts.profile,published:true,name:'Rian Pramudya Amanda'}}),
      generate:async()=>{throw new Error('Should not use tokens for the owner name');},
    });
    assert.match(result.answer,/Rian Pramudya Amanda/);
  }
});
test('a name shortcut must not answer questions about another person or an unpublished owner', async () => {
  for (const [message,published] of [['Siapa nama lengkap dosen Rian?',true],['Siapa nama lengkap pemilik portofolio ini?',false]] as const) {
    let calls=0;
    await answerPublicChat({language:'id',message,history:[]},{readPublicContent:async()=>({...publicFacts,profile:{...publicFacts.profile,published}}),generate:async()=>{calls++;return 'Unknown';}});
    assert.equal(calls,1);
  }
});
test('selected facts preserve contact visibility, omit draft records and carry explicit totals',()=>{
  const facts=chatFacts({...publicFacts,profile:{...publicFacts.profile,email:'HIDDEN_EMAIL',phone:'HIDDEN_PHONE',show_email:false,show_phone:false},records:[{id:'draft',kind:'project',title:'HIDDEN_DRAFT',published:false,position:0,data:{}},{id:'visible',kind:'skill',title:'Python',published:true,position:1,data:{}}]},'Skills?');
  const serialized=JSON.stringify(facts);
  assert.ok(!serialized.includes('HIDDEN'));
  assert.equal(facts.totals.skill,1);
  assert.equal(facts.totals.project,0);
  assert.equal(facts.records[0].title,'Python');
});
test('large portfolios send bounded relevant facts without assets, CV paths, or presentation metadata', async () => {
  const content:PublicContent={...publicFacts,profile:{...publicFacts.profile,published:true,summary:'A'.repeat(10000),photo:'DO_NOT_SEND_ASSETS',section_copy:{projects_description:'DO_NOT_SEND_COPY'}},records:Array.from({length:60},(_,i)=>({id:`id-${i}`,published:true,position:i,kind:i===59?'project':'education',title:i===59?'Stock dashboard':'Education '+i,data:{description:'B'.repeat(10000),media:['DO_NOT_SEND_MEDIA'],technologies:['Next.js'],organization:'University'}})),documents:[{id:'cv',title:'CV',format:'pdf',published:true,created_at:'',path:'DO_NOT_SEND_DOCUMENT'}]};
  const before=JSON.stringify(content);
  await answerPublicChat({language:'en',message:'Tell me about the Stock dashboard project',history:[]},{readPublicContent:async()=>content,generate:async(system)=>{
    assert.ok(system.length<6000);
    assert.ok(system.includes('Stock dashboard'));
    assert.ok(system.includes('/projects/id-59'));
    assert.ok(!system.includes('DO_NOT_SEND'));
    assert.match(system,/80 words/);
    return 'Answer';
  }});
  assert.equal(JSON.stringify(content),before);
});
test('only the latest complete pairs fit the history budget and the current question remains intact', async () => {
  const history=Array.from({length:5},(_,i)=>[{role:'user' as const,text:`Question ${i} `+'x'.repeat(1200)},{role:'model' as const,text:`Answer ${i} `+'y'.repeat(1200)}]).flat();
  await answerPublicChat({language:'en',message:'Current question',history},{readPublicContent:async()=>publicFacts,generate:async(_system,contents)=>{
    assert.equal(contents.length,5);
    assert.ok(contents[0].parts[0].text.startsWith('Question 3'));
    assert.ok(contents.slice(0,-1).reduce((sum,turn)=>sum+turn.parts[0].text.length,0)<=1200);
    assert.equal(contents.at(-1)?.parts[0].text,'Current question');
    return 'Answer';
  }});
});
