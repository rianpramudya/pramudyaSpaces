import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/auth-form';
import { configured,currentUser,isOwner } from '@/lib/supabase';
export const metadata={title:'Masuk admin',robots:{index:false,follow:false}};
export default async function Login(){const user=await currentUser();if(await isOwner(user?.id))redirect('/admin');return <AuthForm connected={configured()}/>;}
