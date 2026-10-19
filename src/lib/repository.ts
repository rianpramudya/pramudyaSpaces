import 'server-only';
import { configured,serviceClient } from './supabase';
import { emptyProfile,type Profile,type Entry,type CareerDocument } from './model';
import { projectPublicContent } from './content';
export async function getContent() {
 if(!configured()) return {profile:{...emptyProfile},records:[] as Entry[],documents:[] as CareerDocument[],connected:false};
 const db=serviceClient();
 const [p,e,d]=await Promise.all([db.from('profile').select('*').eq('id','main').single(),db.from('entries').select('*').order('position').order('id'),db.from('documents').select('*').order('created_at',{ascending:false})]);
 if(p.error||e.error||d.error) throw new Error('Konten tidak dapat dimuat dari database.');
 return {profile:{...emptyProfile,...p.data} as Profile,records:e.data as Entry[],documents:d.data as CareerDocument[],connected:true};
}
export async function getPublicContent() {
 const {profile,records,documents}=await getContent(); return projectPublicContent(profile,records,documents);
}
