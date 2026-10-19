import test from 'node:test';
import assert from 'node:assert/strict';
import { bulkPublicationSchema,updatePublication } from '../src/lib/bulk-publication';
const a='b315d111-6b58-4984-896f-d54064d944cc',b='9302b521-74f7-4434-8655-34ce8c1b33f2';
test('bulk publication validates explicit IDs and boolean status',()=>{
 assert.deepEqual(bulkPublicationSchema.parse({ids:[a,a,b],published:false}),{ids:[a,b],published:false});
 for(const value of [{ids:[],published:true},{ids:['invalid'],published:true},{ids:[a],published:'true'}])assert.equal(bulkPublicationSchema.safeParse(value).success,false);
});
test('bulk entry publication changes only status and timestamp in selected section',async()=>{
 const calls:unknown[]=[];const query={update:(x:unknown)=>{calls.push(['update',x]);return query;},in:(column:string,ids:string[])=>{calls.push(['in',column,ids]);return query;},eq:(column:string,value:string)=>{calls.push(['eq',column,value]);return query;},select:async()=>({data:[{id:a},{id:b}],error:null})};
 const result=await updatePublication({from:(table:string)=>{calls.push(['from',table]);return query;}},'entries',[a,b],false,'project');
 assert.equal(result,2);assert.deepEqual(calls[0],['from','entries']);assert.deepEqual(calls[2],['in','id',[a,b]]);assert.deepEqual(calls[3],['eq','kind','project']);const update=(calls[1] as unknown[])[1] as Record<string,unknown>;assert.deepEqual(Object.keys(update).sort(),['published','updated_at']);assert.equal(update.published,false);
});
test('database failures are propagated rather than reporting bulk success',async()=>{
 const query={update:()=>query,in:()=>query,eq:()=>query,select:async()=>({data:null,error:{message:'failed'}})};
 await assert.rejects(updatePublication({from:()=>query},'documents',[a],true),/failed/);
});
test('bulk document publication updates only its visibility',async()=>{
 let updated:Record<string,unknown>={};const query={in:()=>query,eq:()=>query,select:async()=>({data:[{id:a}],error:null})};
 const db={from:()=>({update:(value:Record<string,unknown>)=>{updated=value;return query;}})};
 assert.equal(await updatePublication(db,'documents',[a],false),1);assert.deepEqual(updated,{published:false});
});
