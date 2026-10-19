import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {SiteHeader,SiteFooter} from '../src/components/site-chrome';
import {emptyProfile} from '../src/lib/model';
const nav=[['home','Beranda'],['projects','Karya CMS'],['about','Tentang'],['skills','Alat CMS'],['journey','Perjalanan CMS'],['contact','Kontak CMS']];
test('header keeps CMS navigation, native overflow menu and bilingual/theme controls',()=>{
 const html=renderToStaticMarkup(React.createElement(SiteHeader,{profile:{...emptyProfile,name:'Dewi Putri'},nav,en:false,away:false,activeSection:'skills',theme:'light',onLanguage:()=>{},onTheme:()=>{}}));
 for(const value of ['DP','Dewi Putri','Karya CMS','Alat CMS','Perjalanan CMS','<details','<summary','aria-controls="public-navigation"','aria-expanded="false"','Ganti ke bahasa Inggris','Ganti tema'])assert.ok(html.includes(value),value);
 assert.ok(html.includes('data-active="true"'));assert.ok(!html.includes('/admin'));
});
test('header and footer route every section back to home from archive/detail pages',()=>{
 const profile={...emptyProfile,name:'Dewi Putri'};
 const header=renderToStaticMarkup(React.createElement(SiteHeader,{profile,nav,en:true,away:true,activeSection:'home',theme:'dark',onLanguage:()=>{},onTheme:()=>{}}));
 const footer=renderToStaticMarkup(React.createElement(SiteFooter,{profile,nav,en:true,away:true}));
 for(const id of ['home','projects','about','skills','journey','contact'])assert.ok(header.includes(`href="/#${id}"`),id);
 for(const id of ['projects','about','contact','playground'])assert.ok(footer.includes(`href="/#${id}"`),id);
 assert.ok(!header.includes('aria-current="location"'));assert.ok(footer.includes('Back to top'));
});
test('footer uses CMS identity/socials and never reveals contact marked private',()=>{
 const profile={...emptyProfile,name:'Dewi Putri',wordmark:'Dewi Studio',location:'CMS city',email:'private@example.com',show_email:false,socials:[{label:'Code profile',url:'https://example.com/code'}]};
 const html=renderToStaticMarkup(React.createElement(SiteFooter,{profile,nav,en:false,away:false}));
 for(const value of ['Dewi Studio','Dewi','CMS city','Code profile','href="https://example.com/code"','noopener noreferrer','Karya CMS','data-experience="signature-footer"'])assert.ok(html.includes(value),value);
 assert.ok(!html.includes('private@example.com'));assert.ok(!html.includes('>Rian<'));
 const publicHtml=renderToStaticMarkup(React.createElement(SiteFooter,{profile:{...profile,show_email:true},nav,en:true,away:false}));assert.ok(publicHtml.includes('mailto:private@example.com'));
});
test('empty footer keeps useful contact/play/top links without empty social or mail links',()=>{
 const html=renderToStaticMarkup(React.createElement(SiteFooter,{profile:emptyProfile,nav:[],en:false,away:false}));
 assert.ok(html.includes('Portfolio'));assert.ok(html.includes('href="#contact"'));assert.ok(html.includes('href="#playground"'));assert.ok(html.includes('href="#main"'));assert.ok(!html.includes('mailto:'));assert.ok(!html.includes('footer-socials'));
});
