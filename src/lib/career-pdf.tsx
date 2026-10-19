import React from 'react';
import path from 'node:path';
import { Document,Page,Text,View,StyleSheet,Font,renderToBuffer,Link } from '@react-pdf/renderer';
import { buildCareerSections } from './career-data';
import type { Profile,Entry } from './model';
Font.register({family:'Inter',fonts:[{src:path.join(process.cwd(),'public/fonts/inter-regular.ttf'),fontWeight:400},{src:path.join(process.cwd(),'public/fonts/inter-semibold.ttf'),fontWeight:600}]});
Font.registerHyphenationCallback(word=>[word]);
const styles=StyleSheet.create({page:{padding:40,fontFamily:'Inter',fontSize:9,lineHeight:1.5,color:'#18191B'},name:{fontSize:21,fontWeight:600,textAlign:'center',marginBottom:8},headline:{fontSize:11,textAlign:'center',marginTop:3},contact:{fontSize:8,textAlign:'center',marginTop:5,marginBottom:12},heading:{fontSize:11,fontWeight:600,borderBottomWidth:0.7,borderBottomColor:'#555',paddingBottom:3,marginTop:12,marginBottom:6},title:{fontSize:10,fontWeight:600,marginBottom:2},meta:{fontSize:8,marginBottom:3,color:'#555'},item:{marginBottom:7},line:{marginBottom:2},link:{fontSize:8,color:'#3156B8',marginBottom:3},footer:{position:'absolute',bottom:20,right:40,fontSize:7,color:'#666'},creative:{borderLeftWidth:5,borderLeftColor:'#3156B8',paddingLeft:13},letter:{fontSize:10,lineHeight:1.8,marginTop:20}});
export function CareerPDF({profile,records,format}:{profile:Profile;records:Entry[];format:'ats'|'creative'|'letter'}){
 const sections=buildCareerSections(profile,records);
 const contacts=[profile.phone,profile.email,...profile.socials.map(s=>s.url)].filter(Boolean).join(' | ');
 return <Document title={`${profile.name} – ${format==='letter'?'Surat lamaran':'CV'}`} author={profile.name}><Page size="A4" style={styles.page} wrap>
  <View style={format==='creative'?styles.creative:{}}><Text style={styles.name}>{profile.name}</Text>{profile.headline&&<Text style={styles.headline}>{profile.headline}</Text>}<Text style={styles.contact}>{contacts}</Text></View>
  {format==='letter'?<View style={styles.letter}>
   <Text>{profile.letter_recipient}</Text><Text>{profile.letter_role}</Text><Text style={{marginTop:18}}>{profile.letter_body}</Text><Text style={{marginTop:24}}>{profile.name}</Text>
  </View>:sections.map(section=><View key={section.title}>
   <Text style={styles.heading} minPresenceAhead={45}>{section.title}</Text>
   {section.items.map((item,i)=><View key={i} style={styles.item}>
    {item.title&&<Text style={styles.title} minPresenceAhead={55}>{item.title}</Text>}{item.meta&&<Text style={styles.meta}>{item.meta}</Text>}
    {item.url&&<Link style={styles.link} src={item.url}>{item.url}</Link>}
    {item.lines.map((line,j)=><Text key={j} style={styles.line}>{section.title==='PROFESSIONAL SUMMARY'||section.title==='SKILLS & COMPETENCIES'?line:`• ${line}`}</Text>)}
   </View>)}
  </View>)}
  <Text style={styles.footer} fixed render={({pageNumber,totalPages})=>`${pageNumber} / ${totalPages}`}/>
 </Page></Document>;
}
export async function renderCareerPDF(profile:Profile,records:Entry[],format:'ats'|'creative'|'letter'){return renderToBuffer(<CareerPDF profile={profile} records={records} format={format}/>);}
