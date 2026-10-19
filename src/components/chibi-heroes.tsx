import {sceneTheme} from '@/lib/visual-theme';
export function ChibiHero({character}:{character:'spider'|'gwen'}){
 const red=character==='spider';
 return <svg className="chibi-art" viewBox="0 0 64 76" aria-hidden="true" focusable="false">
 <ellipse cx="32" cy="73" rx="17" ry="2" fill={sceneTheme.black} opacity=".18"/>
 <g className="chibi-leg leg-back"><path d="M28 56 23 66 15 69" fill="none" stroke={red?sceneTheme.gray1:sceneTheme.gray1} strokeWidth="8" strokeLinecap="round"/><path d="m14 69 8 1" stroke={red?sceneTheme.gray2:sceneTheme.gray5} strokeWidth="5" strokeLinecap="round"/></g>
 <g className="chibi-leg leg-front"><path d="m35 56 6 9 8 3" fill="none" stroke={red?sceneTheme.gray1:sceneTheme.gray1} strokeWidth="8" strokeLinecap="round"/><path d="m46 68 8 1" stroke={red?sceneTheme.gray2:sceneTheme.gray5} strokeWidth="5" strokeLinecap="round"/></g>
 <g className="chibi-body"><path d="M25 43Q32 38 39 43L40 58Q32 63 24 58Z" fill={red?sceneTheme.gray2:sceneTheme.gray1} stroke={red?sceneTheme.gray1:sceneTheme.gray1} strokeWidth="1.5"/>
 {!red&&<path d="m25 43 7 8 7-8" fill="none" stroke={sceneTheme.white} strokeWidth="4"/>}
 <g className="chibi-arm arm-back"><path d="m25 45-10 8 1 6" fill="none" stroke={red?sceneTheme.gray2:sceneTheme.white} strokeWidth="7" strokeLinecap="round"/></g>
 <g className="chibi-arm arm-front"><path d="m39 45 10 7 3-7" fill="none" stroke={red?sceneTheme.gray2:sceneTheme.white} strokeWidth="7" strokeLinecap="round"/></g>
 {red&&<g stroke={sceneTheme.gray1} strokeWidth="1.4" fill="none"><ellipse cx="32" cy="49" rx="2" ry="3" fill={sceneTheme.gray1}/><path d="m30 47-4-3m4 5-5-1m5 3-4 3m8-7 4-3m-4 5 5-1m-5 3 4 3"/></g>}
 {red?<><path d="M11 22C11 7 21 3 32 3s21 4 21 19c0 15-9 23-21 23S11 37 11 22Z" fill={sceneTheme.gray2} stroke={sceneTheme.gray1} strokeWidth="1.7"/><g stroke={sceneTheme.gray1} strokeWidth="1" fill="none"><path d="M32 4v40M12 22h40M18 8l28 30M46 8 18 38M13 13q19 10 38 0M13 31q19-10 38 0M22 5q-6 19 0 36M42 5q6 19 0 36"/></g><path d="m17 18 12 6q-1 12-8 9-6-3-4-15Zm30 0-12 6q1 12 8 9 6-3 4-15Z" fill={sceneTheme.white} stroke={sceneTheme.gray1} strokeWidth="2.5" strokeLinejoin="round"/></>:<><path d="M8 24C8 8 19 2 32 2s24 6 24 22l-5 17H13Z" fill={sceneTheme.white} stroke={sceneTheme.gray4} strokeWidth="1.5"/><path d="M14 24c0-12 8-17 18-17s18 5 18 17l-5 14H19Z" fill={sceneTheme.gray3}/><path d="M18 24c0-9 6-13 14-13s14 4 14 13c0 13-6 19-14 19s-14-6-14-19Z" fill={sceneTheme.white}/><path d="m22 22 8 4q-1 9-5 7-4-2-3-11Zm20 0-8 4q1 9 5 7 4-2 3-11Z" fill={sceneTheme.white} stroke={sceneTheme.gray3} strokeWidth="2"/><path d="m11 25 4 5m-5 0 5 5m39-10-4 5m5 0-5 5" stroke={sceneTheme.gray3} strokeWidth="1"/></>}
 </g></svg>;
}
