'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { RunnerLeaderboard } from './runner-leaderboard';
import { useRunnerOnline, type ScoreSync } from './use-runner-online';
import { ChibiHero } from './chibi-heroes';
import { cinematicResolution } from '@/lib/cinematic-scene';
import { createRunner, startRunner, pauseRunner, stepRunner, runnerPlayerRect, RUNNER_RULES, type RunnerState } from '@/lib/runner-game';

const BEST_KEY = 'portfolio-runner-best';
function readBest() {
  try {
    const value = Number(localStorage.getItem(BEST_KEY));
    return Number.isInteger(value) && value >= 0 && value <= RUNNER_RULES.maxScore ? value : 0;
  } catch { return 0; }
}

type ViewProps = {
  language: 'id' | 'en'; state: RunnerState; best: number;
  onStart: () => void; onPause: () => void; onJump: () => void; onDuck: (pressed: boolean) => void;
  sound?: boolean; onSound?: () => void; sync?: ScoreSync;
};
export function RunnerView({ language, state, best, onStart, onPause, onJump, onDuck, sound = false, onSound, sync = 'local', children }: ViewProps & { children?: React.ReactNode }) {
  const en = language === 'en';
  const help = useId();
  const ended = state.phase === 'over';
  const running = state.phase === 'running';
  const status = ended ? `${en ? 'Game over. Score' : 'Permainan selesai. Skor'} ${state.score}` : state.phase === 'paused' ? (en ? 'Paused' : 'Dijeda') : running ? `${en ? 'Score' : 'Skor'} ${state.score}` : (en ? 'Ready to run?' : 'Siap berlari?');
  return <div className="runner-game">
    <div className="runner-scoreboard"><strong>SPACE RUN / 01</strong><span>{en ? 'Local best' : 'Terbaik lokal'} <b>{best}</b></span></div>
    <div className="runner-stage" tabIndex={0} role="group" aria-label={en ? 'Space Run game' : 'Permainan Space Run'} aria-describedby={help}
      onKeyDown={event => {
        if (event.target !== event.currentTarget || ![' ', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'ArrowDown') onDuck(true);
        else if (!event.repeat) onJump();
      }} onKeyUp={event => { if (event.key === 'ArrowDown') { event.preventDefault(); onDuck(false); } }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) onDuck(false); }}
      onPointerDown={event => { if (event.target instanceof HTMLButtonElement) return; event.currentTarget.focus({ preventScroll: true }); onJump(); }}>
      <canvas aria-hidden="true" width={960} height={280} />
      {children}
      {!running && <div className="runner-overlay"><strong>{status}</strong><button type="button" className="studio-button" disabled={sync === 'starting' || sync === 'saving'} onClick={state.phase === 'paused' ? onPause : onStart}>{state.phase === 'paused' ? (en ? 'Resume' : 'Lanjutkan') : ended ? (en ? 'Play again' : 'Main lagi') : (en ? 'Start' : 'Mulai')}</button></div>}
    </div>
    <div className="runner-controls">
      <button type="button" className="text-button" disabled={!running && state.phase !== 'paused'} onClick={onPause}>{running ? (en ? 'Pause' : 'Jeda') : (en ? 'Resume' : 'Lanjutkan')}</button>
      <button type="button" className="text-button" disabled={!running} onClick={onJump}>{en ? 'Jump ↑' : 'Lompat ↑'}</button>
      <button type="button" className="text-button runner-duck" disabled={!running} aria-label={en ? 'Hold to duck' : 'Tahan untuk menunduk'} onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); onDuck(true); }} onPointerUp={() => onDuck(false)} onPointerCancel={() => onDuck(false)} onKeyDown={event => { if ([' ', 'Enter'].includes(event.key)) { event.preventDefault(); onDuck(true); } }} onKeyUp={() => onDuck(false)} onBlur={() => onDuck(false)}>{en ? 'Duck ↓' : 'Menunduk ↓'}</button>
      {onSound && <button type="button" className="text-button" aria-pressed={sound} onClick={onSound}>{en ? (sound ? 'Sound on' : 'Sound off') : (sound ? 'Suara aktif' : 'Suara mati')}</button>}
      {state.reducedMotion && <span>{en ? 'Slow mode' : 'Mode lambat'}</span>}
    </div>
    <p id={help} className="runner-help">{en ? 'Focus the arena: Space / ↑ to jump, hold ↓ to duck. Tap to jump. Leaving the arena pauses the game.' : 'Fokuskan arena: Spasi / ↑ untuk lompat, tahan ↓ untuk menunduk. Ketuk untuk lompat. Game dijeda saat keluar layar.'}</p>
    <p className="runner-sync" role="status">{({
      local: en ? 'Local play · best score saved on this device' : 'Mode lokal · skor terbaik disimpan di perangkat ini',
      starting: en ? 'Preparing online score saving…' : 'Menyiapkan penyimpanan skor online…',
      online: en ? 'Online score saving is ready' : 'Skor siap disimpan online',
      saving: en ? 'Saving score…' : 'Menyimpan skor…',
      saved: en ? 'Score saved online' : 'Skor tersimpan online',
      failed: en ? 'Online save unavailable. Your local best is kept.' : 'Penyimpanan online belum berhasil. Skor terbaik lokal tetap disimpan.',
    })[sync]}</p>
    <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{status}</span>
  </div>;
}

