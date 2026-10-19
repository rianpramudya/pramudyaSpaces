import { NextResponse } from 'next/server';
import { getEnglishContent } from '@/lib/translation';
import { getPublicContent } from '@/lib/repository';
import { originCheck,rateLimit } from '@/lib/http';
export async function GET(request:Request){
 try{originCheck(request);await rateLimit(request,'translation',30,3600);return NextResponse.json(await getEnglishContent(),{headers:{'Cache-Control':'private, no-store'}});}
 catch{try{return NextResponse.json({content:await getPublicContent(),fallback:true},{headers:{'Cache-Control':'private, no-store'}});}catch{return NextResponse.json({error:'Konten belum tersedia.'},{status:503});}}
}
