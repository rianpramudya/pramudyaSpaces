'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { requestJSON } from '@/lib/client-api';
import type { Leaderboard } from '@/lib/game-score';
export type RunnerBoard = Leaderboard & { authenticated: boolean };
export type ScoreSync = 'local' | 'starting' | 'online' | 'saving' | 'saved' | 'failed';
export function useRunnerOnline() {
  const [board, setBoard] = useState<RunnerBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [privacyBusy, setPrivacyBusy] = useState(false);
  const [privacyError, setPrivacyError] = useState(false);
  const [sync, setSync] = useState<ScoreSync>('local');
  const session = useRef<string | null>(null);
  const controllers = useRef(new Set<AbortController>());
  const revision = useRef(0);
  const mounted = useRef(true);
  const request = useCallback(async <T,>(url: string, body?: unknown, method?: string) => {
    const controller = new AbortController();
    controllers.current.add(controller);
    const timer = setTimeout(() => controller.abort(), 5000);
    try { return await requestJSON<T>(url, body, method, controller.signal); }
    finally { clearTimeout(timer); controllers.current.delete(controller); }
  }, []);
  const refresh = useCallback(async () => {
    const current = ++revision.current;
    setLoading(true);
    try {
      const next = await request<RunnerBoard>('/api/game/leaderboard');
      if (mounted.current && current === revision.current) { setBoard(next); setError(false); }
    } catch { if (mounted.current && current === revision.current) { setError(true); setBoard(null); } }
    finally { if (mounted.current && current === revision.current) setLoading(false); }
  }, [request]);
  useEffect(() => {
    mounted.current = true;
    void refresh();
    const update = () => { if (document.visibilityState === 'visible') void refresh(); };
    const authChanged = () => { session.current = null; setBoard(null); setSync('local'); void refresh(); };
    window.addEventListener('focus', update);
    window.addEventListener('portfolio-auth-change', authChanged);
    return () => { mounted.current = false; revision.current++; for (const controller of controllers.current) controller.abort(); window.removeEventListener('focus', update); window.removeEventListener('portfolio-auth-change', authChanged); };
  }, [refresh]);
  async function begin() {
    session.current = null;
    if (!board?.authenticated || error) { setSync('local'); return; }
    setSync('starting');
    try {
      const result = await request<{ session: string }>('/api/game/session', {});
      if (mounted.current) { session.current = result.session; setSync('online'); }
    } catch { if (mounted.current) setSync('failed'); }
  }
  async function finish(score: number) {
    const token = session.current;
    session.current = null;
    if (!token) return;
    setSync('saving');
    try {
      await request('/api/game/score', { session: token, score });
      if (mounted.current) { setSync('saved'); await refresh(); }
    } catch { if (mounted.current) setSync('failed'); }
  }
  async function privacy(hidden: boolean) {
    if (privacyBusy) return;
    setPrivacyBusy(true); setPrivacyError(false);
    try { await request('/api/game/privacy', { show_on_board: !hidden }, 'PATCH'); if (mounted.current) await refresh(); }
    catch { if (mounted.current) setPrivacyError(true); }
    finally { if (mounted.current) setPrivacyBusy(false); }
  }
  return { board, loading, error, privacyBusy, privacyError, sync, refresh, begin, finish, privacy };
}