export function RunnerGame({ language, onGuestbook }: { language: 'id' | 'en'; onGuestbook?: () => void }) {
  const online = useRunnerOnline();
  const onlineFinish = useRef(online.finish);
  const starting = useRef(false);
  useEffect(() => { onlineFinish.current = online.finish; }, [online.finish]);
  const root = useRef<HTMLDivElement>(null);
  const model = useRef(createRunner());
  const input = useRef({ jump: false, duck: false });
  const [snapshot, setSnapshot] = useState(model.current);
  const [best, setBest] = useState(0);
  const [sound, setSound] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const paint = useRef<() => void>(() => {});
  const publish = () => setSnapshot(model.current);
  const beep = () => {
    try {
      if (!sound) return;
      audio.current ??= new AudioContext();
      void audio.current.resume().catch(() => {});
      const oscillator = audio.current.createOscillator(), gain = audio.current.createGain();
      oscillator.frequency.value = 420; gain.gain.value = .025;
      gain.gain.exponentialRampToValueAtTime(.001, audio.current.currentTime + .1);
      oscillator.connect(gain); gain.connect(audio.current.destination); oscillator.start(); oscillator.stop(audio.current.currentTime + .1);
    } catch { /* Sound is optional when browser audio or storage is unavailable. */ }
  };
  const start = async () => {
    if (starting.current) return;
    starting.current = true;
    try {
      await online.begin();
      if (!root.current) return;
      model.current = startRunner(createRunner({ reducedMotion: model.current.reducedMotion, seed: Date.now() }));
      const arena = root.current.querySelector<HTMLElement>('.runner-stage');
      const bounds = arena?.getBoundingClientRect();
      const visible = document.visibilityState === 'visible' && bounds && bounds.bottom > 0 && bounds.top < innerHeight;
      if (!visible) model.current = pauseRunner(model.current, true);
      input.current = { jump: false, duck: false }; publish();
      if (visible) arena?.focus({ preventScroll: true });
    } finally { starting.current = false; }
  };
  const pause = () => { model.current = pauseRunner(model.current, model.current.phase === 'running'); input.current = { jump: false, duck: false }; publish(); };
  const jump = () => { if (model.current.phase !== 'running') return; input.current.jump = true; beep(); };

  useEffect(() => {
    const element = root.current;
    const canvas = element?.querySelector('canvas');
    const context = canvas?.getContext('2d');
    if (!element || !canvas || !context) return;
    let frame = 0, previous = 0, lastPublished = 0, inView = false, disposed = false;
    let logicalWidth = 960;
    let sprite: HTMLImageElement | null = null;
    let ink = '', muted = '', copper = '';
    function readColors() {
      const colors = getComputedStyle(element!);
      ink = colors.getPropertyValue('--studio-text').trim();
      muted = colors.getPropertyValue('--studio-muted').trim();
      copper = colors.getPropertyValue('--studio-copper').trim();
    }
    readColors();
    setBest(readBest());
    try { setSound(localStorage.getItem('portfolio-sound') === 'on'); } catch {}
    const svg = element.querySelector('svg');
    let spriteUrl = '';
    if (svg) {
      spriteUrl = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }));
      const image = new Image();
      image.onload = () => { if (!disposed) { sprite = image; draw(); } };
      image.src = spriteUrl;
    }
    function draw() {
      if (!context || !canvas) return;
      const state = model.current;
      context.setTransform(canvas.width / logicalWidth, 0, 0, canvas.height / RUNNER_RULES.height, 0, 0);
      context.clearRect(0, 0, logicalWidth, RUNNER_RULES.height);
      context.strokeStyle = muted; context.lineWidth = 1; context.beginPath(); context.moveTo(0, RUNNER_RULES.groundY + 1); context.lineTo(logicalWidth, RUNNER_RULES.groundY + 1); context.stroke();
      context.globalAlpha = .3;
      for (let x = -(state.distance % 48); x < logicalWidth; x += 48) { context.fillStyle = muted; context.fillRect(x, 240, 12, 1); }
      context.globalAlpha = 1;
      const player = runnerPlayerRect(state);
      if (sprite) context.drawImage(sprite, player.x - 5, player.y - 5, player.width + 10, player.height + 5);
      else { context.fillStyle = ink; context.fillRect(player.x, player.y, player.width, player.height); }
      for (const item of state.obstacles) {
        context.fillStyle = copper; context.fillRect(item.x, item.y, item.width, item.height);
        context.fillStyle = ink; context.font = '12px monospace';
        context.fillText(item.label, item.x, item.y - 9);
      }
      context.fillStyle = ink; context.font = '16px monospace'; context.textAlign = 'right'; context.fillText(String(state.score).padStart(5, '0'), logicalWidth - 20, 30); context.textAlign = 'left';
    }
    paint.current = draw;
    function resize() {
      const width = canvas!.clientWidth || 480;
      logicalWidth = Math.min(960, Math.max(480, width));
      const resolution = cinematicResolution(width, RUNNER_RULES.height, window.devicePixelRatio || 1);
      canvas!.width = resolution.width; canvas!.height = resolution.height; draw();
    }
    function stop() { cancelAnimationFrame(frame); frame = 0; previous = 0; input.current = { jump: false, duck: false }; model.current = pauseRunner(model.current, true); publish(); draw(); }
    function tick(now: number) {
      frame = 0;
      if (disposed || !inView || document.visibilityState !== 'visible') return;
      if (model.current.phase === 'running') {
        model.current = stepRunner(model.current, previous ? (now - previous) / 1000 : 1 / 60, input.current);
        input.current.jump = false;
        if (model.current.phase === 'over') {
          const score = model.current.score;
          void onlineFinish.current(score);
          const nextBest = Math.max(readBest(), score);
          setBest(old => Math.max(old, nextBest));
          try { localStorage.setItem(BEST_KEY, String(nextBest)); } catch { /* Local play still works without storage. */ }
          publish();
        } else if (now - lastPublished > 1000) { lastPublished = now; publish(); }
      }
      previous = now; draw();
      if (model.current.phase === 'running') frame = requestAnimationFrame(tick);
    }
    function wake() { if (!frame && inView && document.visibilityState === 'visible') { previous = 0; frame = requestAnimationFrame(tick); } }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    function preferences() {
      let motionOff = false; try { motionOff = localStorage.getItem('portfolio-motion') === 'off'; } catch {}
      const slow = reduced.matches || motionOff;
      if (slow !== model.current.reducedMotion) {
        model.current = pauseRunner({ ...model.current, reducedMotion: slow }, true);
        input.current = { jump: false, duck: false };
      }
      publish(); draw();
    }
    preferences();
    const observer = new IntersectionObserver(entries => { inView = entries[0]?.isIntersecting ?? false; if (!inView) stop(); else { draw(); wake(); } });
    observer.observe(canvas);
    const size = new ResizeObserver(resize); size.observe(canvas); resize();
    const theme = new MutationObserver(() => { readColors(); draw(); }); theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    const visibility = () => { if (document.visibilityState !== 'visible') stop(); else draw(); };
    document.addEventListener('visibilitychange', visibility);
    element.addEventListener('runner-wake', wake);
    reduced.addEventListener('change', preferences); window.addEventListener('portfolio-play-change', preferences);
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); size.disconnect(); theme.disconnect(); document.removeEventListener('visibilitychange', visibility); element.removeEventListener('runner-wake', wake); reduced.removeEventListener('change', preferences); window.removeEventListener('portfolio-play-change', preferences); if (spriteUrl) URL.revokeObjectURL(spriteUrl); void audio.current?.close(); audio.current = null; paint.current = () => {}; };
  }, []);
  useEffect(() => { root.current?.dispatchEvent(new Event('runner-wake')); paint.current(); }, [snapshot.phase]);
  return <div className="runner-experience" ref={root}><RunnerView language={language} state={snapshot} best={best} sync={online.sync} sound={sound} onSound={() => { const enabled = !sound; setSound(enabled); try { localStorage.setItem('portfolio-sound', enabled ? 'on' : 'off'); } catch {} }} onStart={start} onPause={pause} onJump={jump} onDuck={pressed => { input.current.duck = pressed; }}><span hidden><ChibiHero character="gwen" /></span></RunnerView><RunnerLeaderboard language={language} board={online.board} loading={online.loading} error={online.error} privacyBusy={online.privacyBusy} privacyError={online.privacyError} onPrivacy={hidden => void online.privacy(hidden)} onRefresh={() => void online.refresh()} onGuestbook={onGuestbook ? () => { if (model.current.phase === 'running') pause(); onGuestbook(); } : undefined} /></div>;
}
