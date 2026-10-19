import '../../admin.css';
import '../../admin-workspace.css';
import { redirect } from 'next/navigation';
import { currentUser,isOwner } from '@/lib/supabase';
export const metadata={title:'Dashboard admin',robots:{index:false,follow:false}};
export default async function AdminLayout({children}:{children:React.ReactNode}){const user=await currentUser();if(!user||!await isOwner(user.id))redirect('/admin/login');return children;}
