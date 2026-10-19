import { notFound } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/dashboard';
import { getContent } from '@/lib/repository';
import { currentUser } from '@/lib/supabase';
export const dynamic='force-dynamic';
export default async function AdminPage({params}:{params:Promise<{section?:string[]}>}){
 const {section}=await params;const tab=section?.[0]||'dashboard';
 if((section?.length||0)>1||!['dashboard','profile','project','experience','education','service','skill','certificate','achievement','language','documents','media','inbox','guestbook','translations','settings'].includes(tab))notFound();
 const content=await getContent();const user=await currentUser();return <AdminDashboard initial={content} tab={tab} accountEmail={user?.email||''}/>;
}
