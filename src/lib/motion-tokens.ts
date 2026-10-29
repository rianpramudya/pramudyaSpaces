import type {CSSProperties} from 'react';
/** Single intensity control. Distances scale; reading and navigation timing stay predictable. */
export const MOTION = {
 intensity: 1,
 ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
 micro: 200, reveal: 600, stagger: 75, distance: 20, count: 1100,
 loader: 600, exit: 280, settle: 260, pageReveal: 280, pageStagger: 20, background: 660,
 fadeOut: 130, fadeIn: 180, introDelay: 80, exitItem: 160, exitStagger: 16,
 ambientPrimary: 18000, ambientSecondary: 22000,
} as const;
export const motionStyle = {
 '--ux-ease': MOTION.ease, '--ux-micro': `${MOTION.micro}ms`,
 '--ux-reveal': `${MOTION.reveal}ms`, '--ux-stagger': `${MOTION.stagger}ms`,
 '--ux-distance': `${MOTION.distance * MOTION.intensity}px`, '--ux-loader': `${MOTION.loader}ms`,
} as CSSProperties;
export function revealLineDelays(tops: readonly number[], stagger: number = MOTION.stagger): number[] {
 const lines: number[] = [];
 return tops.map(top => {
  let index = lines.findIndex(line => Math.abs(line - top) < 3);
  if (index < 0) { index = lines.length; lines.push(top); }
  return index * stagger;
 });
}
