import fs from 'node:fs';
import path from 'node:path';
const failures=[];
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())walk(file);else if(file.endsWith('.css')&&!file.endsWith('design-tokens.css')){const text=fs.readFileSync(file,'utf8');if(/#[\da-f]{3,8}\b/i.test(text))failures.push(`${file}: use palette tokens instead of hex colors`);if(/rgba?\(\s*\d/i.test(text))failures.push(`${file}: use palette RGB tokens`);for(const match of text.matchAll(/(?:font-size|font):([^;}]+)/g)){for(const value of match[1].matchAll(/\b(\d+(?:\.\d+)?)px\b/g))if(Number(value[1])<12)failures.push(`${file}: labels must be at least 12px`);}}}}
walk('src');
for(const file of ['sculpture-model','sculpture-renderer','portrait-model','portrait-renderer','hero-atmosphere','project-theatre-renderer']){const text=fs.readFileSync(`src/lib/${file}.ts`,'utf8');if(/0x[\da-f]{6}\b|['"]#[\da-f]{3,8}['"]/i.test(text))failures.push(`${file}: scene colors must use visual-theme`);}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}else console.log('UI lint passed: CSS tokens and shared monochrome scene palette.');
