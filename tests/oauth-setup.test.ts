import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {OAuthSetup} from '../src/components/admin/oauth-setup';
test('provider setup shows separate site redirects and Supabase callback with provider dashboard links',()=>{
 const html=renderToStaticMarkup(React.createElement(OAuthSetup,{config:{siteURL:'http://127.0.0.1:3100',callbackURL:'https://project.supabase.co/auth/v1/callback',projectRef:'project'}}));
 assert.ok(html.includes('http://127.0.0.1:3100/auth/callback**'));
 assert.ok(html.includes('https://project.supabase.co/auth/v1/callback'));
 assert.ok(html.includes('https://github.com/settings/developers'));
 assert.ok(html.includes('https://console.cloud.google.com/auth/overview'));
 assert.ok(html.includes('https://supabase.com/dashboard/project/project/auth/providers'));
 assert.ok(html.includes('Admin memakai email dan password'));
});
