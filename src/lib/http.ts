import 'server-only';
import { NextResponse } from 'next/server';
import { createHmac } from 'node:crypto';
import { HttpError,publicFailure } from './http-error';
export { HttpError } from './http-error';
import { serviceClient } from './supabase';
import { allowedOrigin } from './origin-policy';
export function originCheck(request:Request) {
 const origin=request.headers.get('origin');
 if(!allowedOrigin(origin,request.url,process.env.SITE_URL)) throw new HttpError(403,'Permintaan berasal dari situs yang tidak diizinkan.');
}
export async function readJson(request:Request) {
 if(Number(request.headers.get('content-length')||0)>100000) throw new HttpError(413,'Data terlalu besar.');
 const raw=await request.text(); if(raw.length>100000) throw new HttpError(413,'Data terlalu besar.');
 try{return JSON.parse(raw);}catch{throw new HttpError(400,'Format data tidak valid.');}
}
export async function rateLimit(request:Request,scope:string,max:number,seconds:number,identity?:string) {
 const secret=process.env.RATE_LIMIT_SECRET||process.env.SUPABASE_SECRET_KEY;
 if(!secret) throw new HttpError(503,'Layanan belum dikonfigurasi.');
 // On Vercel this header is set by the platform; ignore visitor-controlled forwarded headers elsewhere.
 const ip=process.env.VERCEL ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()||'unknown' : 'local';
 const key=createHmac('sha256',secret).update(`${scope}:${identity||ip}`).digest('hex');
 const {data,error}=await serviceClient().rpc('consume_limit',{limit_key:key,maximum:max,window_seconds:seconds});
 if(error) throw new HttpError(503,'Pembatasan layanan belum tersedia. Coba lagi nanti.');
 if(!data) throw new HttpError(429,'Batas penggunaan tercapai. Silakan coba lagi nanti.');
}
export function failure(error:unknown) {
 const {status,error:message}=publicFailure(error);
 return NextResponse.json({error:message},{status,headers:{'Cache-Control':'private, no-store'}});
}
export async function api(request:Request,handler:()=>Promise<unknown>) {
 try{originCheck(request);return NextResponse.json(await handler(),{headers:{'Cache-Control':'private, no-store'}});}catch(error){return failure(error);}
}
