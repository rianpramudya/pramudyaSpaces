import type { Metadata } from 'next';
import { PUBLIC_SITE_URL, SEO_TITLE, SEO_DESCRIPTION, publicPageMetadata } from '@/lib/seo';
import '@fontsource/barlow/latin-400.css';
import '@fontsource/barlow/latin-500.css';
import '@fontsource/barlow/latin-600.css';
import '@fontsource/barlow/latin-700.css';
import '@fontsource/barlow/latin-800.css';
import '@fontsource/barlow/latin-900.css';
import './globals.css';
import './portfolio.css';
import './immersive.css';
import './site-chrome.css';
import './design-tokens.css';
import './typography.css';
import './studio.css';
import './cinematic.css';
import './studio-layout.css';
import './page-loader.css';
import './studio-motion.css';
export const metadata: Metadata = {
  ...publicPageMetadata('/', SEO_TITLE, SEO_DESCRIPTION),
  metadataBase: new URL(PUBLIC_SITE_URL),
  title: { default: SEO_TITLE, template: '%s | Rian Pramudya — pramudyaSpaces' },
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id" suppressHydrationWarning><body><script dangerouslySetInnerHTML={{__html:"try{var t=localStorage.getItem('portfolio-theme');document.documentElement.dataset.theme=t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';}catch(e){}"}}/>{children}</body></html>;}
