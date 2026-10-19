import { NextResponse } from 'next/server';
import { currentUser,isOwner,serviceClient } from '@/lib/supabase';
import { getPublicContent } from '@/lib/repository';
import { publicMediaPaths } from '@/lib/content';
export async function GET(request:Request,context:{params:Promise<{path:string[]}>}) {
 try{
 const path=(await context.params).path.join('/');if(path.includes('..')||!/^uploads\/[a-zA-Z0-9-]+\.(png|jpg|webp|pdf)$/.test(path))return new NextResponse('Tidak ditemukan',{status:404});
 const content=await getPublicContent();const allowed=publicMediaPaths(content).has(path);
 if(!allowed){const user=await currentUser();if(!await isOwner(user?.id))return new NextResponse('Tidak ditemukan',{status:404});}
 const db=serviceClient();const {data,error}=await db.storage.from('portfolio').download(path);if(error||!data)return new NextResponse('Tidak ditemukan',{status:404});
 const isPdf=path.endsWith('.pdf');
 return new NextResponse(await data.arrayBuffer(),{headers:{'Content-Type':isPdf?'application/pdf':path.endsWith('.png')?'image/png':path.endsWith('.webp')?'image/webp':'image/jpeg','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Disposition':`${new URL(request.url).searchParams.get('download')==='1'?'attachment':'inline'}; filename="${path.split('/').pop()}"`}});
 }catch{return new NextResponse('Media belum tersedia',{status:503});}
}
