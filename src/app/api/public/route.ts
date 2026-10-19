import { api } from '@/lib/http';
import { getPublicContent } from '@/lib/repository';
export async function GET(request:Request){return api(request,async()=>getPublicContent());}
