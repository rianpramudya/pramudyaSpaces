import { AuthForm } from '@/components/auth-form';
import { configured } from '@/lib/supabase';
export const metadata={title:'Penyiapan pemilik',robots:{index:false,follow:false}};
export default function Register(){return <AuthForm register connected={configured()}/>;}
