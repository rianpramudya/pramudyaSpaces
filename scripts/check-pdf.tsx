import { renderCareerPDF } from '../src/lib/career-pdf';
import { emptyProfile,type Entry } from '../src/lib/model';
import { writeFile } from 'node:fs/promises';
async function main(){
 const records:Entry[]=Array.from({length:20},(_,i)=>({id:String(i),kind:'project',title:`Project ${i+1}`,published:false,position:i,data:{description:'Long project description. '.repeat(25),bullets:['Exact contribution from CMS. '.repeat(10)],url:'https://example.com/project'}}));
 for(const format of ['ats','creative','letter'] as const){const buffer=await renderCareerPDF({...emptyProfile,name:'RIAN PRAMUDYA AMANDA',headline:'Full Stack Web Developer & AI Enthusiast',summary:'Professional summary from CMS.',email:'private@example.com',letter_recipient:'Recruiter',letter_role:'Developer',letter_body:'Manual letter content. '.repeat(300)},records,format);await writeFile(`/tmp/pramudya-${format}.pdf`,buffer);console.log(format,buffer.length);}
}
main();
